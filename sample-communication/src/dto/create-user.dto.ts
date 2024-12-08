import { ApiExtension, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsAlpha, IsBoolean, IsDefined, IsEmail, IsNumber, IsNumberString, IsOptional, IsString, Length, ValidationArguments } from 'class-validator'


export class createUserDto {
    @ApiPropertyOptional({
        description: 'id value is auto incremented by the database'
    })
    @IsOptional()
    @IsNumber({}, {message: `id $value is not a number`})
    id: number;

    @ApiProperty()
    @IsDefined({message: 'username must not be empty'})
    @IsString({message: 'username $value is not a string'})
    @Length(5, 15, {message: 'username $value is not from $constraint1 to $constraint2 characters long'})
    username: string;

    @ApiPropertyOptional({
        description: 'default value from database: true'
    })
    @IsOptional()
    @IsBoolean({message: 'isActive $value is not a boolean'})
    isActive: boolean;

    @ApiProperty()
    @IsDefined({message: 'password must not be empty'})
    @IsString({message: 'password $value is not a string'})
    @Length(5, 20, {message: 'password $value is not from $constraint1 to $constraint2 characters long'})
    password: string;

    @ApiProperty()
    @IsDefined({message: 'firstName must not be empty'})
    @IsString({message: 'firstName $value must be an alphabetical string'})
    firstName: string;

    @ApiProperty()
    @IsDefined({message: 'lastName must not be empty'})
    @IsString({message: 'lastName $value must be an alphabetical string'})
    lastName: string;

    @ApiProperty()
    @IsDefined({message: 'email must not be empty'})
    @IsEmail({}, {message: 'email $value is not in corrent email format'})
    email: string;
}

export enum findBy{
    id,
    username,
    firstName,
    lastName,
    email
}
