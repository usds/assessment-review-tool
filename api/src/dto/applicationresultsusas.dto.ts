import { IsNumber, IsOptional, IsString } from 'class-validator';

export default class ApplicationResultUSASDto {
  constructor(params: Partial<ApplicationResultUSASDto> = {}) {
    Object.assign(this, params);
  }

  @IsString()
  public vacancyId = '';
  @IsString()
  public assessmentId = '';
  @IsString()
  public applicationId = '';
  @IsString()
  public applicationRatingId = '';
  @IsString()
  public applicantLastName = '';
  @IsString()
  public applicantFirstName = '';
  @IsString()
  public applicantMiddleName = '';
  @IsString()
  public applicationNumber = '';
  @IsString()
  public ratingCombination = '';
  @IsNumber()
  @IsOptional()
  public assessmentRating: number | null = null;
  @IsString()
  @IsOptional()
  public minQualificationsRating: string | undefined = undefined;
}
