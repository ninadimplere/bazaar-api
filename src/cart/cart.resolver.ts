import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private cartService: CartService) {}

  @Query(() => Cart)
  async cart(@Args('userId') userId: string) {
    return this.cartService.fetchCartByUserId(userId);
  }

  @Mutation(() => Cart)
  async addToCart(
    @Args('userId') userId: string,
    @Args('productId', { type: () => Int }) productId: number,
    @Args('quantity', { type: () => Int }) quantity: number,
  ) {
    return this.cartService.addToCart(userId, productId, quantity);
  }
}