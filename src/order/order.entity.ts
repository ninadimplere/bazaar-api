import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { User } from '../users/users.entity';

@ObjectType()
export class OrderProduct {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  orderId: number;

  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;

  @Field(() => Int, { nullable: true })
  sellerOrderId?: number;
}

@ObjectType()
export class ReturnRequest {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  orderId: number;

  @Field()
  reason: string;

  @Field()
  status: string;

  @Field()
  returnRequestReason: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class CancelRequest {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  orderId: number;

  @Field()
  reason: string;

  @Field()
  status: string;

  @Field()
  cancelRequestReason: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class SellerOrder {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  orderId: number;

  @Field()
  sellerId: string;

  @Field()
  status: string;

  @Field()
  sellerNote: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class Order {
  @Field(() => Int)
  id: number;
  @Field(() => User)
  user: User;

  @Field(() => [OrderProduct])
  products: OrderProduct[];

  @Field(() => [SellerOrder])
  SellerOrder: SellerOrder[];

  @Field(() => Float)
  totalPrice: number;

  @Field(() => Float)
  shippingCharges: number;

  @Field()
  orderStatus: string;

  @Field()
  paymentStatus: string;

  @Field()
  createdAt: Date;

  @Field()
  paymentTime: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [ReturnRequest], { nullable: true })
  returnRequests: ReturnRequest[];

  @Field(() => [CancelRequest], { nullable: true })
  cancelRequests: CancelRequest[];
}

