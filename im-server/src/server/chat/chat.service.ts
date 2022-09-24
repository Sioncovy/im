import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatDocument, Chat } from './entities/chat.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('chat') private readonly chatModel: Model<ChatDocument>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    const chatId = uuidv4();
    const chat = await this.findOne(createChatDto.from);
    if (chat) {
      return {
        code: 444,
        msg: '当前会话已存在',
      };
    }
    createChatDto = {
      ...createChatDto,
      chatId,
    };
    try {
      await this.chatModel.create(createChatDto);
      return {
        code: 200,
        msg: '发起会话成功',
      };
    } catch (e) {
      return {
        code: 444,
        msg: '发起会话失败：' + e,
      };
    }
  }

  async findAll(username: string) {
    try {
      const res = await this.chatModel.aggregate([
        // 从 chatModel 中先筛选匹配 match 的数据
        // 即：先筛选出当前用户的所有会话信息
        {
          $match: { from: username },
        },
        // 指定联合查询的表名，与之匹配的本表字段，目标表的字段，添加命名字段
        // 即：从 users 表中寻找 username 与上一步从 chats 表中筛选出来的数据的 to 字段相同的数据，命名为 friendInfo 添加到返回结果中
        {
          $lookup: {
            from: 'users',
            localField: 'to',
            foreignField: 'username',
            as: 'friendInfo',
          },
        },
        // 指定返回结果中不需要的字段
        {
          $project: {
            _id: 0,
            __v: 0,
            friendInfo: {
              password: 0,
              salt: 0,
              _id: 0,
              __v: 0,
            },
          },
        },
      ]);
      return {
        code: 200,
        data: {
          chatList: res,
        },
        msg: '会话列表获取成功',
      };
    } catch (error) {
      return {
        code: 444,
        msg: '会话列表获取失败：' + error,
      };
    }
  }

  async findOne(username: string, excludes?: any): Promise<Chat | any> {
    const chat = await this.chatModel.findOne({ username }, excludes);
    if (!chat) {
      return void 0;
    }
    return chat;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
