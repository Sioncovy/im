import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Contact, ContactDocument } from './entities/contact.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel('contact') private contactModel: Model<ContactDocument>,
    private readonly userService: UserService,
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

  async getAllRequest(username) {
    try {
      const requests = await this.contactModel.find(
        { type: 0, friend_id: username },
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

  async agree(id, fid) {
    try {
      await this.contactModel.findOneAndUpdate(
        { id, friend_id: fid },
        { type: 1, relation_count: 0 },
      );
      await this.contactModel.create({
        id: fid,
        friend_id: id,
        type: 1,
        relation_count: 0,
      });
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

  async allFriend(id) {
    try {
      const friends = await this.contactModel.find(
        { id, type: 1 },
        { _id: 0, __v: 0 },
      );
      const len = friends.length;
      const friendsList = [];
      for (let i = 0; i < len; i++) {
        friendsList.push(
          await this.userService.findOne(friends[i].friend_id, {
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
