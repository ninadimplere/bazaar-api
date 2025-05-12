import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  markedPrice: number;

  @IsNumber()
  displayPrice: number;

  @IsNumber()
  discountPercentage: number;

  @IsString()
  category: string;

  @IsString()
  slug: string;

  @IsNumber()
  sellerId: number;
}