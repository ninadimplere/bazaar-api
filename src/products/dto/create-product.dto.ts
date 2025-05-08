import { IsString, IsNumberString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumberString()
  price: string;

  @IsString()
  category: string;
}