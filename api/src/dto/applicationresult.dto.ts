import { IsString } from 'class-validator';

export default class ApplicationResultDto {
  constructor(params: Partial<ApplicationResultDto> = {}) {
    Object.assign(this, params);
  }
  @IsString()
  public assessmentHurdleId = '';
  @IsString()
  public applicantId = '';
  @IsString()
  public applicantName = '';
  @IsString()
  public finalScore = '';
}
