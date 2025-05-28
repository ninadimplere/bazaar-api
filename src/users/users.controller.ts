import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserProfileDto } from '../register/register.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('profile')
  async updateProfile(@Body() dto: { email: string; profile: UserProfileDto }) {
    return this.usersService.updateProfile(dto.email, dto.profile);
  }

  @Get('by-email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }
}
