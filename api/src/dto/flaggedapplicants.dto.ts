import { IsNumber, IsString, IsUUID } from 'class-validator';

export default class FlaggedApplicantsDto {
  constructor(params: Partial<FlaggedApplicantsDto> = {}) {
    Object.assign(this, params);
  }
  @IsUUID()
  public assessmentHurdleId = '';
  @IsUUID()
  public applicantId = '';
  @IsString()
  public applicantName = '';
  @IsNumber()
  public flagType = 0;
  @IsString()
  public flagMessage = '';
}
