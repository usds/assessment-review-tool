import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export default class EvaluationCompetencySubmitDto {
  @IsUUID()
  public competencyId = '';
  @IsUUID()
  public selectorId = '';

  @IsString()
  @MaxLength(1500)
  @IsOptional()
  public note = '';
}
