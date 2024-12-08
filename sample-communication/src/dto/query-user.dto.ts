import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumberString, IsOptional, IsString } from "class-validator";
export enum orderBy{
    username = 'username',
    firstName = 'firstName',
    lastName = 'lastName',
    email = 'email'
}

export class queryUserDto{
    @ApiPropertyOptional()
    @IsOptional()
    @IsString({message: 'query $value is not a string'})
    query: string

    @ApiPropertyOptional({enum: ['asc', 'desc'], enumName: 'order'})
    @IsOptional()
    @IsEnum(['asc', 'desc'], {message: 'order $value is not in correct format (asc or desc)'})
    order?: 'asc' | 'desc'

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    page: number

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    limit: number

    @ApiPropertyOptional({enum: orderBy, enumName: "OrderBy"})
    @IsOptional()
    @IsEnum(orderBy, {message: 'orderBy $value is not in specified categories'})
    orderBy: orderBy
}