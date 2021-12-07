import { IsBoolean, IsEmail, IsNumber, IsRFC3339, IsString, IsUUID } from 'class-validator';

export default class AuditFileDto {
  @IsUUID()
  public assessmentHurdleId = '';

  @IsUUID()
  public applicationId = '';
  @IsUUID()
  public specialtyId = '';
  @IsString()
  public applicantName = '';
  @IsString()
  public applicantId = '';

  @IsString()
  public applicantStaffingId = '';

  @IsNumber()
  public flagType = 0;

  @IsEmail()
  public evaluatorEmail = '';
  @IsString()
  public evaluatorNote = '';

  [competencyEvaluations: string]: any;

  @IsString()
  public approverEmail = '';
  @IsBoolean()
  public approved = false;
  @IsRFC3339()
  public timestamp = '';
}
