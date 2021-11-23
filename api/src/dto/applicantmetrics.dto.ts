import { IsNumber, IsRFC3339, IsString, IsUUID, Min } from 'class-validator';

export default class ApplicantMetricsDto {
  constructor(params: Partial<ApplicantMetricsDto> = {}) {
    Object.assign(this, params);
  }

  @IsUUID()
  public applicantId = '';
  @IsUUID()
  public applicationId = '';

  @IsString()
  public status = '';
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  public passCount = 0;
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  public failCount = 0;

  public isRecused = false;
  public isReturned = false;
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  public flagStatus = 0;
  @IsString()
  public message = '';
  @IsRFC3339()
  public dataCreated = '';
}
