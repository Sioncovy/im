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
};

export const emailConfig = {
  host: 'smtp.exmail.qq.com', //邮箱服务器地址
  port: 465, //服务器端口 默认 465
  auth: {
    user: 'mailpen@sioncovy.top',
    pass: '5J2fhhRhtY2WGqoD',
  },
  from: '信笔科技 <mailpen@sioncovy.top>',
};

export const jwtConstants = {
  // 秘钥
  secret: 'sinojackia',
};
