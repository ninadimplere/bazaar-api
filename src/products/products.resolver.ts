import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './products.entity';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  @Query(() => [Product])
  async products() {
    return this.productsService.fetchAllProducts();
  }

  @Query(() => Product)
  async product(@Args('id', { type: () => Int }) id: number) {
    return this.productsService.getProductById(id);
  }
}