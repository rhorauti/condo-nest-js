import { Test, TestingModule } from '@nestjs/testing';
import { CondoService } from './condo.service';

describe('CondoService', () => {
  let service: CondoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CondoService],
    }).compile();

    service = module.get<CondoService>(CondoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
