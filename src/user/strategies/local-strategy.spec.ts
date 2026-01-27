import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { LocalStrategy } from './local-strategy';

describe('Local Strategy', () => {
  let localStrategy: LocalStrategy;

  const mockPostgresAuthService = {
    getUser: jest.fn(),
  };

  const payload = {
    email: 'exemplo@provider.com',
    password: 'super-secret-password',
  };

  const resolvedValue = {
    name: 'Fulano',
    email: payload.email,
    password: '$2b$10$DdngwL4iglrnG0h4NaHkcOuYYxE4zRlYUlTkfS0TLhDMNqE.8xKIS', // Hash for 'super-secret-password'
    idUser: 12,
    birthDate: new Date(),
    photoPath: null,
    agreedWithTerms: true,
    isActive: true,
    accessLevel: 1,
    isEmailConfirmed: false,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        { provide: UserService, useValue: mockPostgresAuthService },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('it should validate incoming token', () => {
    expect(localStrategy).toBeDefined();
  });

  it('it should validate and return user object', async () => {
    mockPostgresAuthService.getUser.mockResolvedValue(resolvedValue);

    const result = await localStrategy.validate(
      payload.email,
      payload.password,
    );

    const { password, ...expectedResult } = resolvedValue;
    expect(result).toEqual(expectedResult);
  });

  it('it should throw UnauthorizedException if password is wrong', async () => {
    mockPostgresAuthService.getUser.mockResolvedValue(resolvedValue);
    const wrongPassword = 'super-secret-wrong-password';
    expect(
      localStrategy.validate(payload.email, wrongPassword),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('it should throw an UnauthorizedException if e-mail is not found', () => {
    mockPostgresAuthService.getUser.mockResolvedValue(null);
    expect(
      localStrategy.validate(payload.email, payload.password),
    ).rejects.toThrow(UnauthorizedException);
  });
});
