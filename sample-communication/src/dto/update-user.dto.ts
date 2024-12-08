import { PartialType } from '@nestjs/mapped-types';
import { createUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUrl, isURL } from 'class-validator';

export class UpdateUserDto extends PartialType(createUserDto) {
    @ApiPropertyOptional()
    @IsString({message: 'url $value is not a valid url'})
    avatar_url: string
}
