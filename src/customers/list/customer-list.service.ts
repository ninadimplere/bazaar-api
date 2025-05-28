// Route through Product Table, keeping this till development is complete
//
// >`
//   SELECT
//     u.id AS "customerId",
//     up."fullName" AS name,
//     u.email,
//     COUNT(DISTINCT o.id)::int AS "orderCount",
//     SUM(op.quantity * p."displayPrice") AS "totalSpend",
//     MAX(o."createdAt") AS "lastOrderDate",
//     addr."addressLine1",
//     addr."city",
//     addr."state",
//     addr."postalCode",
//     addr."country"
//   FROM "Order" o
//   JOIN "OrderProduct" op ON o.id = op."orderId"
//   JOIN "Product" p ON op."productId" = p.id
//   JOIN "User" u ON o."userId" = u.id
//   LEFT JOIN "UserProfile" up ON up."userId" = u.id
//   LEFT JOIN LATERAL (
//     SELECT *
//     FROM "Address" a
//     WHERE a."userId" = u.id
//     ORDER BY a."createdAt" DESC
//     LIMIT 1
//   ) addr ON true
//   WHERE p."sellerId" = ${sellerId}
//   ${formattedSearch ? Prisma.sql`AND (LOWER(u.email) LIKE ${formattedSearch} OR LOWER(up."fullName") LIKE ${formattedSearch})` : Prisma.empty}
//   GROUP BY u.id, up."fullName", u.email, addr."addressLine1", addr."city", addr."state", addr."postalCode", addr."country"
//   ORDER BY ${Prisma.raw(`"${sortBy}"`)} ${Prisma.raw(sortOrder)}
//   LIMIT ${Prisma.raw(String(limit))}
//   OFFSET ${Prisma.raw(String(offset))};
// `;

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CustomerTag } from 'common/enums/customer-tag.enum';

