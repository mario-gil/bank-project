import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user.entity';
 
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
 
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
 
  async updateBalance(userId: string, amount: number): Promise<User> {
    const user = await this.findOne(userId);
    user.balance = Number(user.balance) + amount;
    return this.usersRepository.save(user);
  }
 
  async setBalance(userId: string, balance: number): Promise<User> {
    const user = await this.findOne(userId);
    user.balance = balance;
    return this.usersRepository.save(user);
  }
 
  async checkPermission(userId: string, requiredRole: UserRole): Promise<boolean> {
    const user = await this.findOne(userId);
    return user.role === requiredRole;
  }
}