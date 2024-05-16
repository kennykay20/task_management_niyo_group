import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { TaskCreateDto } from './dtos/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './models/task.model';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from 'src/user/user.service';
import { TaskStatus } from 'src/utils';
import { Request } from 'express';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @Inject(UserService)
    private readonly userSrv: UserService,
  ) {}

  async createTask(createData: TaskCreateDto, req: Request) {
    const { title, description } = createData;
    const user = req.headers['user'].toString();
    try {
      const userData = await this.userSrv.getUserById(user['id']);
      if (!userData) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const task = new Task();
      task.id = uuidv4();
      task.title = title;
      task.description = description;
      task.status = TaskStatus.OPEN;
      task.user = userData;

      const saveTask = await this.taskRepo.save(task);
      delete saveTask.user;
      return saveTask;
    } catch (error) {
      Logger.log(error);
    }
  }

  async getAllTask(): Promise<Task[] | null> {
    return await this.taskRepo.find();
  }

  async getTaskById(id: string, req: Request): Promise<Task | null> {
    try {
      const user = req.headers['user'].toString();
      const result = await this.taskRepo.findOne({
        where: { id, isDeleted: false, userId: user['id'] },
      });
      if (!result) {
        throw new HttpException(
          `Task with ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return result;
    } catch (error) {
      Logger.log(error);
    }
  }

  async updateTaskById(id: string, status: TaskStatus, req: Request) {
    try {
      const user = req.headers['user'].toString();
      const result = await this.getTaskById(id, user['id']);
      if (!result) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
      result.status = status;
      return await this.taskRepo.save({ id, result });
    } catch (error) {
      Logger.log(error);
    }
  }

  async deleteTaskById(id: string, req: Request) {
    try {
      const user = req.headers['user'].toString();
      const result = await this.taskRepo.findOne({
        where: { id, isDeleted: false, userId: user['id'] },
      });
      if (!result) {
        throw new HttpException(
          `Task with ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      result.isDeleted = true;
      return await this.taskRepo.save({ id, result });
    } catch (error) {
      Logger.log(error);
    }
  }
}
