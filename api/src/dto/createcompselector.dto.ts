import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export default class CreateCompetencySelectorDto {
  @IsUUID()
  @IsOptional()
  public existingId: string | undefined = undefined;
  @IsUUID()
  public competencyId = '';
  @IsString()
  @IsNotEmpty()
  public displayName = '';
  @IsNumber()
  @Min(1)
  public pointValue = 1;
  @IsNumber()
  public sortOrder = 0;
  @IsString()
  @IsNotEmpty()
  public defaultText = '';
}
