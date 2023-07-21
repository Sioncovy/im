import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Request } from 'express';
import { Userinfo } from '../user/user.interface';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('add')
  create(@Body() createContactDto: CreateContactDto, @Req() req: Request) {
    console.log(createContactDto);
    const { username } = req.user as Userinfo;
    createContactDto = { ...createContactDto, username, type: 0 };
    return this.contactService.create(createContactDto);
  }

  @Get('getAllRequest')
  async findAll(@Query() query: { username: string }) {
    const { username } = query;
    return await this.contactService.getAllRequest(username);
  }

  @Get('agree')
  async agree(@Query() query: { username: string; friend_username: string }) {
    const { username, friend_username } = query;
    return await this.contactService.agree(username, friend_username);
  }

  @Get('/')
  async allFriend(@Query() query: { username: string }) {
    const { username } = query;
    return await this.contactService.allFriend(username);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(+id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }
}
