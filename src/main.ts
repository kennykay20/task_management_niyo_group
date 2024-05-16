import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config';
import { SwaggerModule } from '@nestjs/swagger';
import { options } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.port.HTTP_PORT, () => {
    console.log(`app running on port ${config.port.HTTP_PORT}`);
  });
}
bootstrap();
