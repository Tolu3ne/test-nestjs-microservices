import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [    
    ClientsModule.register([
    {
      name: 'USERS_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'users-queue'
      }
    }
  ])],
  exports: [ClientsModule]
})
export class CoreModule{}


@Module({
  imports: [
    CoreModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
