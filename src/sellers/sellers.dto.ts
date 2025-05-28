import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AccountType } from '@prisma/client';

export class UpdateSellerDto {
  @IsEnum(AccountType)
  accountType: AccountType;

  @IsString()
  @IsOptional()
  panNumber?: string;

  @IsString()
  @IsOptional()
  aadhaarNumber?: string;

  @IsString()
  @IsOptional()
  gstNumber?: string;

  @IsString()
  @IsOptional()
  cinNumber?: string;

  @IsString()
  @IsOptional()
  panDocumentUrl?: string;

  @IsString()
  @IsOptional()
  aadhaarDocumentUrl?: string;

  @IsString()
  @IsOptional()
  gstCertificateUrl?: string;

  @IsString()
  @IsOptional()
  cinDocumentUrl?: string;
}
