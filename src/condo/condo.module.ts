import { Module } from '@nestjs/common';
import { CondoService } from './condo.service';
import { CondoController } from './condo.controller';

@Module({
  controllers: [CondoController],
  providers: [CondoService],
})
export class CondoModule {}
