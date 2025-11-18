import { Injectable } from '@nestjs/common';
import { PostgresService } from '../../prisma/postgres/postgres.service';
import { Prisma } from '@prisma/postgres-client/client';
import { SignUpDTO } from './dto/signup.dto';

@Injectable()
export class PostgresAuthService {
  constructor(private pg: PostgresService) {}

  async getUsers(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.UserWhereUniqueInput;
      where?: Prisma.UserWhereInput;
      orderBy?: Prisma.UserOrderByWithRelationInput;
      select?: Prisma.UserSelect;
    } = {},
  ) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return await this.pg.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async getUser(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.UserWhereUniqueInput;
      where?: Prisma.UserWhereUniqueInput;
      orderBy?: Prisma.UserOrderByWithRelationInput;
      select?: Prisma.UserSelect;
    } = {},
  ) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return await this.pg.user.findFirst({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createUser(userDTO: SignUpDTO) {
    const userToBeCreated: Prisma.UserCreateInput = {
      ...userDTO,
      accessLevel: 1,
      isActive: true,
      isEmailConfirmed: false,
      photoPath: null,
    };
    return await this.pg.user.create({
      data: userToBeCreated,
    });
  }

  async deleteUser(idUser: number) {
    return await this.pg.user.delete({ where: { idUser: idUser } });
  }
}
