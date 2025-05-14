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
    const { email, password, role } = dto;

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      // const hashedPassword = await bcrypt.hash(password, 10);

      const createdUser = await this.prismaService.user.create({
        data: {
          email,
          password: password,
          role: [role],
        },
      });

      return {
        message: 'User registered successfully',
        userId: createdUser.id,
      };
    }

    if (existingUser.role.includes(role)) {
      throw new ConflictException(`User already registered as ${role}`);
    }

    await this.prismaService.user.update({
      where: { email },
      data: {
        role: {
          set: [...existingUser.role, role],
        },
      },
    });

    return { message: `Role ${role} added to user`, userId: existingUser.id };
  }
}
