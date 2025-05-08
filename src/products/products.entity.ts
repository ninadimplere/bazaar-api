import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  price: number;

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