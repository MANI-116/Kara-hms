import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    const isPublic = this.reflector.getAllAndOverride<boolean>(
          IS_PUBLIC_KEY,
          [context.getHandler(), context.getClass()]
        );
        if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("User not found in request");
    }

    // 🔹 1️⃣ Role Check
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException("Insufficient role");
      }
    }

    // 🔹 2️⃣ Permission Check
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(
        PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()]
      );

    if (requiredPermissions && requiredPermissions.length > 0) {
      if (!user.permissions || user.permissions.length === 0) {
        throw new ForbiddenException("User has no permissions");
      }

      const hasPermission = requiredPermissions.some((perm) =>
        user.permissions.includes(perm)
      );

      if (!hasPermission) {
        throw new ForbiddenException("Insufficient permissions");
      }
    }

    return true;
  }
}
