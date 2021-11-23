import { IsArray, IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class EvaluationApplicationReviewSubmitDto {
  @IsArray()
  public evaluationId: string[] = [];
  @IsBoolean()
  public review = false;
}
