// src/address/address.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { CreateAddressDto } from './address.dto';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(@Body() dto: CreateAddressDto) {
    return this.addressService.createAddress(dto);
  }
}
