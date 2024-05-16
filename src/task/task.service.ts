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
import { User } from 'src/user/models/user.model';
import { TaskStatus } from 'src/utils';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @Inject(UserService)
    private readonly userSrv: UserService,
  ) {}

  async createTask(createData: TaskCreateDto, user: User) {
    const { title, description } = createData;

    try {
      const userData = await this.userSrv.getUserById(user.id);
      if (!userData) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const task = new Task();
      task.id = uuidv4();
      task.title = title;
      task.description = description;
      task.status = TaskStatus.OPEN;
      task.user = user;

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

  async getTaskById(id: string, user: User): Promise<Task | null> {
    try {
      const result = await this.taskRepo.findOne({
        where: { id, isDeleted: false, userId: user.id },
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

  async updateTaskById(id: string, status: TaskStatus, user: User) {
    try {
      const result = await this.getTaskById(id, user);
      if (!result) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
      result.status = status;
      return await this.taskRepo.save({ id, result });
    } catch (error) {
      Logger.log(error);
    }
  }

  async deleteTaskById(id: string, user: User) {
    try {
      const result = await this.taskRepo.findOne({
        where: { id, isDeleted: false, userId: user.id },
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
