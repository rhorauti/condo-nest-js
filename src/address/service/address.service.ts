import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/postgres-client/client';
import { PrismaService } from '../../../prisma/postgres/prisma.service';

/**
 * Service responsible for managing User authentication and persistence
 * operations using the Postgres database via Prisma.
 */
@Injectable()
export class AddressService {
  constructor(private prismaService: PrismaService) {}

  async onGetAddresses(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.AddressWhereUniqueInput;
      where?: Prisma.AddressWhereInput;
      orderBy?: Prisma.AddressOrderByWithRelationInput;
      select?: Prisma.AddressSelect;
    } = {},
  ) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return await this.prismaService.address.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async onGetAddress(params: {
    where: Prisma.AddressWhereUniqueInput;
    include?: Prisma.AddressInclude;
    select?: Prisma.AddressSelect;
  }) {
    const { where, include, select } = params;
    return this.prismaService.address.findUnique({
      where,
      ...(select ? { select } : {}),
      ...(include ? { include } : {}),
    });
  }

  async onCreateAddress(user: Prisma.AddressCreateInput) {
    return await this.prismaService.address.create({
      data: user,
    });
  }

  async onUpdateAddress(params: {
    where: Prisma.AddressWhereUniqueInput;
    data: Prisma.AddressUpdateInput;
    include?: Prisma.AddressInclude;
  }) {
    const { where, data, include } = params;
    return await this.prismaService.address.update({
      where,
      data,
      include,
    });
  }

  async onDeleteAddress(idAddress: number) {
    return await this.prismaService.address.delete({
      where: { idAddress: idAddress },
    });
  }
}
