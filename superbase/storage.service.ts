import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { SupabaseService } from './superbase.service';

@Injectable()
export class StorageService {
  private bucket = process.env.SUPABASE_BUCKET_NAME || '';

  constructor(private supabase: SupabaseService) {}

  async uploadFile(opts: {
    buffer: Buffer;
    originalName: string;
    contentType?: string;
    folder?: string;
  }) {
    const { buffer, originalName, contentType, folder = 'posts' } = opts;

    const ext = path.extname(originalName) || '.bin';
    const filename = `${uuidv4()}${ext}`;
    const filePath = `${folder}/${filename}`;

    const client = this.supabase.getClient();

    const { error } = await client.storage
      .from(this.bucket)
      .upload(filePath, buffer, {
        contentType: contentType || 'application/octet-stream',
        upsert: false,
      });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao enviar arquivo');
    }

    const { data } = client.storage.from(this.bucket).getPublicUrl(filePath);

    return {
      path: filePath,
      url: data.publicUrl, // URL pública via Supabase Storage
    };
  }
}
