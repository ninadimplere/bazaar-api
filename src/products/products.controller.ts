// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Query,
//   Delete,
//   Put,
// } from '@nestjs/common';
// import { ProductsService } from './products.service';
// import { CreateProductDto } from './dto/create-product.dto';
// import { ProductStatus } from '@prisma/client';

// @Controller('products')
// export class ProductsController {
//   constructor(private readonly productsService: ProductsService) {}

//   @Get()
//   async getFilteredProducts(
//     @Query('searchString') searchString?: string,
//     @Query('priceMin') priceMin?: string,
//     @Query('priceMax') priceMax?: string,
//     @Query('productStatus') productStatus?: ProductStatus,
//     @Query('pageSize') pageSize?: string,
//     @Query('pageOffset') pageOffset?: string,
//     @Query('isLowStock') isLowStock?: string,
//     @Query('isOutOfStock') isOutOfStock?: string,
//   ) {
//     return this.productsService.getFilteredProducts({
//       searchString,
//       priceMin: priceMin ? parseFloat(priceMin) : undefined,
//       priceMax: priceMax ? parseFloat(priceMax) : undefined,
//       productStatus,
//       pageSize: pageSize ? parseInt(pageSize, 10) : 10,
//       pageOffset: pageOffset ? parseInt(pageOffset, 10) : 0,
//       isLowStock,
//       isOutOfStock,
//     });
//   }

//   @Get('counts')
//   getCounts() {
//     return this.productsService.getProductCounts();
//   }

//   @Get(':id')
//   async getProductById(@Param('id') id: number) {
//     return this.productsService.getProductById(id);
//   }

//   @Get('category/:id')
//   async getProductByCategoryId(@Param('id') id: number) {
//     return this.productsService.getProductByCategoryId(id);
//   }

//   @Delete(':id')
//   async deleteProduct(@Param('id') id: number) {
//     return this.productsService.deleteProduct(id);
//   }

//   @Put(':id')
//   async updateProduct(
//     @Param('id') id: number,
//     @Body() updateData: Partial<CreateProductDto>,
//   ) {
//     return this.productsService.updateProduct(id, updateData);
//   }

//   @Post('upload')
//   async uploadProduct(@Body() createProductDto: CreateProductDto) {
//     return this.productsService.createProduct(createProductDto);
//   }

//   @Post('category')
//   async createCategory(@Body() body: { name: string; slug?: string; parentId?: number }) {
//     return this.productsService.createCategory(body);
//   }

//   @Post('brand')
//   async createBrand(@Body() body: { name: string; slug: string }) {
//     return this.productsService.createBrand(body);
//   }
// }
