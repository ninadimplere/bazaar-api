import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private categoryService: CategoryService) {}

  @Query(() => [Category])
  async categories() {
    return this.categoryService.fetchAllCategories();
  }

  @Query(() => Category)
  async category(@Args('id', { type: () => Int }) id: number) {
    return this.categoryService.getCategoryById(id);
  }
}
