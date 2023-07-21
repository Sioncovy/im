export const config = {
  mongodb: {
    host: 'mongodb://localhost',
    port: '27017',
    database: 'im',
  },
  redis: {
    port: 6379,
    host: '127.0.0.1',
    db: 0,
  },
  host: 'http://localhost:4000',
};

export const emailConfig = {
  host: 'smtp.exmail.qq.com', //邮箱服务器地址
  port: 465, //服务器端口 默认 465
  auth: {
    user: 'xiongkangwei@sion.ink',
    pass: 'kHTP3uC9jpAHMJFk',
  },
  from: '信笔科技 <xiongkangwei@sion.ink>',
};

export const jwtConstants = {
  // 秘钥
  secret: 'sinojackia',
};
