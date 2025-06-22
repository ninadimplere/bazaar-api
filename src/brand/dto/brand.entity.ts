import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'category/dto/category.entity';
import { Product } from 'product/dto/product.model';

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
