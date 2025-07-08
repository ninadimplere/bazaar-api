import { Args, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { SpenderTypeService } from './spender-type.service';
import { SpenderType } from '@prisma/client';

@Resolver()
export class UserResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly spenderTypeService: SpenderTypeService,
  ) {}

  @Query(() => String, { description: 'Get a user\'s spender type' })
  async userSpenderType(@Args('userId') userId: string): Promise<string> {
    try {
      // First, trigger an update to ensure the spender type is current
      await this.spenderTypeService.updateUserSpenderType(userId);
      
      // Then retrieve the up-to-date value
      const spenderType = await this.usersService.getUserSpenderType(userId);
      return spenderType;
    } catch (error) {
      throw new Error(`Failed to get user spender type: ${error.message}`);
    }
  }
}
