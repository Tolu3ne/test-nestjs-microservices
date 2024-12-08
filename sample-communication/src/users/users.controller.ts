import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from 'src/dto/create-user.dto';
import { queryUserDto } from 'src/dto/query-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() body: createUserDto){
    return this.usersService.createUser(body)
  }

  @Get()
  findAll(@Query() query: queryUserDto) {
    return this.usersService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: number){
    return this.usersService.findOne(id)
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: UpdateUserDto){
    return this.usersService.update(id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: number){
    return this.usersService.remove(id)
  }

}
