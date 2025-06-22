import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BrandCategoryService } from './brand-category.service';
import { BrandCategory } from 'brand/dto/brand-category.entity';
import {
  AddBrandToCategoryInput,
  UpdateBrandCategoryInput,
} from 'brand/dto/brand-category.input';

@Resolver(() => BrandCategory)
export class BrandCategoryResolver {
  constructor(private service: BrandCategoryService) {}

  @Query(() => [BrandCategory])
  brandCategories() {
    return this.service.getAll();
  }

  @Mutation(() => BrandCategory)
  addBrandToCategory(@Args('input') input: AddBrandToCategoryInput) {
    return this.service.add(input);
  }

  @Mutation(() => BrandCategory)
  updateBrandCategory(@Args('input') input: UpdateBrandCategoryInput) {
    return this.service.update(input);
  }

  @Mutation(() => Boolean)
  removeBrandFromCategory(
    @Args('brandId', { type: () => Int }) brandId: number,
    @Args('categoryId', { type: () => Int }) categoryId: number,
  ) {
    return this.service.delete(brandId, categoryId).then(() => true);
  }
}
