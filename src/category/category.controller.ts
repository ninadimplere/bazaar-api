import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Logger,
  Get,
} from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('user')
  async login() {
    return this.categoryService.fetchAllCategories();
  }
}
