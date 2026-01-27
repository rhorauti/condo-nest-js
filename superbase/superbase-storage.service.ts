import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { SupabaseService } from './superbase.service';

@Injectable()
export class SuperbaseStorageService {
  private bucket = process.env.SUPABASE_BUCKET_NAME || '';

  constructor(private supabase: SupabaseService) {}

  async uploadFile(opts: {
    buffer: Buffer;
    originalName: string;
    contentType?: string;
    folder?: string;
    expiresInSeconds?: number; // tempo de expiração da signed URL
  }) {
    const {
      buffer,
      originalName,
      contentType,
      folder = 'posts',
      expiresInSeconds = 60 * 60, // padrão: 1h
    } = opts;

    const ext = path.extname(originalName) || '.jpg';
    const filename = `${uuidv4()}${ext}`;
    const filePath = `${folder}/${filename}`;

    const client = this.supabase.getClient();

    const { error: uploadError } = await client.storage
      .from(this.bucket)
      .upload(filePath, buffer, {
        contentType: contentType || 'application/octet-stream',
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      throw new InternalServerErrorException('Erro ao enviar arquivo');
    }

    const { data, error: signedError } = await client.storage
      .from(this.bucket)
      .createSignedUrl(filePath, expiresInSeconds);

    if (signedError) {
      console.error(signedError);
      throw new InternalServerErrorException('Erro ao gerar URL assinada');
    }

    return {
      path: filePath,
      signedUrl: data.signedUrl,
    };
  }
}
