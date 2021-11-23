import { IsEmail, IsRFC3339, IsString, IsUUID } from 'class-validator';

export default class RecusedApplicantsDto {
  constructor(params: Partial<RecusedApplicantsDto> = {}) {
    Object.assign(this, params);
  }
  @IsUUID()
  public assessmentHurdleId = '';
  @IsUUID()
  public applicantId = '';
  @IsString()
  public applicantName = '';
  @IsUUID()
  public recusedEvaluatorId = '';
  @IsEmail()
  public recusedEvaluatorEmail = '';
  @IsRFC3339()
  public timestamp = '';
}
