import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchAllCarts() {
    return this.prismaService.cart.findMany({
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async getCartById(id: number) {
    return this.prismaService.cart.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async fetchCartByUserId(userId: string) {
    return this.prismaService.cart.findFirst({
      where: { userId },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async createCart(data: any) {
    return this.prismaService.cart.create({
      data: {
        userId: data.userId,
        products: {
          create: data.products?.map((product: { productId: number; quantity: number }) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
        },
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async addToCart(userId: string, productId: number, quantity: number) {
    // First, find or create a cart for the user
    let cart = await this.fetchCartByUserId(userId);
  
    if (!cart) {
      cart = await this.prismaService.cart.create({
        data: {
          userId,
          products: {
            create: [], // Ensure products relation is initialized
          },
        },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });
    }
  
    if (!cart) {
      throw new Error('Failed to create or fetch cart');
    }
  
    // Check if the product already exists in the cart
    const existingProduct = await this.prismaService.cartProduct.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });
  
    if (existingProduct) {
      // Update the quantity if the product exists
      return this.prismaService.cartProduct.update({
        where: { id: existingProduct.id },
        data: {
          quantity: existingProduct.quantity + quantity,
        },
      });
    }
  
    // Add new product to cart if it doesn't exist
    return this.prismaService.cartProduct.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }
}