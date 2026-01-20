import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
  OPERATOR = 'OPERATOR',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.VIEWER })
  role: UserRole;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({ type: Number, default: 0 })
  balance: number;

  @Prop()
  lastLogin: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
