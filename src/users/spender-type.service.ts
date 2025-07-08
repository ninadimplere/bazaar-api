import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SpenderType } from '@prisma/client';

@Injectable()
export class SpenderTypeService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Updates a user's spender type based on their order history
   * NEW: User who hasn't placed any orders
   * ONE_TIME: User who has placed at least one order
   * FREQUENT: User who has placed at least one order every week for 4 consecutive weeks
   * HIGH_SPENDER: User whose average order value is more than 5000 rupees
   * @param userId The user ID to update
   */
  async updateUserSpenderType(userId: string): Promise<void> {
    // Get all user orders
    const orders = await this.prismaService.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (orders.length === 0) {
      // User has no orders, should be marked as NEW
      await this.prismaService.user.update({
        where: { id: userId },
        data: { spenderType: SpenderType.NEW },
      });
      return;
    }    // User has at least one order, mark as ONE_TIME at minimum
    let userSpenderType: SpenderType = SpenderType.ONE_TIME;

    // Calculate average order value
    const totalOrderValue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const averageOrderValue = totalOrderValue / orders.length;

    // Check if user is a HIGH_SPENDER (average order value > 5000 rupees)
    if (averageOrderValue > 5000) {
      userSpenderType = SpenderType.HIGH_SPENDER;
    } else {
      // Check if user is a FREQUENT spender (at least one order every week for 4 consecutive weeks)
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

      // Get orders from the last 4 weeks
      const recentOrders = orders.filter(order => order.createdAt >= fourWeeksAgo);

      // Group orders by week
      const ordersByWeek = new Map<number, boolean>();
      
      recentOrders.forEach(order => {
        const weekNumber = this.getWeekNumber(order.createdAt);
        ordersByWeek.set(weekNumber, true);
      });

      // Check if user has placed orders in each of the last 4 weeks
      const currentWeek = this.getWeekNumber(new Date());
      let consecutiveWeeks = 0;
      
      for (let week = currentWeek; week > currentWeek - 4; week--) {
        if (ordersByWeek.has(week)) {
          consecutiveWeeks++;
        } else {
          break;
        }
      }

      if (consecutiveWeeks >= 4) {
        userSpenderType = SpenderType.FREQUENT;
      }
    }

    // Update user's spender type
    await this.prismaService.user.update({
      where: { id: userId },
      data: { spenderType: userSpenderType },
    });
  }

  /**
   * Returns the ISO week number for a given date
   * @param date The date to get the week number for
   * @returns The ISO week number (1-53)
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
}
