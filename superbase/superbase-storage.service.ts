import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { SupabaseService } from './superbase.service';

@Injectable()
export class SuperbaseStorageService {
  private bucket = process.env.SUPABASE_BUCKET_NAME || '';

  constructor(private supabase: SupabaseService) {}

  async uploadFile(
    accessToken: string,
    opts: {
      buffer: Buffer;
      originalName: string;
      contentType?: string;
      folder: string;
      expiresInSeconds?: number;
    },
  ) {
    const {
      buffer,
      originalName,
      contentType,
      folder,
      expiresInSeconds = 60 * 60,
    } = opts;

    const ext = path.extname(originalName) || '.jpg';
    const filename = `${uuidv4()}${ext}`;

    // 🔐 client COM token do usuário
    const client = this.supabase.getUserClient(accessToken);

    // 🔑 pega o userId do JWT
    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) {
      throw new InternalServerErrorException('Usuário não autenticado');
    }

    const filePath = `${folder}/${user.id}-${filename}`;

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

  async deleteFile(accessToken: string, opts: { path: string }) {
    const { path } = opts;

    if (!path) {
      throw new InternalServerErrorException(
        'Caminho do arquivo não informado',
      );
    }

    const client = this.supabase.getUserClient(accessToken);

    const { error } = await client.storage.from(this.bucket).remove([path]);

    if (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao excluir arquivo');
    }

    return {
      deleted: true,
      path,
    };
  }
}
