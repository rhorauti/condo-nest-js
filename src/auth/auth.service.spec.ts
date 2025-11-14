import { Test, TestingModule } from '@nestjs/testing';
import { PostgresAuthService } from './postgres-auth.service';

describe('AuthService', () => {
  let service: PostgresAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostgresAuthService],
    }).compile();

    service = module.get<PostgresAuthService>(PostgresAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
