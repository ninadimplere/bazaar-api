import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './order.entity';

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
    @Args('userId') userId: string,
    @Args('products', { type: () => [OrderProductInput] }) products: { productId: number; quantity: number }[],
  ) {
    return this.orderService.createOrder(userId, products);
  }
}

import { InputType, Field } from '@nestjs/graphql';

@InputType()
class OrderProductInput {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  quantity: number;
}