import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/postgres-client/client';
import { PrismaService } from '../../prisma/postgres/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prismaService: PrismaService) {}

  async getRoles(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.RoleWhereUniqueInput;
      where?: Prisma.RoleWhereInput;
      orderBy?: Prisma.RoleOrderByWithRelationInput;
      select?: Prisma.RoleSelect;
    } = {},
  ) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return await this.prismaService.role.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async getRole(params: {
    where: Prisma.RoleWhereUniqueInput;
    select?: Prisma.RoleSelect;
  }) {
    const { where, select } = params;
    return await this.prismaService.role.findUnique({
      where,
      select,
    });
  }

  async createRole(user: Prisma.RoleCreateInput) {
    return await this.prismaService.role.create({
      data: user,
    });
  }

  async updateRole(params: {
    where: Prisma.RoleWhereUniqueInput;
    data: Prisma.RoleUpdateInput;
  }) {
    const { where, data } = params;
    return await this.prismaService.role.update({ where: where, data: data });
  }

  async deleteRole(idRole: number) {
    return await this.prismaService.role.delete({ where: { idRole: idRole } });
  }
}
