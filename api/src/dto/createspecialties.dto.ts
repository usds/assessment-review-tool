import { IsArray, ValidateNested } from 'class-validator';
import CreateSpecialtyDto from './createspecialty.dto';

export default class CreateSpecialtiesDto {
  @IsArray()
  @ValidateNested({ each: true })
  specialties: CreateSpecialtyDto[] = [];
}
