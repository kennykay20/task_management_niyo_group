import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Task Management')
    .setDescription('The Task Management REST API description')
    .setVersion('1.0')
    .addTag('task')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.port.HTTP_PORT, () => {
    console.log(`app running on port ${config.port.HTTP_PORT}`);
  });
}
bootstrap();
