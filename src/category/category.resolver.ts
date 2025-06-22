// category.resolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './dto/category.entity';
import { CreateCategoryInput, UpdateCategoryInput } from './dto/category.input';
import {
  CategoryResponse,
  CategoryListResponse,
} from './dto/category.response';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private categoryService: CategoryService) {}

  @Query(() => CategoryListResponse)
  async categories(
    @Args('offset', { type: () => Int, nullable: true }) offset = 0,
    @Args('limit', { type: () => Int, nullable: true }) limit = 10,
    @Args('showActive', { type: () => Boolean, nullable: true })
    showActive?: boolean,
  ): Promise<CategoryListResponse> {
    const result = await this.categoryService.fetchAllCategories({
      offset,
      limit,
      showActive,
    });
    return {
      success: true,
      data: result,
    };
  }

  @Query(() => CategoryResponse)
  async category(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<CategoryResponse> {
    const result = await this.categoryService.getCategoryById(id);
    if (!result) {
      return {
        success: false,
        message: `Category with id ${id} not found.`,
      };
    }
    return { success: true, data: result };
  }

  @Query(() => CategoryResponse)
  async categoryBySlug(@Args('slug') slug: string): Promise<CategoryResponse> {
    const result = await this.categoryService.getCategoryBySlug(slug);
    if (!result) {
      return {
        success: false,
        message: `Category with slug "${slug}" not found.`,
      };
    }
    return { success: true, data: result };
  }

  @Query(() => CategoryListResponse)
  async subcategories(
    @Args('parentId', { type: () => Int }) parentId: number,
  ): Promise<CategoryListResponse> {
    const result = await this.categoryService.getCategoriesByParentId(parentId);
    return {
      success: true,
      data: result,
    };
  }

  @Mutation(() => CategoryResponse)
  async createCategory(
    @Args('input') input: CreateCategoryInput,
  ): Promise<CategoryResponse> {
    const result = await this.categoryService.createCategory(input);
    if (!result) {
      return { success: false, message: 'Failed to create category.' };
    }
    return { success: true, data: result };
  }

  @Mutation(() => CategoryResponse)
  async updateCategory(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateCategoryInput,
  ): Promise<CategoryResponse> {
    const result = await this.categoryService.updateCategory(id, input);
    if (!result) {
      return {
        success: false,
        message: `Category with id ${id} not found or update failed.`,
      };
    }
    return { success: true, data: result };
  }

  //   @Mutation(() => CategoryResponse)
  //   async deleteCategory(
  //     @Args('id', { type: () => Int }) id: number,
  //   ): Promise<CategoryResponse> {
  //     const result = await this.categoryService.deleteCategory(id);
  //     if (!result) {
  //       return {
  //         success: false,
  //         message: `Category with id ${id} not found or delete failed.`,
  //       };
  //     }
  //     return { success: true, data: result };
  //   }

  @Query(() => Int)
  async totalCategories(
    @Args('showActive', { type: () => Boolean, nullable: true })
    showActive?: boolean,
  ): Promise<number> {
    return this.categoryService.countCategories(showActive);
  }
}
