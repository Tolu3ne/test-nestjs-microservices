import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, timeout } from 'rxjs';
import { createUserDto } from 'src/dto/create-user.dto';
import { queryUserDto } from 'src/dto/query-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(@Inject('USERS_SERVICE') private readonly rabbitClient: ClientProxy){}
    async createUser(user: createUserDto) {
        return this.rabbitClient.send({cmd: 'create-user'}, user)
    }

    async findAll(query: queryUserDto) {
        // find data in cache microservice
        const result = this.rabbitClient.send({cmd:'fetch-users'}, query)
        .pipe(timeout(5000))
        // set new cache data in cache microservice
        return result
    }

    async findOne(id: number){
        // find data in cache microservice
        const result = this.rabbitClient.send({cmd: 'fetch-one-user'}, id)
        .pipe(timeout(5000))
        // set new cache data in cache microservice
        return result
    }

    async update(id: number, updatedData: UpdateUserDto){
        return this.rabbitClient.send({cmd: 'update-user'}, {id: id, updatedData: updatedData})
    }

    async remove(id: number){
        return this.rabbitClient.send({cmd:'delete-user'}, id)
    }
}
