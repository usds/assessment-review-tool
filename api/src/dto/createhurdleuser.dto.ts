import { IsArray, IsIn, IsNumber, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import CreateUserDto from './createuser.dto';

export class CreateHurdleUserPairDto {
  @IsNumber()
  @IsIn([0, 1, 2, 10]) // TODO Enum? { admin: 0, hr: 1, sme: 2, all: 10}
  public role = 0;

  @IsArray()
  @ValidateNested({ each: true })
  public users: CreateUserDto[] = [];
}

export default class CreateHurdleUserDto {
  @IsArray()
  @ValidateNested({ each: true })
  public userSetup: CreateHurdleUserPairDto[] = [];
}
