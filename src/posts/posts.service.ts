import { Injectable } from '@nestjs/common';
import { Post, Prisma, PrismaClient } from '@prisma/postgres-client';

type PostWithUserAndScore = Post & {
  userName: string;
  desc_score: number;
  user_score: number;
  type_score: number;
};

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

  async searchPostsFuzzyFeed(params: {
    keyword: string;
    cursorId?: number | null;
    limit?: number;
  }): Promise<{ items: PostWithUserAndScore[]; nextCursorId: number | null }> {
    const { keyword, cursorId = null, limit = 10 } = params;

    if (!keyword || !keyword.trim()) {
      return { items: [], nextCursorId: null };
    }

    const search = keyword.trim();

    // Opcional: threshold mais alto para reduzir ruído
    // Ex.: 0.35 ou 0.4. Se não quiser mexer global,
    // dá pra usar `set_limit()` na query.
    const items = await this.prisma.$queryRaw<PostWithUserAndScore[]>`
      SELECT
        p.*,
        u."name" AS "userName",
        -- scores individuais (sem afetar o plano de execução)
        similarity(p."description", ${search}) AS "desc_score",
        similarity(u."name",        ${search}) AS "user_score",
        similarity(
          CASE p."type"
            WHEN 0 THEN 'Dúvidas & Sugestões'
            WHEN 1 THEN 'Avisos'
            WHEN 2 THEN 'Reclamações'
            WHEN 3 THEN 'Recomendações'
            WHEN 4 THEN 'Desapegos'
            WHEN 5 THEN 'Outros'
          END,
          ${search}
        ) AS "type_score"
      FROM "Post" p
      JOIN "User" u ON u."idUser" = p."idUser"
      WHERE
        -- filtro principal usando texto combinado para bater no índice GIN
        p."search_text" % ${search}
        -- paginação por cursor
        AND (${cursorId}::int IS NULL OR p."idPost" < ${cursorId})
      ORDER BY
        -- ordena por distância trigram (usa índice com <->)
        p."search_text" <-> ${search} ASC,
        p."idPost" DESC
      LIMIT ${limit};
    `;

    const nextCursorId =
      items.length === limit ? items[items.length - 1].idPost : null;

    return { items, nextCursorId };
  }

  async getPost(params: {
    where: Prisma.PostWhereUniqueInput;
    select?: Prisma.PostSelect;
  }) {
    const { where, select } = params;

    return this.prisma.post.findUnique({
      where,
      select,
    });
  }

  async createPost(post: Prisma.PostCreateInput) {
    return await this.prisma.post.create({
      data: post,
    });
  }

  async updatePost(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }) {
    const { where, data } = params;
    return await this.prisma.post.update({ where: where, data: data });
  }

  async deletePost(idPost: number) {
    return await this.prisma.post.delete({ where: { idPost: idPost } });
  }
}
