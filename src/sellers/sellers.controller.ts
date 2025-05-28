import { Controller, Put, Body, Param } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { UpdateSellerDto } from './sellers.dto';

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Put('update/:email')
  async updateSeller(
    @Param('email') email: string,
    @Body() updateSellerDto: UpdateSellerDto,
  ) {
    return this.sellersService.updateSeller(email, updateSellerDto);
  }
}
