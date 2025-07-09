import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { SpenderTypeService } from '../users/spender-type.service';

@Injectable()
export class ScheduledTasksService {
  private readonly logger = new Logger(ScheduledTasksService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly spenderTypeService: SpenderTypeService,
  ) {}

  /**
   * Updates all users' spender types once a day
   * This ensures that spender type classifications remain accurate
   * even when orders age or spending patterns change
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateAllUserSpenderTypes() {
    this.logger.log('Starting daily update of all user spender types');
    
    try {
      const users = await this.prismaService.user.findMany({
        select: { id: true },
      });
      
      this.logger.log(`Found ${users.length} users to update`);
      
      let updatedCount = 0;
      for (const user of users) {
        try {
          await this.spenderTypeService.updateUserSpenderType(user.id);
          updatedCount++;
        } catch (error) {
          this.logger.error(`Error updating spender type for user ${user.id}`, error.stack);
        }
      }
      
      this.logger.log(`Successfully updated spender types for ${updatedCount} users`);
    } catch (error) {
      this.logger.error('Error during daily spender type update', error.stack);
    }
  }
}
