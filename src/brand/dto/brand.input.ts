import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateBrandInput {
  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  logoUrl?: string;

  @Field(() => [Int], { nullable: true })
  categoryIds?: number[];
}

@InputType()
export class UpdateBrandInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  logoUrl?: string;

  @Field(() => [Int], { nullable: true })
  categoryIds?: number[];
}
