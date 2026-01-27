import { Test, TestingModule } from '@nestjs/testing';
import { CondoController } from './condo.controller';
import { CondoService } from './condo.service';

describe('CondoController', () => {
  let controller: CondoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CondoController],
      providers: [CondoService],
    }).compile();

    controller = module.get<CondoController>(CondoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
