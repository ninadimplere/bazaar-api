import {
  IsInt,
  IsString,
  IsOptional,
  Min,
  Max,
  IsNotEmpty,
  IsIn,
} from 'class-validator';

export class CreateSellerReviewDto {
  @IsNotEmpty()
  @IsInt()
  orderId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number; // 1 to 5 stars

  @IsOptional()
  @IsString()
  comment?: string;
}

type ModerationStatus = 'PUBLISHED' | 'HIDDEN' | 'FLAGGED';

export class UpdateReviewStatusDto {
  @IsNotEmpty()
  @IsIn(['PUBLISHED', 'HIDDEN', 'FLAGGED'])
  moderationStatus: ModerationStatus;
}
