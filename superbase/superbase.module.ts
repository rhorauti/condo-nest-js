import { Module } from '@nestjs/common';
import { SupabaseAuthGuard } from '../src/user/guards/supabase-auth.guard';
import { SuperbaseStorageService } from './superbase-storage.service';
import { SupabaseService } from './superbase.service';

@Module({
  providers: [SupabaseService, SuperbaseStorageService, SupabaseAuthGuard],
  exports: [SupabaseService, SuperbaseStorageService, SupabaseAuthGuard],
})
export class SupabaseModule {}
