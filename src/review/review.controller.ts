import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ReviewsService } from './review.service';
import { CreateSellerReviewDto, UpdateReviewStatusDto } from './dto/review.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/roles.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('seller')
  //   @UseGuards(JwtAuthGuard)
  async createSellerReview(
    @Req() req,
    @Body() reviewDto: CreateSellerReviewDto,
  ) {
    const userId = 'user_buyer_002'; // Extracted from JWT token by AuthGuard
    return this.reviewsService.createSellerReview(userId, reviewDto);
  }

  @Get('sellers/:sellerId/reviews')
  async getReviewsBySeller(
    @Param('sellerId') sellerId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true }))
    pageSize: number = 10,
  ) {
    return this.reviewsService.findPublishedReviews(sellerId, page, pageSize);
  }

  @Get('sellers/:sellerId/rating')
  async getSellerRating(@Param('sellerId') sellerId: string) {
    return this.reviewsService.getSellerRatingStats(sellerId);
  }

  @Get('orders/:orderId/review-status')
  //   @UseGuards(JwtAuthGuard)
  async getReviewStatusForOrder(
    @Req() req,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    const userId = 'user_buyer_002';
    return this.reviewsService.checkReviewStatus(userId, orderId);
  }

  @Put('seller/:reviewId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') // Only ADMIN can change the moderation status
  async updateReviewStatus(
    @Req() req,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() statusDto: UpdateReviewStatusDto,
  ) {
    const userRole = req.user.role;
    return this.reviewsService.updateReviewStatus(
      userRole,
      reviewId,
      statusDto.moderationStatus,
    );
  }
}
