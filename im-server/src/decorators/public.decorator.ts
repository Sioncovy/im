// 创建装饰器文件，用于对接口添加注解
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('isPublic', true);
