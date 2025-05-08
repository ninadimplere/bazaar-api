import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
  ) {}

  async validateUser(): Promise<any> {
    return this.prismaService.user.count({});
  }
}
