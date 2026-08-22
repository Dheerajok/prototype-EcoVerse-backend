import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsNumber()
  wasteRecoveredKg?: number;

  @IsOptional()
  @IsNumber()
  co2SavedKg?: number;

  @IsOptional()
  @IsNumber()
  ecoPoints?: number;
}
