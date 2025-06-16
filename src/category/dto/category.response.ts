// category.response.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { Category } from './category.entity';

@ObjectType()
export class CategoryResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field(() => Category, { nullable: true })
  data?: Category;
}

@ObjectType()
export class CategoryListResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field(() => [Category], { nullable: true })
  data?: Category[];
}
