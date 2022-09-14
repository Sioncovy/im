import { Schema, ObjectId } from 'mongoose';

export const UserSchema = new Schema({
  // _id: { type: string, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
});
