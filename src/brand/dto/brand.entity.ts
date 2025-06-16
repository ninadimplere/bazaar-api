import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from '@products/products.entity';
import { Category } from 'category/dto/category.entity';

@ObjectType()
export class Brand {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field(() => String, { nullable: true })
  logoUrl: string | null;

  @Field(() => [Category], { nullable: 'items' })
  categories?: Category[];

  @Field(() => [Product], { nullable: 'items' })
  products?: Product[];
}
