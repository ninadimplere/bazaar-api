import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Float)
  markedPrice: number;

  @Field(() => Float)
  displayPrice: number;

  @Field(() => Float)
  discountPercentage: number;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  sellerId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}