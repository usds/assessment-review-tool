import { IsOptional, IsString, IsUUID } from 'class-validator';

export default class CreateApplicationDto {
  @IsUUID()
  @IsOptional()
  public existingId: string | undefined = undefined;
  @IsUUID()
  public applicantId = '';
  @IsUUID()
  public specialtyId = '';
  // #region USAS optional fields
  @IsString()
  public applicationMetaId = '';
  @IsString()
  public applicationMetaRatingId = '';
  @IsString()
  public applicationMetaAssessmentId = '';
  @IsString()
  public applicationMetaRatingCombination = '';
  // #endregion
}
