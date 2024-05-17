import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskCreateDto } from './dtos/create.dto';
import { TaskStatusValidationPipe } from './pipes/task.pipe';
import { TaskStatus } from 'src/utils';
import { Request } from 'express';

@Controller('v1/tasks')
export class TaskController {
  constructor(private readonly taskSvc: TaskService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  CreateTask(@Body() taskCreateDto: TaskCreateDto, @Req() req: Request) {
    return this.taskSvc.createTask(taskCreateDto, req);
  }

  @Get(':id')
  GetTask(@Param('id') id: string, @Req() req: Request) {
    return this.taskSvc.getTaskById(id, req);
  }

  @Get()
  GetAllTask() {
    return this.taskSvc.getAllTask();
  }

  @Patch(':id')
  UpdateTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @Req() req: Request,
  ) {
    return this.taskSvc.updateTaskById(id, status, req);
  }

  @Delete(':id')
  DeleteTask(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.taskSvc.deleteTaskById(id, req);
  }
}
