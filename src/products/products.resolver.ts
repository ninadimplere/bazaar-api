import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './products.entity';
import { FilterProductsInput } from './dto/filter-products.input';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  @Query(() => [Product])
  async products(
    @Args('filter', { nullable: true }) filter: FilterProductsInput,
  ) {
    return this.productsService.getFilteredProducts(filter || {});
  }

  @Query(() => Product)
  async product(@Args('id', { type: () => Int }) id: number) {
    return this.productsService.getProductById(id);
  }
}
