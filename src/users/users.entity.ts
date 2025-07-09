import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';

export enum SpenderType {
  NEW = 'NEW',
  ONE_TIME = 'ONE_TIME',
  FREQUENT = 'FREQUENT',
  HIGH_SPENDER = 'HIGH_SPENDER',
}

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
