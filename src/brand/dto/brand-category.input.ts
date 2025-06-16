import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class AddBrandToCategoryInput {
  @Field(() => Int)
  brandId: number;

  @Field(() => Int)
  categoryId: number;

  @Field(() => Boolean, { defaultValue: false })
  featured: boolean;

  @Field(() => Int, { defaultValue: 0 })
  displayOrder: number;
}

@InputType()
export class UpdateBrandCategoryInput {
  @Field(() => Int)
  brandId: number;

  @Field(() => Int)
  categoryId: number;

  @Field(() => Boolean, { nullable: true })
  featured?: boolean;

  @Field(() => Int, { nullable: true })
  displayOrder?: number;
}
