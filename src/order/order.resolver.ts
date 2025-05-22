import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './order.entity';

import { InputType, Field } from '@nestjs/graphql';

@InputType()
class UserInput {
  @Field()
  id: string;

  @Field()
  email: string;
}

@InputType()
class OrderProductInput {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  quantity: number;
}

@InputType()
class SellerInput {
  @Field(() => Int)
  id: number;
}

@Resolver(() => Order)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Query(() => [Order])
  async orders() {
    return this.orderService.fetchAllOrders();
  }

  @Query(() => Order)
  async order(@Args('id', { type: () => Int }) id: number) {
    return this.orderService.getOrderById(id);
  }

  @Mutation(() => Order)
  async createOrder(
    @Args('user', { type: () => UserInput }) user: UserInput,
    @Args('seller', { type: () => SellerInput }) seller: SellerInput,
    @Args('products', { type: () => [OrderProductInput] }) products: { productId: number; quantity: number }[],
    @Args('totalPrice', { type: () => Int }) totalPrice: number,
  ) {
    return this.orderService.createOrder(user, seller, products, totalPrice);
  }
}