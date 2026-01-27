import { Module } from '@nestjs/common';
import { SuperbaseStorageService } from './superbase-storage.service';
import { SupabaseService } from './superbase.service';

@Module({
  providers: [SupabaseService, SuperbaseStorageService],
  exports: [SupabaseService, SuperbaseStorageService],
})
export class SupabaseModule {}
