import { IsString, IsNumber, IsUUID, IsBoolean, IsOptional, ValidateNested, MaxLength, MinLength, IsArray, IsNotEmpty } from 'class-validator';
import CreateCompetencySelectorDto from './createcompselector.dto';

export default class CreateCompetencyDto {
  @IsUUID()
  @IsOptional()
  public existingId: string | undefined = undefined;

  @IsUUID()
  @IsOptional()
  public assessmentHurdleId: string | undefined = undefined;

  @IsString()
  @IsNotEmpty()
  public name = '';

  @IsString()
  @IsNotEmpty()
  public localId = '';

  @IsString()
  @MinLength(5)
  @MaxLength(1500)
  public definition = '';

  @IsString()
  @MaxLength(1500)
  @MinLength(5)
  public requiredProficiencyDefinition = '';
  @IsNumber()
  public displayType = 0;
  @IsBoolean()
  public screenOut = false;

  @IsNumber()
  public sortOrder = 0;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  public specialtyIds?: string[] | undefined = undefined;

  @IsArray()
  @ValidateNested({ each: true })
  public selectors: CreateCompetencySelectorDto[] = [];
}
