import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto, id: number) {
    console.log(id);
    const { title } = createCategoryDto;
    const existCategory = await this.categoryRepository.findBy({
      user: { id },
      title,
    });

    if (existCategory.length)
      throw new BadRequestException('Category already exists');

    const newCategory = { title, user: { id } };

    return await this.categoryRepository.save(newCategory);
  }

  async findAll(userId: number) {
    return await this.categoryRepository.find({
      where: { user: { id: userId } },
      relations: { transactions: true },
    });
  }

  findOne(id: number) {
    const foundCategory = this.categoryRepository.findOne({
      where: { id },
      relations: { user: true, transactions: true },
    });

    if (!foundCategory) throw new NotFoundException('Category not found');

    return foundCategory;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const foundCategory = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!foundCategory) throw new NotFoundException('Category not found');

    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    const foundCategory = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!foundCategory) throw new NotFoundException('Category not found');

    return await this.categoryRepository.delete(id);
  }
}
