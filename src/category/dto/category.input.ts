// dto/category.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ defaultValue: true })
  isActive?: boolean;

  @Field(() => Int, { nullable: true })
  parentId?: number;
}

@InputType()
export class UpdateCategoryInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field(() => Int, { nullable: true })
  parentId?: number;
}
