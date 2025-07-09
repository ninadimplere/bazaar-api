import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { UserProfileDto } from '../register/register.dto';
import { SpenderType } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  private users = [
    {
      id: 1,
      username: 'john',
      password: bcrypt.hashSync('changeme', 10),
    },
  ];

  async findOneByUsername(username: string) {
    return this.users.find((user) => user.username === username);
  }

  async updateProfile(email: string, profile: UserProfileDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: { UserProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.UserProfile) {
      // Update existing profile
      return this.prismaService.userProfile.update({
        where: { userId: user.id },
        data: {
          fullName: profile.fullName,
          phoneNumber: profile.phoneNumber,
          dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined,
          gender: profile.gender,
          profileImage: profile.profileImage,
        },
      });
    } else {
      // Create new profile
      return this.prismaService.userProfile.create({
        data: {
          userId: user.id,
          fullName: profile.fullName,
          phoneNumber: profile.phoneNumber,
          dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined,
          gender: profile.gender,
          profileImage: profile.profileImage,
        },
      });
    }
  }

  async getUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async getUserSpenderType(userId: string): Promise<SpenderType> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { spenderType: true },
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    return user.spenderType;
  }

  async updateUserSpenderType(userId: string, spenderType: SpenderType): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { spenderType },
    });
  }
}
