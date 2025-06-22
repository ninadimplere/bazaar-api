// category.model.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Category {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field()
  isActive: boolean;

  @Field(() => Int, { nullable: true })
  parentId: number | null;

  @Field(() => [Category], { nullable: true })
  children?: Category[];

  @Field(() => Category, { nullable: true })
  parent?: Category | null;
}
