import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

const clientMap = new Map();

@WebSocketGateway({
  cors: true,
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('connection')
  handleConnection(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    // 添加连接的客户端到 Map
    clientMap.set(client.id, client);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    client.join(payload);
    return 'ok';
  }

  handleDisconnect(client) {
    // 断开连接时从 Map 中删除
    clientMap.delete(client.id);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const msg = await this.chatService.createMsg(payload);
    if (msg?.code === 200) {
      client.to(payload.chatId).emit('notifyMessage', msg);
    } else {
      client.emit('notifyMessage', msg);
    }
  }
}
