import { Task } from 'src/task/models/task.model';

export interface ServerToClientEvents {
  newMessage: (payload: Task) => void;
}
