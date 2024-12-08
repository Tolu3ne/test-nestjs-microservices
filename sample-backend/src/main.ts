import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GlobalRpcExceptionFilter } from './exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'users-queue'
      }
    }
  )
  app.useGlobalFilters(new GlobalRpcExceptionFilter());
  app.listen()
}
bootstrap();
