import { IsOptional, IsString, IsUUID, MaxLength, MinLength, IsBoolean, ValidateNested } from 'class-validator';
import EvaluationCompetencySubmitDto from './evaluationcompetencysubmit.dto';

export default class EvaluationSubmitDto {
  @IsOptional()
  @IsString()
  @MaxLength(1500)
  public note: string | undefined = undefined;

  @IsString()
  @IsOptional()
  public evaluatorId = '';

  @IsBoolean()
  @IsOptional()
  public isTieBreaker = false;

  @ValidateNested()
  public competencyEvals: EvaluationCompetencySubmitDto[] = [];
}
