import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat, ChatDocument } from './entities/chat.entity';
import { CreateMsgDto } from './dto/create-msg.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('chat')
export class ChatController {
  constructor(
    @InjectModel('chat') private chatModel: Model<ChatDocument>,
    private readonly chatService: ChatService,
  ) {}

  @Post('create')
  async create(@Body() createChatDto: CreateChatDto) {
    return await this.chatService.createChat(createChatDto);
  }

  @Get()
  async findAll(@Req() req) {
    const { username } = req.user;
    return await this.chatService.findAll(username);
  }

  @Get('query/:friend_id')
  async findOne(@Req() req, @Param('friend_id') friend_id: string) {
    const { username }: { username: string } = req.user;
    return await this.chatService.findOne(
      { from: username, to: friend_id },
      { _id: 0, __v: 0 },
    );
  }

  @Post('send')
  async sendMsg(@Body() createMsgDto: CreateMsgDto) {
    return await this.chatService.createMsg(createMsgDto);
  }

  @Get('msg/:chatId')
  async getMsg(@Param('chatId') chatId: string, @Req() req) {
    const { username } = req.user as { username: string };

    return await this.chatService.getMsgs(chatId, username);
  }
}
