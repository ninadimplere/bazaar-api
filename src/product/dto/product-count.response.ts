import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class CountResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;

  @Field(() => Int)
  count: number;
}
