import { IsString } from 'class-validator';

export class ApplicantFeedbackSubmitDto {
  @IsString()
  public feedback = '';
}
