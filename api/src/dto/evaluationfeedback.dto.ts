import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class EvaluationApplicationFeedbackDto {
  @IsUUID()
  @IsOptional()
  public existingId: string | undefined = undefined;

  @IsUUID()
  public evaluatorId = '';

  @IsString()
  @MaxLength(1500)
  public feedback = '';
}
