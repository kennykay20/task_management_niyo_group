import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskCreateDto } from './dtos/create.dto';
import { TaskStatusValidationPipe } from './pipes/task.pipe';
import { TaskStatus } from 'src/utils';
import { GetUser } from 'src/user/getuser.decorator';
import { User } from 'src/user/models/user.model';

@Controller('v1/tasks')
export class TaskController {
  constructor(private readonly taskSvc: TaskService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  CreateTask(@Body() taskCreateDto: TaskCreateDto, @GetUser() user: User) {
    return this.taskSvc.createTask(taskCreateDto, user);
  }

  @Get(':id')
  GetTask(@Param('id') id: string, @GetUser() user: User) {
    return this.taskSvc.getTaskById(id, user);
  }

  @Get()
  GetAllTask() {
    return this.taskSvc.getAllTask();
  }

  @Patch('/:id/status')
  UpdateTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ) {
    return this.taskSvc.updateTaskById(id, status, user);
  }

  @Delete(':id')
  DeleteTask(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.taskSvc.deleteTaskById(id, user);
  }
}
