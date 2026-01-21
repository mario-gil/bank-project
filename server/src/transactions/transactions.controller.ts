import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
 
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
 
  /**
   * GET /transactions/:userId - Obtener transacciones de un usuario específico
   */
  @Get(':userId')
  async findByUser(
    @Param('userId') userId: string,
    @Query('page', new ParseIntPipe()) page: number = 1,
    @Query('limit', new ParseIntPipe()) limit: number = 10,
  ) {
    return this.transactionsService.findAll(userId, page, limit);
  }
 
  /**
   * GET /transactions/:userId/:id - Obtener una transacción por ID
   */
  @Get(':userId/:id')
  async findOne(
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    // Opcional: Verificar que la transacción pertenece al usuario
    const transaction = await this.transactionsService.findOne(id);
    if (transaction.userId !== userId) {
      throw new NotFoundException('Transaction not found for this user');
    }
    return transaction;
  }
 
  /**
   * POST /transactions - Crear una nueva transacción
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }
 
  /**
   * PATCH /transactions/:id - Actualizar una transacción
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, updateTransactionDto);
  }
 
  /**
   * DELETE /transactions/:id - Eliminar una transacción
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }

  /**
   * GET /user/:userId/balance - Obtener balance del usuario
   */
  @Get('user/:userId/balance')
  async getBalance(@Param('userId') userId: string) {
    const balance = await this.transactionsService.getUserBalance(userId);
    return { userId, balance };
  }
}