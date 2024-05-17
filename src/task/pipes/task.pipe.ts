import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { TaskStatus } from 'src/utils/index';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedTaskStatus = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ];

  transform(status: any, metadata: ArgumentMetadata): any {
    status = status.toUpperCase();
    if (!this.isValidStatus(status)) {
      throw new BadRequestException(`${status} is an invalid status`);
    }
    return status;
  }

  private isValidStatus(status) {
    const index = this.allowedTaskStatus.indexOf(status);
    return index !== -1;
  }
}
