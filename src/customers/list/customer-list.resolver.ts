import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { CustomerSummary } from './customer-list.dto';
import { CustomersService } from './customer-list.service';
import { CustomerTag } from 'common/enums/customer-tag.enum';

@Resolver(() => CustomerSummary)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @Query(() => [CustomerSummary])
  async customersBySeller(
    @Args('sellerId') sellerId: string,
    @Args('search', { nullable: true }) search?: string,
    @Args('limit', { type: () => Int, nullable: true }) limit = 10,
    @Args('offset', { type: () => Int, nullable: true }) offset = 0,
    @Args('sortBy', { nullable: true })
    sortBy: 'orderCount' | 'totalSpend' | 'lastOrderDate' = 'orderCount',
    @Args('sortOrder', { nullable: true }) sortOrder: 'asc' | 'desc' = 'desc',
    @Args('tag', { type: () => CustomerTag, nullable: true }) tag?: CustomerTag,
  ) {
    return this.customersService.getCustomersBySeller(
      sellerId,
      search,
      limit,
      offset,
      sortBy,
      sortOrder,
      tag,
    );
  }
}
