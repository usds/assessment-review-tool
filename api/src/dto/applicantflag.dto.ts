import { IsIn, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export default class ApplicantFlagDto {
  @IsString()
  @IsNotEmpty()
  public flagMessage = '';
}
