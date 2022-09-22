import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('add')
  create(@Body() createContactDto: CreateContactDto) {
    console.log(createContactDto);
    createContactDto = { ...createContactDto, type: 0 };
    return this.contactService.create(createContactDto);
  }

  @Get('getAllRequest')
  async findAll(@Query() query: { username: string }) {
    const { username } = query;
    return await this.contactService.getAllRequest(username);
  }

  @Get('agree')
  async agree(@Query() query: { id: string; fid: string }) {
    const { id, fid } = query;
    return await this.contactService.agree(id, fid);
  }

  @Get('/')
  async allFriend(@Query() query: { id: string }) {
    const { id } = query;
    return await this.contactService.allFriend(id);
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
