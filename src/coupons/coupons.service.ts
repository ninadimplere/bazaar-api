import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Coupon } from './coupons.entity';
import { CreateCouponInput, PromotionTypeEnum, CouponTypeEnum } from './dto/create-coupon.dto';
import { UpdateCouponInput } from './dto/update-coupon.dto';
import { FilterCouponInput } from './dto/filter-coupon.dto';
import { ValidateCouponOutput } from './dto/validate-coupon.dto';
import { CouponType, PromotionType, SpenderType } from '@prisma/client';

@Injectable()
export class CouponsService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create a new coupon
   */
  async createCoupon(createCouponInput: CreateCouponInput): Promise<Coupon> {
    const { 
      code, 
      discountValue, 
      validFrom, 
      validTo, 
      createdBy,
      minPurchaseAmount,
      maxUsage,
      perCustomerLimit,
      title,
      description,
      imageUrl,
      isPromotion = false, // Default to false (it's a coupon, not a promotion)
      promotionType,
      couponType,
      targetSpenderTypes = [], // Default to empty array
      applicableProductIds,
      applicableCategoryIds
    } = createCouponInput;
    
    // Check if coupon code already exists
    const existingCoupon = await this.prismaService.coupon.findUnique({
      where: { code }
    });
    
    if (existingCoupon) {
      throw new BadRequestException(`Coupon with code ${code} already exists`);
    }

    // Validate type selections based on isPromotion
    if (isPromotion && !promotionType) {
      throw new BadRequestException('Promotion type is required for promotions');
    }

    if (!isPromotion && !couponType) {
      throw new BadRequestException('Coupon type is required for coupons');
    }

    // Create the coupon with updated fields that exist in our schema
    const newCoupon = await this.prismaService.coupon.create({
      data: {
        code,
        discountValue,
        validFrom,
        validTo,
        createdBy,
        minPurchaseAmount,
        maxUsage,
        perCustomerLimit,
        title,
        description,
        imageUrl,
        isPromotion,
        promotionType: isPromotion ? promotionType : null,
        couponType: !isPromotion ? couponType : null,
        targetSpenderTypes,
        // Connect products if applicable
        ...(applicableProductIds && applicableProductIds.length > 0 ? {
          applicableProducts: {
            connect: applicableProductIds.map(id => ({ id }))
          }
        } : {}),
        // Connect categories if applicable
        ...(applicableCategoryIds && applicableCategoryIds.length > 0 ? {
          applicableCategories: {
            connect: applicableCategoryIds.map(id => ({ id }))
          }
        } : {})
      },
      include: {
        applicableProducts: true,
        applicableCategories: true
      }
    });

    return {
      ...newCoupon,
      isActive: true,
      usageCount: 0
    } as Coupon;
  }

  /**
   * Get a coupon by its ID
   */
  async getCouponById(id: number): Promise<Coupon> {
    const coupon = await this.prismaService.coupon.findUnique({
      where: { id },
      include: {
        applicableProducts: true,
        applicableCategories: true,
        user: true
      }
    });
    
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    
    return coupon as Coupon;
  }

  /**
   * Get all coupons with optional filtering
   */
  async getAllCoupons(filter?: FilterCouponInput): Promise<Coupon[]> {
    const { 
      searchQuery, 
      promotionType,
      isPromotion, // New filter
      couponType, // New filter
      spenderType, // New filter
      isActive, 
      sellerId, 
      productId,
      categoryId,
      skip = 0,
      take = 10
    } = filter || {};

    const where: any = {};
    
    // Apply filters if provided
    if (searchQuery) {
      where.OR = [
        { code: { contains: searchQuery, mode: "insensitive" } },
        { title: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } }
      ];
    }
    
    if (sellerId) {
      where.createdBy = sellerId;
    }
    
    // Filter by isPromotion if specified
    if (isPromotion !== undefined) {
      where.isPromotion = isPromotion;
    }
    
    // Filter by promotion type if specified and isPromotion is true or undefined
    if (promotionType && (isPromotion === true || isPromotion === undefined)) {
      where.promotionType = promotionType;
    }
    
    // Filter by coupon type if specified and isPromotion is false or undefined
    if (couponType && (isPromotion === false || isPromotion === undefined)) {
      where.couponType = couponType;
    }
    
    // Filter by spender type if specified
    if (spenderType) {
      where.targetSpenderTypes = {
        hasSome: [spenderType]
      };
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
    
    if (productId) {
      where.applicableProducts = {
        some: {
          id: productId
        }
      };
    }
    
    if (categoryId) {
      where.applicableCategories = {
        some: {
          id: categoryId
        }
      };
    }

    const coupons = await this.prismaService.coupon.findMany({
      where,
      include: {
        applicableProducts: true,
        applicableCategories: true,
        user: true
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc"
      }
    });

    return coupons as Coupon[];
  }

  /**
   * Update a coupon
   */
  async updateCoupon(id: number, updateData: UpdateCouponInput): Promise<Coupon> {
    // First check if the coupon exists
    const existingCoupon = await this.getCouponById(id);

    const {
      applicableProductIds,
      applicableCategoryIds,
      isPromotion,
      promotionType,
      couponType,
      targetSpenderTypes,
      ...restUpdateData
    } = updateData;

    // Validate type selections based on isPromotion
    if (isPromotion !== undefined) {
      if (isPromotion && !promotionType && !existingCoupon.promotionType) {
        throw new BadRequestException('Promotion type is required for promotions');
      }

      if (!isPromotion && !couponType && !existingCoupon.couponType) {
        throw new BadRequestException('Coupon type is required for coupons');
      }
    }

    // Update the coupon
    const updatedCoupon = await this.prismaService.coupon.update({
      where: { id },
      data: {
        ...restUpdateData,
        // Only update isPromotion if it's provided
        ...(isPromotion !== undefined ? { isPromotion } : {}),
        // Only update promotion type if it's provided and it's a promotion
        ...(promotionType && (isPromotion === true || (isPromotion === undefined && existingCoupon.isPromotion)) ? 
            { promotionType } : {}),
        // Only update coupon type if it's provided and it's a coupon
        ...(couponType && (isPromotion === false || (isPromotion === undefined && !existingCoupon.isPromotion)) ? 
            { couponType } : {}),
        // Update targetSpenderTypes if provided
        ...(targetSpenderTypes ? { targetSpenderTypes } : {}),
        // Update product connections if provided
        ...(applicableProductIds ? {
          applicableProducts: {
            set: applicableProductIds.map(id => ({ id }))
          }
        } : {}),
        // Update category connections if provided
        ...(applicableCategoryIds ? {
          applicableCategories: {
            set: applicableCategoryIds.map(id => ({ id }))
          }
        } : {})
      },
      include: {
        applicableProducts: true,
        applicableCategories: true,
        user: true
      }
    });

    return updatedCoupon as Coupon;
  }

  /**
   * Delete a coupon
   */
  async deleteCoupon(id: number): Promise<void> {
    // First check if the coupon exists
    await this.getCouponById(id);

    // Delete the coupon
    await this.prismaService.coupon.delete({
      where: { id }
    });
  }

  /**
   * Get coupons by seller ID
   */
  async getCouponsBySeller(sellerId: string): Promise<Coupon[]> {
    const coupons = await this.prismaService.coupon.findMany({
      where: { 
        createdBy: sellerId,
      },
      include: {
        applicableProducts: true,
        applicableCategories: true,
        user: true
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return coupons as Coupon[];
  }

  /**
   * Activate or deactivate a coupon
   */
  async toggleCouponStatus(id: number, isActive: boolean): Promise<Coupon> {
    const updatedCoupon = await this.prismaService.coupon.update({
      where: { id },
      data: { isActive },
      include: {
        applicableProducts: true,
        applicableCategories: true,
        user: true
      }
    });
    
    return updatedCoupon as Coupon;
  }

  /**
   * Get coupons applicable to a specific product
   */
  async getCouponsForProduct(productId: number): Promise<Coupon[]> {
    const coupons = await this.prismaService.coupon.findMany({
      where: {
        isActive: true,
        validTo: { gte: new Date() }, // Only active coupons
        OR: [
          { 
            applicableProducts: { 
              some: { id: productId } 
            } 
          },
          {
            applicableProducts: { 
              none: {} // Coupons with no specific products (applicable to all)
            }
          }
        ],
      },
      include: {
        applicableProducts: true,
        applicableCategories: true,
        user: true
      },
    });

    return coupons as Coupon[];
  }

  /**
   * Get coupons applicable to a specific category
   */
  async getCouponsForCategory(categoryId: number): Promise<Coupon[]> {
    const coupons = await this.prismaService.coupon.findMany({
      where: {
        isActive: true,
        validTo: { gte: new Date() }, // Only non-expired coupons
        OR: [
          {
            applicableCategories: {
              some: { id: categoryId }
            }
          },
          {
            applicableCategories: {
              none: {} // Coupons with no specific categories (applicable to all)
            },
            applicableProducts: {
              none: {} // And no specific products
            }
          }
        ]
      },
      include: {
        applicableProducts: true,
        applicableCategories: true,
        user: true
      },
    });

    return coupons as Coupon[];
  }

  /**
   * Validate if a coupon is applicable and return its details
   */
  async validateCoupon(code: string, userId: string, cartTotal: number): Promise<ValidateCouponOutput> {
    const coupon = await this.prismaService.coupon.findUnique({
      where: { code },
      include: {
        applicableProducts: true,
        applicableCategories: true,
        orders: {
          where: {
            userId,
          },
        },
      },
    });

    if (!coupon) {
      return { valid: false, message: "Coupon not found" };
    }

    if (!coupon.isActive) {
      return { valid: false, message: "Coupon is not active" };
    }

    // Check if coupon is expired
    const now = new Date();
    if (coupon.validTo < now) {
      return { valid: false, message: "Coupon has expired" };
    }

    // Check if coupon is not yet valid
    if (coupon.validFrom > now) {
      return { valid: false, message: "Coupon is not yet valid" };
    }

    // Check minimum purchase amount
    if (coupon.minPurchaseAmount && cartTotal < coupon.minPurchaseAmount) {
      return { 
        valid: false, 
        message: `Minimum purchase amount of $${coupon.minPurchaseAmount} required` 
      };
    }

    // Check if user has already used this coupon and reached their limit
    if (coupon.perCustomerLimit && coupon.orders.length >= coupon.perCustomerLimit) {
      return { 
        valid: false, 
        message: `You've already used this coupon ${coupon.perCustomerLimit} time(s)` 
      };
    }

    return { valid: true, coupon: coupon as Coupon };
  }

  /**
   * Apply a coupon to an order
   */
  async applyCouponToOrder(couponId: number, orderId: number): Promise<void> {
    // Connect coupon to order
    await this.prismaService.order.update({
      where: { id: orderId },
      data: {
        coupons: {
          connect: { id: couponId }
        }
      }
    });
    
    // Increment the usage count of the coupon
    await this.prismaService.coupon.update({
      where: { id: couponId },
      data: {
        usageCount: {
          increment: 1
        }
      }
    });
  }

  /**
   * Get coupons for a user's spender type
   */
  async getCouponsForUserSpenderType(userId: string): Promise<Coupon[]> {
    // First get the user's spender type
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { spenderType: true }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get all coupons that target this user's spender type or that have no specific target
    const coupons = await this.prismaService.coupon.findMany({
      where: {
        OR: [
          { targetSpenderTypes: { hasSome: [user.spenderType] } },
          { targetSpenderTypes: { isEmpty: true } } // Coupons with no specific target are available to all
        ],
        isActive: true,
        validFrom: { lte: new Date() },
        validTo: { gte: new Date() }
      },
      include: {
        applicableProducts: true,
        applicableCategories: true
      }
    });

    return coupons as unknown as Coupon[];
  }

  /**
   * Get coupons by spender type
   */
  async getCouponsBySpenderType(spenderType: SpenderType): Promise<Coupon[]> {
    const coupons = await this.prismaService.coupon.findMany({
      where: {
        OR: [
          { targetSpenderTypes: { hasSome: [spenderType] } },
          { targetSpenderTypes: { isEmpty: true } } // Coupons with no specific target are available to all
        ],
        isActive: true,
        validFrom: { lte: new Date() },
        validTo: { gte: new Date() }
      },
      include: {
        applicableProducts: true,
        applicableCategories: true
      }
    });

    return coupons as unknown as Coupon[];
  }
}
