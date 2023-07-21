import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from './entities/user.entities';
import { AuthModule } from 'src/auth/auth.module';
import { FileModule } from '../file/file.module';
import { ToolsService } from 'src/utils/tools.service';
import { FileService } from '../file/file.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    forwardRef(() => AuthModule),
    FileModule,
  ],
  controllers: [UserController],
  providers: [UserService, ToolsService, FileService],
  exports: [UserService],
})
export class UserModule {}
