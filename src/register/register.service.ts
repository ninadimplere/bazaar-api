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
    const { email, password, role, profile } = dto;

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

      if (profile) {
        await this.prismaService.userProfile.create({
          data: {
            userId: createdUser.id,
            fullName: profile.fullName,
            phoneNumber: profile.phoneNumber,
            dateOfBirth: profile.dateOfBirth
              ? new Date(profile.dateOfBirth)
              : undefined,
            gender: profile.gender,
            profileImage: profile.profileImage,
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

  async registerSeller(dto: RegisterDto) {
    const { email, password, role, profile, fullName, phoneNumber } = dto;

    // Step 1: Ensure user exists
    let user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          email,
          password: password || '',
          role: [role || 'SELLER'],
        },
      });
    }

    // Step 2: Check if seller already exists for this userId
    const existingSeller = await this.prismaService.seller.findUnique({
      where: { userId: user.id },
    });
    if (existingSeller) {
      throw new ConflictException('Seller with this user already exists');
    }

    // Step 3: Create seller
    const createdSeller = await this.prismaService.seller.create({
      data: {
        userId: user.id,
        email,
        fullName,
        phoneNumber,
        status: 'PENDING',
      },
    });

    // Step 4: Create user profile if provided
    if (profile) {
      await this.prismaService.userProfile.create({
        data: {
          userId: user.id,
          fullName: profile.fullName || fullName,
          phoneNumber: profile.phoneNumber || phoneNumber,
          dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined,
          gender: profile.gender,
          profileImage: profile.profileImage
        }
      });
    }

    return {
      message: 'Seller registered successfully',
      sellerId: createdSeller.id,
    };
  }
}
