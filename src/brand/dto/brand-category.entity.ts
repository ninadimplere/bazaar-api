import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category } from '../../category/dto/category.entity';
import { Brand } from './brand.entity';

@ObjectType()
export class BrandCategory {
  @Field(() => Int)
  brandId: number;

  @Field(() => Int)
  categoryId: number;

  @Field(() => Boolean)
  featured: boolean;

  @Field(() => Int)
  displayOrder: number;

  @Field(() => Brand)
  brand: Brand;

  @Field(() => Category)
  category: Category;
}
