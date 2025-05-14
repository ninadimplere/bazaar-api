import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './address.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createAddress(dto: CreateAddressDto) {
    try {
      await this.prisma.address.create({
        data: {
          addressLine1: dto.addressLine1,
          addressLine2: dto.addressLine2,
          city: dto.city,
          state: dto.state,
          postalCode: dto.postalCode,
          country: dto.country,
          userId: dto.userId,
        },
      });

      return {
        success: true,
        message: 'Address created successfully',
      };
    } catch (error) {
      this.logger.error('Error creating address:', error);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return {
            success: false,
            message: 'Address already exists for this user',
          };
        }

        if (error.code === 'P2003') {
          return {
            success: false,
            message: 'User does not exist',
          };
        }
      }

      return {
        success: false,
        message: 'An unexpected error occurred while creating the address',
      };
    }
  }
}
