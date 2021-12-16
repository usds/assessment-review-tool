import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsRFC3339, IsString, IsUUID, Min, MinLength } from 'class-validator';

export default class CreateAssessmentHurdleDto {
  @IsUUID()
  @IsOptional()
  public existingId: string | undefined = undefined;
  @IsString()
  @IsNotEmpty()
  public departmentName = '';
  @IsString()
  @IsOptional()
  public componentName: string | undefined = undefined;
  @IsString()
  @IsNotEmpty()
  public positionName = '';
  @IsString()
  @IsNotEmpty()
  public positionDetails = '';
  @IsString()
  @IsNotEmpty()
  public locations = '';
  @IsRFC3339()
  public startDatetime: Date = new Date();
  @IsRFC3339()
  public endDatetime: Date = new Date();
  @IsNumber()
  @IsIn([1, 2])
  public hurdleDisplayType = 1;
  @IsNumber()
  @Min(1)
  public evaluationsRequired = 1;
  @IsString()
  @IsNotEmpty()
  public hrName = '';
  @IsEmail()
  public hrEmail = '';
  @IsString()
  @IsNotEmpty()
  public vacancyId = '';
  @IsString()
  @IsNotEmpty()
  public assessmentId = '';
  @IsString()
  @IsNotEmpty()
  public assessmentName = '';
}
