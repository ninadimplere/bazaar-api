import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client'; // Import Prisma enum
import { CreateSellerReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createSellerReview(userId: string, dto: CreateSellerReviewDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { SellerOrder: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${dto.orderId} not found.`);
    }
    if (order.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to review this order.',
      );
    }
    // Check if the order is completed/delivered
    const allowedStatuses: OrderStatus[] = ['DELIVERED', 'COMPLETED'];
    if (!allowedStatuses.includes(order.orderStatus)) {
      throw new BadRequestException(
        'Order must be delivered or completed to be reviewed.',
      );
    }

    // Check for existing review (Unique constraint on orderId should prevent this, but check provides clean error)
    const existingReview = await this.prisma.sellerReview.findUnique({
      where: { orderId: dto.orderId },
    });
    if (existingReview) {
      throw new BadRequestException('This order has already been reviewed.');
    }

    // Determine the Seller ID (assuming one seller per order in your simplified schema flow)
    const sellerId = order.SellerOrder[0]?.sellerId;
    if (!sellerId) {
      throw new NotFoundException('Seller information missing for this order.');
    }

    return this.prisma.sellerReview.create({
      data: {
        userId: userId,
        sellerId: sellerId,
        orderId: dto.orderId,
        rating: dto.rating,
        comment: dto.comment,
        // moderationStatus: 'NEW', // Assuming a default moderation status field
      },
      select: { id: true, rating: true, comment: true },
    });
  }

  async findPublishedReviews(
    sellerId: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const skip = (page - 1) * pageSize;

    return this.prisma.sellerReview.findMany({
      where: {
        sellerId: sellerId,
        // moderationStatus: 'PUBLISHED', // Filter for published reviews
      },
      include: {
        user: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    });
  }

  async getSellerRatingStats(sellerId: string) {
    const stats = await this.prisma.sellerReview.aggregate({
      _avg: { rating: true },
      _count: true,
      where: {
        sellerId: sellerId,
        // moderationStatus: 'PUBLISHED',
      },
    });

    return {
      averageRating: parseFloat(stats._avg.rating?.toFixed(2) || '0.00'),
      totalReviews: stats._count,
    };
  }

  async checkReviewStatus(userId: string, orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }
    if (order.userId !== userId) {
      throw new UnauthorizedException('Access denied.');
    }

    // Check if review exists
    const review = await this.prisma.sellerReview.findUnique({
      where: { orderId: orderId },
    });

    // Check order completion status
    const isCompleted =
      order.orderStatus === 'DELIVERED' || order.orderStatus === 'COMPLETED';

    return {
      orderId: orderId,
      orderStatus: order.orderStatus,
      isReviewSubmitted: !!review,
      canSubmitReview: isCompleted && !review,
    };
  }

  async updateReviewStatus(role: string, reviewId: number, newStatus: string) {
    if (role !== 'ADMIN') {
      throw new UnauthorizedException('Only admins can modify review status.');
    }

    const existingReview = await this.prisma.sellerReview.findUnique({
      where: { id: reviewId },
      select: { comment: true }, // Only fetch the field you need
    });

    if (!existingReview) {
      throw new NotFoundException(`Review with ID ${reviewId} not found.`);
    }

    const newComment = `[MODERATED: ${newStatus}]` + existingReview.comment;

    return this.prisma.sellerReview.update({
      where: { id: reviewId },
      data: {
        comment: newComment,
        // data: { moderationStatus: newStatus as any }, // Include your moderationStatus update here
      },
      select: { id: true, comment: true },
    });
  }
}
