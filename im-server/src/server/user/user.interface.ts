import { Document } from 'mongoose';

export interface User extends Document {
  // readonly _id: ObjectId;
  readonly username: string;
  readonly password: string;
}

export interface Login extends Document {
  // readonly _id: ObjectId;
  readonly username: string;
  readonly password: string;
  readonly code: string;
  readonly timestamp: number;
}

export interface Register extends Document {
  // readonly _id: ObjectId;
  readonly username: string;
  readonly password: string;
  readonly code: string;
}

export interface Userinfo {
  readonly username: string;
}
