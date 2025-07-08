import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserProfileDto } from '../register/register.dto';
import { SpenderTypeService } from './spender-type.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly spenderTypeService: SpenderTypeService,
  ) {}

  @Post('profile')
  async updateProfile(@Body() dto: { email: string; profile: UserProfileDto }) {
    return this.usersService.updateProfile(dto.email, dto.profile);
  }

  @Get('by-email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Get(':userId/spender-type')
  async getUserSpenderType(@Param('userId') userId: string) {
    // First update the spender type to ensure it's current
    await this.spenderTypeService.updateUserSpenderType(userId);
    
    // Then return the up-to-date value
    return {
      userId,
      spenderType: await this.usersService.getUserSpenderType(userId)
    };
  }
}
