import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from 'class-validator';

export class CreateApplicantBulkDto {
  @IsArray()
  @ValidateNested({ each: true })
  public applicants: CreateApplicantDto[] = [];
}

export default class CreateApplicantDto {
  @IsUUID()
  @IsOptional()
  public existingId: string | undefined = undefined;
  @IsString()
  @IsNotEmpty()
  public name = '';

  @IsNumber()
  @IsIn([0, 1, 2, 3]) //TODO should this be a Enum?
  @IsOptional()
  public flagType = 0;
  @IsString()
  @IsOptional()
  public flagMessage = '';
  @IsUUID()
  @IsOptional()
  public assessmentHurdleId: string | undefined = undefined;
  @IsString()
  @MaxLength(1500)
  public additionalNote = '';

  // #region USAS Optional fields
  @IsString()
  public firstName = '';
  @IsString()
  public middleName = '';
  @IsString()
  public lastName = '';
  @IsString()
  public applicationNumber: string | undefined = undefined;
  @IsString()
  public applicationId = '';
  // #endregion
}
