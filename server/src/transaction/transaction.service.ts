import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  async create(createTransactionDto: CreateTransactionDto, userId: number) {
    const { title, amount, type, category } = createTransactionDto;
    const newTransaction = [
      {
        title,
        amount,
        type,
        category: {
          id: +category,
        },
        user: {
          id: userId,
        },
      },
    ];

    if (!newTransaction)
      throw new BadRequestException('Transaction not created');
    return await this.transactionRepository.save(newTransaction);
  }

  async findAll(userId: number) {
    const foundTransactions = await this.transactionRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return foundTransactions;
  }

  async findOne(id: number) {
    const foundTransactions = await this.transactionRepository.findOne({
      where: {
        id,
      },
      relations: {
        category: true,
        user: true,
      },
    });

    if (!foundTransactions)
      throw new NotFoundException('Transaction not found');

    return foundTransactions;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const foundTransactions = await this.transactionRepository.findOne({
      where: {
        id,
      },
    });

    if (!foundTransactions)
      throw new NotFoundException('Transaction not found');

    return await this.transactionRepository.update(id, updateTransactionDto);
  }

  async remove(id: number) {
    const foundTransactions = await this.transactionRepository.findOne({
      where: {
        id,
      },
    });

    if (!foundTransactions)
      throw new NotFoundException('Transaction not found');

    return this.transactionRepository.delete(id);
  }

  async findAllWithPagination(id: number, page: number, limit: number) {
    const foundTransactions = await this.transactionRepository.find({
      where: {
        user: {
          id,
        },
      },
      relations: {
        category: true,
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return foundTransactions;
  }
}
