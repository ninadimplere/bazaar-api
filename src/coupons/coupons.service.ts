import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Coupon } from './coupons.entity';
import { CreateCouponInput, PromotionType, TargetAudience } from './dto/create-coupon.dto';
import { UpdateCouponInput } from './dto/update-coupon.dto';
import { FilterCouponInput } from './dto/filter-coupon.dto';
import { ValidateCouponOutput } from './dto/validate-coupon.dto';

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
      discountType, 
      validFrom, 
      validTo, 
      createdBy,
      minPurchaseAmount,
      maxUsage,
      perCustomerLimit,
      title,
      description,
      imageUrl,
      promotionType,
      targetAudience,
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

    // Create the coupon with basic fields that exist in our schema
    const newCoupon = await this.prismaService.coupon.create({
      data: {
        code,
        discountValue,
        discountType,
        validFrom,
        validTo,
        createdBy,
        minPurchaseAmount,
        maxUsage,
        perCustomerLimit,
        title,
        description,
        imageUrl,
        promotionType,
        targetAudience,
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
    
    if (promotionType) {
      where.promotionType = promotionType;
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
    await this.getCouponById(id);

    const {
      applicableProductIds,
      applicableCategoryIds,
      ...restUpdateData
    } = updateData;

    // Update the coupon
    const updatedCoupon = await this.prismaService.coupon.update({
      where: { id },
      data: {
        ...restUpdateData,
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
}
