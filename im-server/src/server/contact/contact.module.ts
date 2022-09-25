import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactSchema } from './entities/contact.entity';
import { UserModule } from '../user/user.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'contact', schema: ContactSchema }]),
    UserModule,
    ChatModule,
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
