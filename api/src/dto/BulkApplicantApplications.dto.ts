import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export default class BulkUSASApplicationsDto {
  @IsArray()
  @ValidateNested({ each: true })
  applications: USASApplicationDto[] = [];
}
export class USASApplicationDto {
  @IsString()
  @IsNotEmpty()
  firstName = '';
  @IsString()
  @IsNotEmpty()
  lastName = '';
  @IsString()
  middleName = '';
  // staffing applicationId
  @IsString()
  @IsNotEmpty()
  staffingApplicationId = '';
  // staffing application number
  @IsString()
  @IsNotEmpty()
  staffingApplicationNumber = '';
  // application rating Id
  @IsString()
  @IsNotEmpty()
  staffingRatingId = '';
  // staffing assessment id
  @IsString()
  @IsNotEmpty()
  staffingAssessmentId = '';
  // Staffing rating combination
  @IsString()
  @IsNotEmpty()
  staffingRatingCombination = '';
}
