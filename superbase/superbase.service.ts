import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private adminClient: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      throw new Error('Missing Supabase env vars');
    }

    // CLIENTE ADMIN (bypass RLS)
    this.adminClient = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });

    console.log('adminClient', this.adminClient);
    console.log('serviceKey', serviceKey);
    console.log('url', url);
  }

  // 🔐 client com token do usuário (RLS ativo)
  getUserClient(accessToken: string): SupabaseClient {
    return createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // 👈 aqui está o segredo
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
        auth: {
          persistSession: false,
        },
      },
    );
  }

  // 🛠 client admin
  getAdminClient(): SupabaseClient {
    return this.adminClient;
  }
}
