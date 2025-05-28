import { IsEmail, IsEnum, MinLength, ValidateIf, IsOptional, IsDateString } from 'class-validator';
import { Role, AccountType, Gender } from '@prisma/client';

export class UserProfileDto {
  @IsOptional()
  fullName?: string;

  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  profileImage?: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;

  @ValidateIf((o) => o.role === 'SELLER')
  fullName?: string;

  @ValidateIf((o) => o.role === 'SELLER')
  phoneNumber?: string;

  @IsOptional()
  profile?: UserProfileDto;
}
