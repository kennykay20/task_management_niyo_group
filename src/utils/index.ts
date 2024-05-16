import { DocumentBuilder } from '@nestjs/swagger';

const EMAIL_TOKEN_EXPIRATION_MINUTE = 10;
const EMAIL_TOKEN_EXPIRATION_HOUR = 24;
export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export const expirationMinute = () => {
  return new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTE * 60 * 1000,
  );
};

export const expirationHour = () => {
  return new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_HOUR * 60 * 60 * 1000,
  );
};

export const options = new DocumentBuilder()
  .setTitle('Task Management')
  .setDescription('The Task Management REST API description')
  .setVersion('1.0')
  .addTag('task')
  .addBearerAuth()
  .build();
