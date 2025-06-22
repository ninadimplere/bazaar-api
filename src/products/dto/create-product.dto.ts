// import {
//   IsString,
//   IsOptional,
//   IsNumber,
//   IsInt,
//   IsPositive,
//   IsEnum,
//   Min,
// } from 'class-validator';
// import { ProductStatus } from '@prisma/client';

// export class CreateProductDto {
//   @IsString()
//   title: string;

//   @IsString()
//   description: string;

//   @IsNumber()
//   @IsPositive()
//   markedPrice: number;

//   @IsNumber()
//   @IsPositive()
//   displayPrice: number;

//   @IsOptional()
//   @IsNumber()
//   discountPercentage?: number;

//   @IsOptional()
//   @IsInt()
//   displayPriority?: number;
//   @IsInt()
//   categoryId: number;

//   @IsOptional()
//   @IsInt()
//   @Min(0)
//   availableQuantity?: number;

//   @IsOptional()
//   @IsString()
//   imageUrl?: string;

//   @IsOptional()
//   @IsEnum(ProductStatus)
//   productStatus?: ProductStatus;

//   @IsString()
//   sellerId: string;

//   @IsString()
//   slug: string;
// }
