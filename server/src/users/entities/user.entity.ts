import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';
 
export enum UserRole {
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
}
 
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
 
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;
 
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER
  })
  role: UserRole;
 
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;
 
  @CreateDateColumn()
  createdAt: Date;
 
  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[];
}