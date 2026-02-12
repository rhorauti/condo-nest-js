import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SupabaseService } from '../../../superbase/superbase.service';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private supabaseService: SupabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    let token: string | undefined;

    // 1️⃣ Tenta pegar do Authorization header
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '').trim();
    }

    // 2️⃣ Se não tiver, tenta pegar do cookie
    if (!token && request.cookies?.access_token) {
      token = request.cookies.access_token;
    }

    if (!token) return false;

    const supabase = this.supabaseService.getUserClient(token);
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) return false;

    request.user = data.user;
    return true;
  }
}
