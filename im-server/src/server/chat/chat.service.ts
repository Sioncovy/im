import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatDocument, Chat } from './entities/chat.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateMsgDto } from './dto/create-msg.dto';
import { Message, MessageDocument } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('chat') private readonly chatModel: Model<ChatDocument>,
    @InjectModel('message') private messageModel: Model<MessageDocument>,
  ) {}

  async createChat(createChatDto: CreateChatDto) {
    const chatId = uuidv4();
    const chat = await this.chatModel.findOne(createChatDto);
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
      await this.chatModel.create({
        ...createChatDto,
        from: createChatDto.to,
        to: createChatDto.from,
      });
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

  async findOne(filter: any, excludes?: any) {
    const chat = await this.chatModel.findOne(filter, excludes);
    if (!chat) {
      return {
        code: 444,
        msg: '获取会话信息失败',
      };
    }
    return {
      code: 200,
      data: {
        chatInfo: chat,
      },
      msg: '获取会话信息成功',
    };
  }

  async createMsg(createMsgDto: CreateMsgDto) {
    try {
      const uuid = uuidv4();
      const time = new Date().getTime();
      const type = typeof createMsgDto.msg === 'string' ? 0 : 1;
      const newMsg = await this.messageModel.create({
        ...createMsgDto,
        msg_id: uuid,
        send_time: time,
        type,
      });
      const { chatId, msg } = createMsgDto;
      const res = await this.chatModel.updateMany(
        { chatId },
        {
          last_msg: msg,
          last_msg_id: uuid,
          last_time: time,
        },
      );
      return {
        code: 200,
        data: newMsg,
        msg: '',
      };
    } catch (err) {
      return {
        code: 444,
        msg: '消息发送失败：' + err,
      };
    }
  }

  async getMsgs(
    chatId: string,
    username: string,
    pageNum: number,
    pageSize: number,
  ) {
    try {
      const chat = await this.chatModel.findOne({ chatId });
      if (chat.from !== username && chat.to !== username) {
        return {
          code: 444,
          msg: '非本人查询！',
        };
      }
      const msgList = await this.messageModel
        .find({ chatId }, { __v: 0, _id: 0 })
        .sort({ send_time: -1 })
        .skip(pageNum * pageSize)
        .limit(pageSize);
      msgList.sort((a, b) => a.send_time - b.send_time);
      return {
        code: 200,
        data: {
          msgList,
        },
        msg: '消息列表获取成功',
      };
    } catch (err) {
      return { code: 444, msg: '消息列表获取失败：' + err };
    }
  }
}
