import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';

export class CreateBankAccountDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, {
    message: 'Account number must contain digits only',
  })
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11, { message: 'IFSC code must be exactly 11 characters' })
  ifscCode: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
