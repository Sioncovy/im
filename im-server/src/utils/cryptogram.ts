import * as crypto from 'crypto';

/**
 * 生成 盐(salt)
 */
export const makesalt = (): string => {
  return crypto.randomBytes(3).toString('base64');
};

/**
 * Encrypt password
 * @param password 密码
 * @param salt 密码盐
 */
export const encryptPassword = (password: string, salt: string): string => {
  if (!password || !salt) return '';
  const tempSalt = Buffer.from(salt, 'base64');
  return crypto
    .pbkdf2Sync(password, tempSalt, 1000, 16, 'sha1')
    .toString('base64');
};
