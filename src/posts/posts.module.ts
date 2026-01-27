import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/postgres/prisma.module';
import { SupabaseModule } from '../../superbase/superbase.module';
import { UserModule } from '../user/user.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [SupabaseModule, PrismaModule, UserModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
