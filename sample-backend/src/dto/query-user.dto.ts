import { IsEnum, IsNumberString, IsOptional, IsString } from "class-validator";

export enum orderBy{
    username = 'username',
    firstName = 'firstName',
    lastName = 'lastName',
    email = 'email'
}

export class queryUserDto{
    @IsOptional()
    @IsString({message: 'query $value is not a string'})
    query: string

    @IsOptional()
    @IsEnum(['asc', 'desc'], {message: 'order $value is not in correct format (asc or desc)'})
    order?: 'asc' | 'desc'

    @IsOptional()
    page: number

    @IsOptional()
    @IsNumberString()
    limit: number

    @IsOptional()
    @IsEnum(orderBy, {message: 'orderBy $value is not in specified categories'})
    orderBy: orderBy
}