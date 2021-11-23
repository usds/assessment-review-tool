import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

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
  @IsNumber()
  public pointsRequired = 1;

  @IsArray()
  @IsOptional()
  public competencyLocalIds?: string[] = [];
  @IsArray()
  @IsOptional()
  public competencyIds?: string[] = [];
}
