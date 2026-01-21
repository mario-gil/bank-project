import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  Transaction,
  TransactionType,
  TransactionStatus
} from './entities/transaction.entity';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';
 
@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private usersService: UsersService,
  ) {}
 
  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    // Verificar permisos del usuario
    const canWrite = await this.usersService.checkPermission(
      createTransactionDto.userId,
      UserRole.ADMIN
    );
    
    if (!canWrite) {
      throw new ForbiddenException('User does not have write permissions');
    }
 
    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      // status: TransactionStatus.PENDING,
    });
 
    const savedTransaction = await this.transactionsRepository.save(transaction);
 
    // Sincronizar balance del usuario
    await this.syncUserBalance(createTransactionDto.userId);
 
    return savedTransaction;
  }
 
  async findAll(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
 
    const [data, total] = await this.transactionsRepository.findAndCount({
      where: { userId },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
 
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
 
  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id }
    });
 
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
 
    return transaction;
  }
 
  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    // Primero obtener la transacción para verificar el userId
    const existingTransaction = await this.findOne(id);
    
    // Verificar permisos del usuario
    const canWrite = await this.usersService.checkPermission(
      existingTransaction.userId,
      UserRole.ADMIN
    );
    
    if (!canWrite) {
      throw new ForbiddenException('User does not have write permissions');
    }
 
    await this.transactionsRepository.update(id, {
      ...updateTransactionDto,
      // updatedAt: new Date(),
    });
 
    const updatedTransaction = await this.findOne(id);
 
    // Sincronizar balance del usuario
    await this.syncUserBalance(updatedTransaction.userId);
 
    return updatedTransaction;
  }
 
  async remove(id: string): Promise<{ message: string }> {
    const transaction = await this.findOne(id);
    
    // Verificar permisos del usuario
    const canWrite = await this.usersService.checkPermission(
      transaction.userId,
      UserRole.ADMIN
    );
    
    if (!canWrite) {
      throw new ForbiddenException('User does not have write permissions');
    }
 
    await this.transactionsRepository.delete(id);
 
    // Sincronizar balance del usuario
    await this.syncUserBalance(transaction.userId);
 
    return { message: `Transaction ${id} has been deleted` };
  }
 
  async syncUserBalance(userId: string): Promise<void> {
    try {
      // Sumar todas las transacciones completadas del usuario
      const result = await this.transactionsRepository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'total')
        .where('transaction.userId = :userId', { userId })
        // .andWhere('transaction.status = :status', { status: TransactionStatus.COMPLETED })
        .getRawOne();
 
      const totalBalance = result.total ? Number(result.total) : 0;
 
      // Actualizar el balance del usuario
      await this.usersService.setBalance(userId, totalBalance);
    } catch (error) {
      console.error(`Error syncing balance for user ${userId}:`, error);
    }
  }
 
  async getUserBalance(userId: string): Promise<number> {
    const user = await this.usersService.findOne(userId);
    return Number(user.balance);
  }
}