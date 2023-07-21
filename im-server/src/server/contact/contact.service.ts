import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Contact, ContactDocument } from './entities/contact.entity';
import { UserService } from '../user/user.service';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel('contact') private contactModel: Model<ContactDocument>,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

  create(createContactDto: CreateContactDto) {
    try {
      this.contactModel.create(createContactDto);
    } catch (err) {
      return {
        code: 444,
        msg: '好友申请发送失败，请重试', // bug: 失败时未返回错误
      };
    }
    return {
      code: 200,
      msg: '好友申请发送成功',
    };
  }

  async getAllRequest(username: string) {
    try {
      const requests = await this.contactModel.find(
        { type: 0, friend_username: username },
        { _id: 0, __v: 0 },
      );
      return {
        code: 200,
        data: {
          requests,
        },
        msg: '获取好友申请成功',
      };
      // return requests;
    } catch (err) {
      return {
        code: 444,
        msg: '获取好友申请发生未知错误',
      };
    }
    // return `This action returns all contact`;
  }

  async agree(username: string, friend_username: string) {
    try {
      await this.contactModel.findOneAndUpdate(
        { username, friend_username },
        { type: 1, relation_count: 0 },
      );
      await this.contactModel.create({
        username: friend_username,
        friend_username: username,
        type: 1,
        relation_count: 0,
      });
      this.chatService.createChat({ from: username, to: friend_username });
      return {
        code: 200,
        msg: '同意好友申请成功',
      };
    } catch (e) {
      return {
        code: 444,
        msg: '同意好友申请发生未知错误',
      };
    }
  }

  async allFriend(username: string) {
    try {
      const friends = (await this.contactModel.find(
        { username, type: 1 },
        { _id: 0, __v: 0 },
      )) as { username: string; friend_username: string }[];

      const len = friends.length;
      const friendsList = [];
      for (let i = 0; i < len; i++) {
        friendsList.push(
          await this.userService.findOne(friends[i].friend_username, {
            _id: 0,
            __v: 0,
            salt: 0,
            password: 0,
          }),
        );
      }
      return {
        code: 200,
        data: {
          friendsList,
        },
        msg: '好友列表获取成功',
      };
    } catch (e) {
      return {
        code: 444,
        msg: '获取好友列表发生未知错误: ' + e,
      };
    } finally {
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} contact`;
  }

  update(id: number, updateContactDto: UpdateContactDto) {
    return `This action updates a #${id} contact`;
  }

  remove(id: number) {
    return `This action removes a #${id} contact`;
  }
}
