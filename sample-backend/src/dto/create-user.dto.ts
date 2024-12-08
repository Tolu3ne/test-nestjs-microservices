import { IsBoolean, IsDefined, IsEmail, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class createUserDto{
    @IsOptional()
    @IsNumber({}, {message: `id $value is not a number`})
    id: number;

    @IsDefined({message: 'username must not be empty'})
    @IsString({message: 'username $value is not a string'})
    @Length(5, 15, {message: 'username $value is not from $constraint1 to $constraint2 characters long'})
    username: string;

    @IsOptional()
    @IsBoolean({message: 'isActive $value is not a boolean'})
    isActive: boolean;

    @IsDefined({message: 'password must not be empty'})
    @IsString({message: 'password $value is not a string'})
    @Length(5, 20, {message: 'password $value is not from $constraint1 to $constraint2 characters long'})
    password: string;

    @IsDefined({message: 'firstName must not be empty'})
    @IsString({message: 'firstName $value must be an alphabetical string'})
    firstName: string;

    @IsDefined({message: 'lastName must not be empty'})
    @IsString({message: 'lastName $value must be an alphabetical string'})
    lastName: string;

    @IsDefined({message: 'email must not be empty'})
    @IsEmail({}, {message: 'email $value is not in corrent email format'})
    email: string;
}