import { Injectable } from '@nestjs/common';
import { Post, Prisma, PrismaClient } from '@prisma/postgres-client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaClient) {}

  async getPosts(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.PostWhereUniqueInput;
      where?: Prisma.PostWhereInput;
      orderBy?: Prisma.PostOrderByWithRelationInput;
      select?: Prisma.PostSelect;
    } = {},
  ) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return await this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async getPost(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.PostWhereUniqueInput;
      where?: Prisma.PostWhereUniqueInput;
      orderBy?: Prisma.PostOrderByWithRelationInput;
      select?: Prisma.PostSelect;
    } = {},
  ) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return await this.prisma.post.findFirst({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createUser(post: Post) {
    return await this.prisma.post.create({
      data: post,
    });
  }

  async updateUser(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }) {
    const { where, data } = params;
    return await this.prisma.post.update({ where: where, data: data });
  }

  async deleteUser(idPost: number) {
    return await this.prisma.post.delete({ where: { idPost: idPost } });
  }
}
