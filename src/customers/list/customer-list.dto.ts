import {
  ObjectType,
  Field,
  Int,
  Float,
  registerEnumType,
} from '@nestjs/graphql';
import { CustomerTag } from 'common/enums/customer-tag.enum';

@ObjectType()
export class Address {
  @Field({ nullable: true })
  addressLine1?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  postalCode?: string;

  @Field({ nullable: true })
  country?: string;
}

registerEnumType(CustomerTag, {
  name: 'CustomerTag',
  description: 'Customer classification based on order behavior',
});

@ObjectType()
export class CustomerSummary {
  @Field()
  customerId: string;

  @Field()
  email?: string;

  @Field()
  number?: string;

  @Field()
  name: string;

  @Field(() => Int)
  orderCount: number;

  @Field(() => Float, { nullable: true })
  totalSpend?: number;

  @Field({ nullable: true })
  lastOrderDate?: string;

  @Field(() => Address, { nullable: true })
  address?: Address;

  @Field(() => CustomerTag)
  tag: CustomerTag;

  @Field()
  memberSince: string;
}
