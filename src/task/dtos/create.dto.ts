import { IsNotEmpty, IsString } from 'class-validator';

export class TaskCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
