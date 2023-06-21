/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { TransactionService } from 'src/transaction/transaction.service';
import { CategoryService } from './../category/category.service';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';

export class AuthorGuard implements CanActivate {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly categoryService: CategoryService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { id, type } = request.params;
    const user = request.user as User;

    const entity =
      type === 'transaction'
        ? await this.transactionService.findOne(+id)
        : type === 'category'
        ? await this.categoryService.findOne(+id)
        : undefined;

    return Boolean(entity && user && user.id === entity.user.id);
  }
}
