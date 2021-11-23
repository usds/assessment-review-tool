import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import CreateCompetencyDto from './createcompetency.dto';

export default class CreateCompetenciesDto {
  @IsArray()
  @ValidateNested({ each: true })
  public competencies: CreateCompetencyDto[] = [];

  @IsUUID()
  @IsOptional()
  public assessmentHurdleId: string | undefined = undefined;
}
