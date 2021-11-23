import { IsUUID } from 'class-validator';

export default class CreateApplicationSpecialtyMappingDto {
  @IsUUID()
  public applicationId = '';
  @IsUUID()
  public specialtyId = '';
}
