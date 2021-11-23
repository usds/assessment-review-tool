import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export default class CreateApplicationAssignmentDto {
  @IsUUID()
  @IsOptional()
  public existingId: string | undefined = undefined;

  @IsUUID()
  @IsOptional()
  public assessmentHurdleId: string | undefined = undefined;

  @IsUUID()
  public evaluatorId = '';
  @IsUUID()
  public applicantId = '';
  @IsBoolean()
  public active = false;
}
