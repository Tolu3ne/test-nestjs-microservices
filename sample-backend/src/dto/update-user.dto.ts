import { PartialType } from '@nestjs/mapped-types';
import { createUserDto } from './create-user.dto';
import { IsString, IsUrl, isURL } from 'class-validator';

export class UpdateUserDto extends PartialType(createUserDto) {
    @IsString({message: 'url $value is not a valid url'})
    avatar_url: string
}
