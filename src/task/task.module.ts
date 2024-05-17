import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './models/task.model';
import { EventGatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UserModule, EventGatewayModule],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
