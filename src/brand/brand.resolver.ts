import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { BrandService } from './brand.service';
import { Brand } from './dto/brand.entity';
import { CreateBrandInput, UpdateBrandInput } from './dto/brand.input';

@Resolver(() => Brand)
export class BrandResolver {
  constructor(private readonly brandService: BrandService) {}

  @Query(() => [Brand])
  brands(
    @Args('categorySlug', { nullable: true }) categorySlug?: string,
    @Args('featured', { nullable: true }) featured?: boolean,
  ) {
    return this.brandService.getAllBrands(categorySlug, featured);
  }

  @Query(() => Brand, { nullable: true })
  brand(@Args('slug') slug: string) {
    return this.brandService.getBrandBySlug(slug);
  }

  @Mutation(() => Brand)
  createBrand(@Args('input') input: CreateBrandInput) {
    return this.brandService.createBrand(input);
  }

  @Mutation(() => Brand)
  updateBrand(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateBrandInput,
  ) {
    return this.brandService.updateBrand(id, input);
  }

  @Mutation(() => Brand)
  deactivateBrand(@Args('id', { type: () => Int }) id: number): Promise<Brand> {
    return this.brandService.updateBrandStatus(id, false);
  }

  @Mutation(() => Brand)
  activateBrand(@Args('id', { type: () => Int }) id: number): Promise<Brand> {
    return this.brandService.updateBrandStatus(id, true);
  }

  @Mutation(() => Boolean)
  deleteBrand(@Args('id', { type: () => Int }) id: number) {
    return this.brandService.deleteBrand(id);
  }
}
