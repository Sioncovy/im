import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

const clientMap = new Map();

@WebSocketGateway({
  cors: true,
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  handleConnection(client) {
    // 添加连接的客户端到 Map
    clientMap.set(client.id, client);
  }

  handleDisconnect(client) {
    // 断开连接时从 Map 中删除
    clientMap.delete(client.id);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): string {
    console.log('Hello World!');
    const receiverSocket = clientMap.get(payload.receiverId);
    receiverSocket.emit('notifyMessage', payload);
    return 'Hello World!';
  }
}
