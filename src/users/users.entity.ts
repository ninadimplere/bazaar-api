import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { SpenderType } from '@prisma/client';

// Register the Prisma enum for GraphQL
registerEnumType(SpenderType, {
  name: 'SpenderType',
  description: 'User spending behavior classification',
});

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field(() => SpenderType, { defaultValue: SpenderType.NEW })
  spenderType: SpenderType;
}
