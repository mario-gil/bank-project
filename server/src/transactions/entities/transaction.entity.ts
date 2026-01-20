import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

export enum TransactionType {
  TRANSFER = 'transfer',
  PAYMENT = 'payment',
  DIRECT_DEBIT = 'direct_debit',
  INVESTMENT = 'investment',
}

export enum TransactionStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  PROCESSING = 'processing',
  FAILED = 'failed',
}

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt?: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

