import * as bcrypt from 'bcrypt';
import { RegisterDto } from './register.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
  ) {}

  async registerUser(dto: RegisterDto) {
    const { email, password, role, accountType } = dto;

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const createdUser = await this.prismaService.user.create({
        data: {
          email,
          password: hashedPassword,
          role: [role],
        },
      });

      if (role === 'SELLER') {
        await this.prismaService.seller.create({
          data: {
            userId: createdUser.id,
            accountType,
            status: 'PENDING',
            approvedBy: null,
          },
        });
      }

      return {
        message: 'User registered successfully',
        userId: createdUser.id,
      };
    }

    if (existingUser.role.includes(role)) {
      throw new ConflictException(`User already registered as ${role}`);
    }

    const updatedUser = await this.prismaService.user.update({
      where: { email },
      data: {
        role: {
          set: [...existingUser.role, role],
        },
      },
    });

    if (role === 'SELLER') {
      const existingSeller = await this.prismaService.seller.findUnique({
        where: { userId: existingUser.id },
      });

      if (existingSeller) {
        throw new ConflictException(
          'Seller profile already exists for this user',
        );
      }

      await this.prismaService.seller.create({
        data: {
          userId: existingUser.id,
          accountType,
          status: 'PENDING',
          approvedBy: null,
        },
      });
    }

    return { message: `Role ${role} added to user`, userId: existingUser.id };
  }
}
