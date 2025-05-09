import { IsEmail, IsEnum, MinLength, ValidateIf } from 'class-validator';
import { Role, AccountType } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;
}
