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
    const foundTrasactions = await this.transactionRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return foundTrasactions;
  }

  async findOne(id: number) {
    const foundTrasaction = await this.transactionRepository.findOne({
      where: {
        id,
      },
      relations: {
        category: true,
        user: true,
      },
    });

    if (!foundTrasaction) throw new NotFoundException('Transaction not found');

    return foundTrasaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const foundTrasaction = await this.transactionRepository.findOne({
      where: {
        id,
      },
    });

    if (!foundTrasaction) throw new NotFoundException('Transaction not found');

    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
