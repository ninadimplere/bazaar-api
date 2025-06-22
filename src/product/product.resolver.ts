import { Resolver, Query, Mutation, Args, Int, Float } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { CreateProductInput, UpdateProductInput } from './dto/product.input';
import { Product } from './dto/product.model';
import { ProductResponse, ProductListResponse } from './dto/product.response';
import { ProductStatus } from './enum/product-status.enum';
import { CountResponse } from './dto/product-count.response';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => ProductResponse)
  createProduct(@Args('data') data: CreateProductInput) {
    return this.productService.createProduct(data);
  }

  @Query(() => ProductResponse)
  product(@Args('id', { type: () => Int }) id: number) {
    return this.productService.getProductById(id);
  }

  @Query(() => ProductListResponse)
  products(
    @Args('categoryId', { type: () => Int, nullable: true })
    categoryId?: number,
    @Args('brandId', { type: () => Int, nullable: true }) brandId?: number,
    @Args('minPrice', { type: () => Float, nullable: true }) minPrice?: number,
    @Args('maxPrice', { type: () => Float, nullable: true }) maxPrice?: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    return this.productService.fetchAllProducts({
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      search,
    });
  }

  @Mutation(() => ProductResponse)
  updateProduct(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateProductInput,
  ) {
    return this.productService.updateProduct(id, data);
  }

  @Query(() => CountResponse)
  productCount(
    @Args('categoryId', { type: () => Int, nullable: true })
    categoryId?: number,
    @Args('brandId', { type: () => Int, nullable: true }) brandId?: number,
    @Args('productStatus', { type: () => ProductStatus, nullable: true })
    productStatus?: ProductStatus,
    @Args('sellerId', { type: () => String, nullable: true }) sellerId?: string,
  ) {
    return this.productService.countProducts({
      categoryId,
      brandId,
      productStatus,
      sellerId,
    });
  }
}
