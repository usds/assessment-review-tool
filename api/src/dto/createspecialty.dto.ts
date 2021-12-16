import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CategoryRatingDto {
  @IsNumber()
  @IsOptional()
  public points: number | undefined = undefined;
  @IsOptional()
  @IsString()
  public nor: string | undefined = undefined;
}
export class CategoryRatingsDto {
  @IsOptional()
  public does_not_meet: CategoryRatingDto | undefined = undefined;
  @IsOptional()
  public meets: CategoryRatingDto | undefined = undefined;
  @IsOptional()
  public exceeds: CategoryRatingDto | undefined = undefined;
}
export default class CreateSpecialtyDto {
  @IsUUID()
  @IsOptional()
  public existingId: string | undefined = undefined;
  @IsString()
  @IsNotEmpty()
  public name = '';
  @IsString()
  @IsNotEmpty()
  public localId = '';
  @IsUUID()
  @IsOptional()
  public assessmentHurdleId: string | undefined = undefined;
  @IsOptional()
  public categoryRatings: CategoryRatingsDto | undefined = undefined;

  @IsArray()
  @IsOptional()
  public competencyLocalIds?: string[] = [];
  @IsArray()
  @IsOptional()
  public competencyIds?: string[] = [];
}
