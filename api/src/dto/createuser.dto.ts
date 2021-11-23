import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export default class CreateUserDto {
  constructor(email: string, name: string) {
    this.email = email;
    this.name = name;
  }

  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public name: string;
}
