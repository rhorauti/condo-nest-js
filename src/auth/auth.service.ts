import { Injectable } from '@nestjs/common';
import { PostgresService } from '../../prisma/postgres/postgres.service';
import { User } from '@prisma/postgres-client';
import { MongoService } from '../../prisma/mongodb/mongo.service';

@Injectable()
export class AuthService {
  constructor(
    private pg: PostgresService,
    private mongo: MongoService,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.pg.user.findMany();
  }

  async getUsersMongo() {
    return await this.mongo.message.findMany();
  }
}
