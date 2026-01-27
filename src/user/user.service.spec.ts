import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, User } from '@prisma/postgres-client';
import { PrismaService } from '../../prisma/postgres/prisma.service';
import { UserService } from './user.service';

const createMockPrismaMethod = <T = any>() => jest.fn<Promise<T>, any[]>();

const mockPrismaService = {
  user: {
    findMany: createMockPrismaMethod<User[]>(),
    findFirst: createMockPrismaMethod<User | null>(),
    create: createMockPrismaMethod<User>(),
    update: createMockPrismaMethod<User>(),
    delete: createMockPrismaMethod<User>(),
  },
};

let service: UserService;

beforeEach(async () => {
  jest.clearAllMocks();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UserService,
      { provide: PrismaService, useValue: mockPrismaService },
    ],
  }).compile();
  service = module.get<UserService>(UserService);
});

const mockUserDTO = {
  name: 'Fulano Silva',
  birthDate: new Date('2000-12-01T02:00:00.000Z'),
  email: 'teste@exemplo.com.br',
  password: 'Teste123!',
  agreedWithTerms: true,
};

const mockUsers: User[] = [
  {
    idUser: 1,
    name: 'User 1',
    email: 'user1@test.com',
    password: 'alsçkdsaçlkdj23!#',
    birthDate: new Date('2000-12-01T02:00:00.000Z'),
    photoPath: null,
    agreedWithTerms: true,
    isActive: true,
    accessLevel: 1,
    isEmailConfirmed: false,
    createdAt: new Date(),
  },
  {
    idUser: 2,
    name: 'User 2',
    email: 'user2@test.com',
    password: 'alsçkdsaçlkdj23!#',
    birthDate: new Date('2000-12-01T02:00:00.000Z'),
    photoPath: null,
    agreedWithTerms: true,
    isActive: true,
    accessLevel: 1,
    isEmailConfirmed: false,
    createdAt: new Date(),
  },
];

const mockUser: User = {
  idUser: 1,
  name: 'User 1',
  email: 'user1@test.com',
  password: 'alsçkdsaçlkdj23!#',
  birthDate: new Date('2000-12-01T02:00:00.000Z'),
  photoPath: null,
  agreedWithTerms: true,
  isActive: true,
  accessLevel: 1,
  isEmailConfirmed: false,
  createdAt: new Date(),
};

describe('Postgres Auth Service', () => {
  it('it should be defined', () => {
    expect(service).toBeDefined();
  });

  it('it should create new User', async () => {
    const mockUser: User = {
      idUser: 1,
      ...mockUserDTO,
      accessLevel: 1,
      isActive: false,
      isEmailConfirmed: true,
      photoPath: null,
      createdAt: new Date(),
    };

    mockPrismaService.user.create.mockResolvedValue(mockUser);

    const result = await service.createUser(mockUserDTO);
    expect(mockPrismaService.user.create).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.user.create).toHaveBeenCalledWith({
      data: {
        ...mockUserDTO,
        accessLevel: 1,
        isActive: true,
        isEmailConfirmed: false,
        photoPath: null,
      },
    });
    expect(result).toEqual(mockUser);
  });

  it('it bubble up Prisma errors', async () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      'Bubble up this Prisma error',
      { code: 'P2002', clientVersion: '0.0.0' },
    );

    mockPrismaService.user.create.mockRejectedValue(prismaError);

    await expect(service.createUser(mockUserDTO)).rejects.toThrow(
      Prisma.PrismaClientKnownRequestError,
    );
  });

  it('it should get all users without params', async () => {
    mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

    const result = await service.getUsers();

    expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUsers);
    expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
      skip: undefined,
      take: undefined,
      cursor: undefined,
      where: undefined,
      orderBy: undefined,
      select: undefined,
    });
  });

  it('it should get all users with all params', async () => {
    mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

    const result = await service.getUsers({
      skip: 1,
      take: 10,
      cursor: { idUser: 50 },
      where: { idUser: 10 },
      orderBy: { idUser: 'desc' },
      select: { idUser: true, name: true },
    });

    expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUsers);
    expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
      skip: 1,
      take: 10,
      cursor: { idUser: 50 },
      where: { idUser: 10 },
      orderBy: { idUser: 'desc' },
      select: { idUser: true, name: true },
    });
  });

  it('it should get all users with pagination params', async () => {
    mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

    const result = await service.getUsers({ skip: 10, take: 8 });

    expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUsers);
    expect(mockPrismaService.user.findMany).toHaveBeenLastCalledWith({
      skip: 10,
      take: 8,
      cursor: undefined,
      where: undefined,
      orderBy: undefined,
      select: undefined,
    });
  });

  it('it should get user with no params', async () => {
    mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

    const result = await service.getUser({
      where: undefined,
      skip: undefined,
      take: undefined,
      cursor: undefined,
      orderBy: undefined,
      select: undefined,
    });

    expect(mockPrismaService.user.findFirst).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUser);
    expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
      where: undefined,
      skip: undefined,
      take: undefined,
      cursor: undefined,
      orderBy: undefined,
      select: undefined,
    });
  });

  it('it should get user with all params', async () => {
    mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

    const result = await service.getUser({
      where: { idUser: 50 },
      skip: 1,
      take: 10,
      cursor: { idUser: 50 },
      orderBy: { idUser: 'desc' },
      select: { idUser: true, name: true },
    });

    expect(mockPrismaService.user.findFirst).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUser);
    expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
      where: { idUser: 50 },
      skip: 1,
      take: 10,
      cursor: { idUser: 50 },
      orderBy: { idUser: 'desc' },
      select: { idUser: true, name: true },
    });
  });

  it('it should update user with new data and where param', async () => {
    mockPrismaService.user.update.mockResolvedValue(mockUser);

    const result = await service.updateUser({
      where: { idUser: 50 },
      data: mockUser,
    });

    expect(mockPrismaService.user.update).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUser);
    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { idUser: 50 },
      data: mockUser,
    });
  });

  it('it should delete user with where param', async () => {
    mockPrismaService.user.delete.mockResolvedValue(mockUser);
    const result = await service.deleteUser(50);
    expect(mockPrismaService.user.delete).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUser);
    expect(mockPrismaService.user.delete).toHaveBeenLastCalledWith({
      where: { idUser: 50 },
      skip: undefined,
      take: undefined,
      cursor: undefined,
      orderBy: undefined,
      select: undefined,
    });
  });
});
