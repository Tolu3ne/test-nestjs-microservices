import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('Learn Nest')
  .setDescription('Test Swagger API')
  .setVersion('1.0')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'jwt')
  .build()
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document, {
  swaggerOptions: {
    persistAuthorization: true, // Persist authorization across page reloads
  },
  customCss: `.swagger-ui .topbar { display: none }
              .swagger-ui .auth-wrapper .authorize-wrapper span, 
              .swagger-ui .auth-wrapper .authorize-wrapper input { 
                display: inline-block !important; 
                font-size: 14px; 
                color: #333; 
              }`,
  customSiteTitle: 'My API Docs',
  customfavIcon: 'https://example.com/favicon.ico',
  customJs: '/custom-swagger.js', // Load custom JavaScript file
});
  app.useGlobalFilters(new GlobalExceptionFilter())
  await app.listen(3000);
}
bootstrap();