interface RawCustomerRow {
  customerId: string;
  name: string | null;
  email: string | null;
  number: string | null;
  orderCount: number;
  totalSpend: number | null;
  lastOrderDate: string | null;
  addressLine1: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  memberSince: string;
  tag: string | null;
}

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async getCustomersBySeller(
    sellerId: string,
    search?: string,
    limit = 10,
    offset = 0,
    sortBy?: keyof RawCustomerRow,
    sortOrder: 'asc' | 'desc' = 'desc',
    customerTag?: CustomerTag,
    startDate?: string,
    endDate?: string,
  ) {
    const formattedSearch = this.getFormattedSearch(search);

    const rawResults = await this.queryCustomersFromDb(
      sellerId,
      formattedSearch,
      limit,
      offset,
      sortOrder,
      sortBy,
      customerTag,
      startDate,
      endDate,
    );

    return rawResults
      .map((row) => this.mapCustomerRow(row))
      .filter((c) => !customerTag || c.tag === customerTag);
  }

  private getFormattedSearch(search?: string): string | null {
    return search ? `%${search.toLowerCase()}%` : null;
  }

  private async queryCustomersFromDb(
    sellerId: string,
    formattedSearch: string | null,
    limit: number,
    offset: number,
    sortOrder: 'asc' | 'desc',
    sortBy?: keyof RawCustomerRow,
    customerTag?: CustomerTag,
    startDate?: string,
    endDate?: string,
  ) {
    const havingConditions: Prisma.Sql[] = [];

    if (customerTag) {
      switch (customerTag) {
        case CustomerTag.NEW:
          havingConditions.push(Prisma.sql`COUNT(DISTINCT o.id) = 1`);
          break;
        case CustomerTag.HIGH_SPENDER:
          havingConditions.push(Prisma.sql`COUNT(DISTINCT o.id) > 5`);
          havingConditions.push(
            Prisma.sql`SUM(op.quantity * p."displayPrice") > 5000`,
          );
          break;
        case CustomerTag.FREQUENT:
          havingConditions.push(Prisma.sql`COUNT(DISTINCT o.id) > 5`);
          break;
        case CustomerTag.ONE_TIME:
          havingConditions.push(
            Prisma.sql`COUNT(DISTINCT o.id) > 1`,
            Prisma.sql`NOT (COUNT(DISTINCT o.id) > 5 OR SUM(op.quantity * p."displayPrice") > 5000)`,
          );
          break;
      }
    }

    if (startDate) {
      havingConditions.push(
        Prisma.sql`MAX(o."createdAt") >= ${new Date(startDate)}`,
      );
    }
    if (endDate) {
      havingConditions.push(
        Prisma.sql`MAX(o."createdAt") <= ${new Date(endDate)}`,
      );
    }

    const havingClause: Prisma.Sql =
      havingConditions.length > 0
        ? Prisma.sql`HAVING ${Prisma.join(havingConditions, ` AND `)}`
        : Prisma.empty;

    return this.prisma.$queryRaw<RawCustomerRow[]>`
      SELECT
        u.id AS "customerId",
        up."fullName" AS name,
        u.email,
        up."phoneNumber" AS number,
        up."createdAt" AS "memberSince",
        COUNT(DISTINCT o.id)::int AS "orderCount",
        SUM(op.quantity * p."displayPrice") AS "totalSpend",
        MAX(o."createdAt") AS "lastOrderDate",
        addr."addressLine1",
        addr."city",
        addr."state",
        addr."postalCode",
        addr."country"
      FROM "SellerOrder" so
      JOIN "Order" o ON so."orderId" = o.id
      JOIN "OrderProduct" op ON op."orderId" = o.id AND op."sellerOrderId" = so.id
      JOIN "Product" p ON op."productId" = p.id
      JOIN "User" u ON o."userId" = u.id
      LEFT JOIN "UserProfile" up ON up."userId" = u.id
      LEFT JOIN LATERAL (
        SELECT *
        FROM "Address" a
        WHERE a."userId" = u.id
        ORDER BY a."createdAt" DESC
        LIMIT 1
      ) addr ON true
      WHERE so."sellerId" = ${sellerId}
      ${
        formattedSearch
          ? Prisma.sql`AND (LOWER(u.email) LIKE ${formattedSearch} OR LOWER(up."fullName") LIKE ${formattedSearch})`
          : Prisma.empty
      }
      GROUP BY u.id, up."fullName", up."phoneNumber", up."createdAt", u.email, addr."addressLine1", addr."city", addr."state", addr."postalCode", addr."country"
      ${havingClause}
      ORDER BY ${Prisma.raw(`"${sortBy}"`)} ${Prisma.raw(sortOrder)} NULLS LAST
      LIMIT ${Prisma.raw(String(limit))}
      OFFSET ${Prisma.raw(String(offset))};
    `;
  }

  private mapCustomerRow(row: RawCustomerRow, filteredTag?: CustomerTag) {
    const orderCount = Number(row.orderCount);
    const totalSpend = row.totalSpend !== null ? Number(row.totalSpend) : 0;

    return {
      customerId: row.customerId,
      name: row.name ?? '',
      email: row.email ?? '',
      number: row.number ?? '',
      orderCount,
      totalSpend,
      lastOrderDate: row.lastOrderDate
        ? new Date(row.lastOrderDate).toISOString()
        : null,
      memberSince: new Date(row.memberSince).toISOString(),
      address: {
        addressLine1: row.addressLine1,
        city: row.city,
        state: row.state,
        postalCode: row.postalCode,
        country: row.country,
      },
      tag: filteredTag ?? this.determineCustomerTag(orderCount, totalSpend),
    };
  }

  private determineCustomerTag(orderCount: number, totalSpend: number): string {
    if (orderCount === 1) {
      return CustomerTag.NEW;
    } else if (orderCount > 5 && totalSpend > 5000) {
      return CustomerTag.HIGH_SPENDER;
    } else if (orderCount > 5) {
      return CustomerTag.FREQUENT;
    } else {
      return CustomerTag.ONE_TIME;
    }
  }
}
