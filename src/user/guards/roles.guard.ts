import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { role } = request.user;
    const requiredRoles = Reflect.getMetadata('roles', context.getHandler());

    return requiredRoles?.includes(role) ?? true;
  }
}
