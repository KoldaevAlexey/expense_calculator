import { Injectable, BadRequestException } from '@nestjs/common';
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
    const foundTrasactions = await this.transactionRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
    return foundTrasactions;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
