// import { UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { Test, TestingModule } from '@nestjs/testing';
// import { JwtStrategy } from './jwt-strategy';

// describe('Jwt Strategy', () => {
//   let configService: ConfigService;
//   let strategy: JwtStrategy;

//   const mockConfigService = {
//     get: jest.fn((key: string) => {
//       if (key === 'JWT_SECRET_KEY') {
//         return 'test-secret';
//       }
//       return null;
//     }),
//   };

//   beforeEach(async () => {
//     jest.clearAllMocks();
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         JwtStrategy,
//         { provide: ConfigService, useValue: mockConfigService },
//       ],
//     }).compile();

//     configService = module.get<ConfigService>(ConfigService);
//     strategy = module.get<JwtStrategy>(JwtStrategy);
//   });

//   it('it should validate incoming token', () => {
//     expect(strategy).toBeDefined();
//   });

//   it('it should validate and return user payload', () => {
//     const payload = { idUser: 1, email: 'exemplo@provider.com' };
//     const result = strategy.validate(payload);
//     expect(result).toEqual(payload);
//   });

//   it('it should throw UnauthorizedException if JWT_SECRET_KEY is missing', async () => {
//     mockConfigService.get.mockReturnValueOnce(null);
//     await expect(
//       Test.createTestingModule({
//         providers: [
//           JwtStrategy,
//           { provide: ConfigService, useValue: mockConfigService },
//         ],
//       }).compile(),
//     ).rejects.toThrow(UnauthorizedException);
//   });
// });
