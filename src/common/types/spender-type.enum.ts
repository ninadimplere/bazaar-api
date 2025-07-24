// src/common/types/spender-type.enum.ts
import { registerEnumType } from '@nestjs/graphql';

export enum SpenderType {
  NEW = 'NEW',
  ONE_TIME = 'ONE_TIME',
  FREQUENT = 'FREQUENT',
  HIGH_SPENDER = 'HIGH_SPENDER',
}

// Register the enum for GraphQL
registerEnumType(SpenderType, {
  name: 'SpenderType',
  description: 'Classification of users based on their spending patterns',
});
