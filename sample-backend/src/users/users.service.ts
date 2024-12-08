import { BadRequestException, ForbiddenException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { createUserDto } from 'src/dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import { user } from '@prisma/client'
import { queryUserDto } from 'src/dto/query-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    private bcrypt = require('bcrypt')
    private saltRounds = 10;
    async compareHash(password: string, dbHash: string): Promise<boolean> {
        return this.bcrypt.compare(password, dbHash);
    }

    private async usernameCheck(UserDto: createUserDto | UpdateUserDto) {
        if (UserDto.id != null && await this.prisma.user.findUnique({ where: { id: UserDto.id } }) != null)
            throw new RpcException(
                {
                    status: HttpStatus.FORBIDDEN,
                    message: "This id is already used by a different user",
                    detail: "Input id " + UserDto.id + ' is already used in the database',
                }
            )
        // check for already existed id, if id is not declared then it is randomly generated (create) or not adjusted(update)

        var user: user
        if (UserDto.username != undefined) user = await this.prisma.user.findUnique({ where: { username: UserDto.username } });
        if (user != null) throw new RpcException(
            {
                status: HttpStatus.FORBIDDEN,
                message: "username is already used by a different user",
                detail: "Username " + UserDto.username + " is already in the database",
            }
        )
    }

    async handleUserCreated(user: createUserDto) {
        await this.usernameCheck(user)
            .catch(error => { throw error })

        var userData = {
            ...user, ...{ id: user.id != undefined ? Number(user.id) : undefined }, ...{ hashed_password: await this.bcrypt.hash(user.password, this.saltRounds) }
            , ...{ isActive: Number(user.isActive) }, ...{ avatar_url: null }, ...{ password: undefined }
        } as user

        return this.prisma.user.create({ data: userData })
    }

    async findAllUsers(query: queryUserDto) {
        console.log(query)
        const queryBy = ['username', 'firstName', 'lastName', 'email']
        const queryParams = this.getParams(query, queryBy)
        console.log(queryParams)

        const totalCount = (await this.prisma.user.findMany({ where: queryParams.where })).length

        const result = await this.prisma.user.findMany(queryParams)
            .then((res) => {
                if (queryParams.skip >= totalCount && totalCount > 0) throw new RpcException({
                    message: 'Input page number exceeds the total page limit',
                    detail: `Input page number ${query.page} exceeds the total queried records`,
                    status: HttpStatus.NOT_FOUND
                })
                if (res.length == 0) throw new NotFoundException({
                    message: 'Cannot find specified data from the database',
                    detail: `No results found for query ${query.query}`,
                    status: HttpStatus.NOT_FOUND
                })
                else return res
            })
            .catch((error: RpcException) => { throw error })

        return {
            data: result,
            meta: {
                query: query.query,
                page: Math.floor(queryParams.skip / queryParams.take) + 1,
                limit: queryParams.take,
                totalRecords: totalCount,
                totalPages: Math.floor(totalCount / queryParams.take) + 1,
                orderedBy: query.orderBy || 'id',
                order: Object.values(queryParams.orderBy)[0]
            }
        }
    }

    private getParams(params: queryUserDto, queryBy?: string[]) {
        // get pagination
        var { query, limit = 10, page = 1, orderBy = 'id', order = 'asc' } = params
        const offset = (page - 1) * limit;
        // get order parameters
        const where = query && queryBy ? {
            OR: queryBy.map((value) => { return { [value]: { contains: query } } })
        } : undefined

        return {
            where: where,
            orderBy: orderBy ? { [orderBy]: order } : undefined,
            take: Number(limit),
            skip: offset
        }
    }

    async findOneById(id: number) {
        return this.findOne(id);
    }

    async findOneByUsername(username: string) {
        return this.findOne(username, 'username')
    }

    private async findOne(id: any, identifier?: string) {
        const where = identifier === 'username' ? { [identifier]: id } : { id: Number(id) }
        const data = await this.prisma.user.findUnique({ where })
            .catch((err: RpcException) => {
                if (identifier != undefined) {
                    throw new RpcException({
                        message: "The server failed to complete this request due to server error",
                        detail: `${identifier} is not a unique field `,
                        status: HttpStatus.BAD_REQUEST
                    })
                }
            })
        if (data != null) return data
        else throw new RpcException({
            status: HttpStatus.NOT_FOUND,
            message: `Cannot find user`,
            detail: `user with ${identifier ? identifier : 'id'} ${id} is not found in the database`,
        })
    }

    async update(id: number, updatedData: UpdateUserDto) {
        if (updatedData.username != null || (updatedData.id != null && updatedData.id != id)) await this.usernameCheck(updatedData)
            .catch(error => {throw error});
        var userData = {
            ...updatedData, ...{ id: updatedData.id != undefined ? Number(updatedData.id) : undefined }, ...{ hashed_password: updatedData.password ? await this.bcrypt.hash(updatedData.password, this.saltRounds) : undefined }
            , ...{ isActive: updatedData.isActive ? Number(updatedData.isActive) : undefined }, ...{ password: undefined }
        } as user

        await (this.findOne(id))
            .catch((error) => { throw error })
        return this.prisma.user.update({
            where: { id: Number(id) },
            data: userData
        })
    }

    async remove(id: number): Promise<any> {
        await (this.findOne(id))
            .catch(error => { throw error })
        return this.prisma.user.delete({
            where: { id: Number(id) }
        })
    }
}
