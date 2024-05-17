import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ServerToClientEvents } from './events';
import { Task } from 'src/task/models/task.model';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/guards/ws-jwt/ws-jwt.guard';
import { SocketAuthMiddleware } from 'src/middlewares/ws.middleware';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(WsJwtGuard)
export class EventGatewayService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server<any, ServerToClientEvents>;

  afterInit(client: Socket) {
    console.log('inside the afterinit');
    client.use(SocketAuthMiddleware() as any);
  }

  sendMessage(task: Task) {
    this.server.emit('newMessage', task);
  }

  @SubscribeMessage('message')
  handleMessage() {
    return 'hello world';
  }
  // @SubscribeMessage('createTask')
  // async createTask(@MessageBody() payload: CreateTaskDto, @Req() req: Request) {
  //   console.log(req.headers['user'].toString());
  //   const message = await this.taskSvc.createTask(payload, req);
  //   this.server.emit('message', message);
  //   return message;
  // }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }
}
