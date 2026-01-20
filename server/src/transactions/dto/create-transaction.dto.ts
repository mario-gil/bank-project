import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  Min,
  IsPositive,
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
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  userId: string;
}

