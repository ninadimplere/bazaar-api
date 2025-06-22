import { registerEnumType } from '@nestjs/graphql';

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUTOFSTOCK = 'OUTOFSTOCK',
  DRAFT = 'DRAFT',
}

registerEnumType(ProductStatus, {
  name: 'ProductStatus',
});
