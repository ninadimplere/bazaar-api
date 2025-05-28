import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSellerDto } from './sellers.dto';

@Injectable()
export class SellersService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateSeller(email: string, updateSellerDto: UpdateSellerDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: { seller: true },
    });

    if (!user || !user.seller) {
      throw new NotFoundException('Seller not found');
    }

    return this.prismaService.seller.update({
      where: { userId: user.id },
      data: {
        accountType: updateSellerDto.accountType,
        panNumber: updateSellerDto.panNumber,
        aadhaarNumber: updateSellerDto.aadhaarNumber,
        gstNumber: updateSellerDto.gstNumber,
        cinNumber: updateSellerDto.cinNumber,
        panDocumentUrl: updateSellerDto.panDocumentUrl,
        aadhaarDocumentUrl: updateSellerDto.aadhaarDocumentUrl,
        gstCertificateUrl: updateSellerDto.gstCertificateUrl,
        cinDocumentUrl: updateSellerDto.cinDocumentUrl,
        status: 'PENDING',
      },
    });
  }
}
