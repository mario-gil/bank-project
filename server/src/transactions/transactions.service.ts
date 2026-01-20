import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionDocument, TransactionStatus } from './entities/transaction.entity';
import { User, UserDocument } from '../users/entities/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Crear una nueva transacción
   * Sincroniza el balance del usuario después de crear
   */
  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = new this.transactionModel({
      ...createTransactionDto,
      status: TransactionStatus.PENDING,
      createdAt: new Date(),
    });

    const savedTransaction = await transaction.save();

    // Sincronizar balance del usuario después de crear
    await this.syncUserBalance(createTransactionDto.userId);

    return savedTransaction;
  }

  /**
   * Obtener todas las transacciones con paginación
   */
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const data = await this.transactionModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.transactionModel.countDocuments().exec();

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

  /**
   * Obtener transacciones filtradas por userId con paginación
   */
  async findByUser(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const data = await this.transactionModel
      .find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.transactionModel.countDocuments({ userId }).exec();

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

  /**
   * Obtener una transacción por ID
   */
  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel.findById(id).exec();

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  /**
   * Actualizar una transacción existente
   * Sincroniza el balance del usuario después de actualizar
   */
  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.transactionModel.findByIdAndUpdate(
      id,
      {
        ...updateTransactionDto,
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // Sincronizar balance del usuario después de actualizar
    await this.syncUserBalance(transaction.userId);

    return transaction;
  }

  /**
   * Eliminar una transacción
   * Sincroniza el balance del usuario después de eliminar
   */
  async remove(id: string): Promise<{ message: string }> {
    const transaction = await this.transactionModel.findByIdAndDelete(id).exec();

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // Sincronizar balance del usuario después de eliminar
    await this.syncUserBalance(transaction.userId);

    return { message: `Transaction ${id} has been deleted` };
  }

  /**
   * Sincronizar el balance del usuario
   * Calcula el nuevo balance basado en transacciones completadas
   */
  async syncUserBalance(userId: string): Promise<void> {
    try {
      // Sumar todas las transacciones completadas del usuario
      const completedTransactions = await this.transactionModel
        .find({
          userId,
          status: TransactionStatus.COMPLETED,
        })
        .exec();

      const totalBalance = completedTransactions.reduce((sum, transaction) => {
        return sum + transaction.amount;
      }, 0);

      // Actualizar el balance del usuario
      await this.userModel.findByIdAndUpdate(userId, { balance: totalBalance }).exec();
    } catch (error) {
      // Log error pero no fallar la operación principal
      console.error(`Error syncing balance for user ${userId}:`, error);
    }
  }
}