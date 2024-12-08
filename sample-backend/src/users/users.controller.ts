import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext, RpcException } from '@nestjs/microservices';
import { createUserDto } from 'src/dto/create-user.dto';
import { queryUserDto } from 'src/dto/query-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({cmd: 'create-user'})
  async handleUserCreated(@Payload() user: createUserDto, @Ctx() context: RmqContext){
    return this.usersService.handleUserCreated(user)
  }

  @MessagePattern({cmd: "fetch-users"})
  getUsers(@Payload() query: queryUserDto){
    return this.usersService.findAllUsers(query)
  }

  @MessagePattern({cmd: "fetch-one-user"})
  getOneUser(@Payload() id: number){
    return this.usersService.findOneById(id)
  }

  @MessagePattern({cmd: 'update-user'})
  updateUser(@Payload() data: {id: number, updatedData: UpdateUserDto}){
    return this.usersService.update(data.id, data.updatedData)
  }

  @MessagePattern({cmd: 'delete-user'})
  deleteUser(@Payload() id: number){
    return this.usersService.remove(id)
  }
}
