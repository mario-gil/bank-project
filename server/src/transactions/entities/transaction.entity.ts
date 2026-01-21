import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
 
export enum TransactionType {
  TRANSFER = 'transfer',
  PAYMENT = 'payment',
  INCOME = 'income',
  EXPENSE = 'expense'
}
 
export enum TransactionStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  PROCESSING = 'processing',
  FAILED = 'failed',
}
 
@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;
 
  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;
 
  @Column({
    type: 'enum',
    enum: TransactionType,
    nullable: false
  })
  type: TransactionType;
 
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;
 
  // @Column({
  //   type: 'enum',
  //   enum: TransactionStatus,
  //   default: TransactionStatus.PENDING
  // })
  // status: TransactionStatus;
 
  @Column({ type: 'uuid', nullable: false })
  userId: string;
 
  @ManyToOne(() => User, user => user.transactions)
  @JoinColumn({ name: 'userId' })
  user: User;
 
  @CreateDateColumn()
  createdAt: Date;
}