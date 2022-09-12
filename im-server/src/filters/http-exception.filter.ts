import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

// 捕捉 HttpException 异常
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const rsp = ctx.getResponse();
    // const req = ctx.getRequest();

    const message = exception.message;
    Logger.log('错误提示', message);

    const errorResponse = {
      data: {
        error: message,
      },
      msg: '请求失败',
      code: 444,
    };
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    rsp.status(status);
    rsp.header('Content-Type', 'application/json', 'charset=utf-8');
    rsp.send(errorResponse);
  }
}
