import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/postgres-client/client';
import { PrismaService } from '../../../prisma/postgres/prisma.service';

/**
 * Service responsible for managing User authentication and persistence
 * operations using the Postgres database via Prisma.
 */
@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Retrieves a list of users based on filter, pagination, and sorting parameters.
   * This method wraps Prisma's `findMany` allowing full flexibility.
   *
   * @param params - The query parameters object.
   * @param params.skip - (Optional) Number of records to skip (offset pagination).
   * @param params.take - (Optional) Number of records to return (limit).
   * @param params.cursor - (Optional) Cursor for cursor-based pagination.
   * @param params.where - (Optional) Filters to apply to the query.
   * @param params.orderBy - (Optional) Sorting criteria.
   * @param params.select - (Optional) Specific fields to return.
   *
   * @returns A promise that resolves to an array of User objects (or selected fields).
   *
   * @example
   * // Get the first 10 active users, sorted by newest
   * const users = await service.getUsers({
   * where: { isActive: true },
   * take: 10,
   * orderBy: { createdAt: 'desc' }
   * });
   */
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
    return await this.prismaService.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  /**
   * Retrieves a single user record based on unique criteria.
   *
   * @param params - The search parameters.
   * @param params.where - The unique identifier to find the user (e.g., id or email).
   * @param params.select - (Optional) Specific fields to return.
   *
   * @returns A promise that resolves to the User object or null if not found.
   *
   * @example
   * // Find a specific user by ID and select only their name
   * const user = await service.getUser({
   * where: { idUser: 123 },
   * select: { name: true }
   * });
   */
  async getUser(params: {
    where: Prisma.UserWhereUniqueInput;
    include?: Prisma.UserInclude;
    select?: Prisma.UserSelect;
  }) {
    const { where, include, select } = params;
    return this.prismaService.user.findUnique({
      where,
      ...(select ? { select } : {}),
      ...(include ? { include } : {}),
    });
  }

  /**
   * Creates a new user in the database.
   *
   * @remarks
   * This method automatically sets default system values:
   * - `accessLevel`: 1 (Standard User)
   * - `isActive`: true
   * - `photoPath`: null
   *
   * @param userDTO - The Data Transfer Object containing user registration data.
   * @returns The created User object.
   * @throws {Prisma.PrismaClientKnownRequestError} If email is duplicated (P2002).
   *
   * @example
   * const newUser = await service.createUser({
   * name: 'John Doe',
   * email: 'john@example.com',
   * password: 'hashedPassword123',
   * birthDate: new Date('1990-01-01'),
   * agreedWithTerms: true
   * });
   */
  async createUser(user: Prisma.UserCreateInput) {
    return await this.prismaService.user.create({
      data: user,
    });
  }

  /**
   * Updates an existing user record.
   *
   * @param params - The update parameters.
   * @param params.where - The unique identifier of the user to update.
   * @param params.data - The fields to update.
   *
   * @returns The updated User object.
   *
   * @example
   * // Update user 50 to confirm their email
   * const updated = await service.updateUser({
   * where: { idUser: 50 },
   * });
   */
  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
    include?: Prisma.UserInclude;
  }) {
    const { where, data, include } = params;
    return await this.prismaService.user.update({
      where,
      data,
      include,
    });
  }

  /**
   * Permanently deletes a user from the database.
   *
   * @param idUser - The unique ID of the user to delete.
   * @returns The deleted User object.
   *
   * @example
   * await service.deleteUser(50);
   */
  async deleteUser(idUser: number) {
    return await this.prismaService.user.delete({ where: { idUser: idUser } });
  }
}
