import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatSchema } from './entities/chat.entity';
import { MessageSchema } from './entities/message.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'chat', schema: ChatSchema },
      { name: 'message', schema: MessageSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
