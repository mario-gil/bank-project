import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}

