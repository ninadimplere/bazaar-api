import { ROLES_KEY } from '@auth/roles.decorator';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector is required to read metadata attached to classes/methods
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get the required roles for this route (e.g., ['ADMIN'])
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [
        context.getHandler(), // Check method level
        context.getClass(), // Check controller level
      ],
    );

    // If no roles are defined on the route, allow access
    if (!requiredRoles) {
      return true;
    }

    // 2. Get the user object from the request
    // Assumes JwtAuthGuard has already run and attached the user to req.user
    const { user } = context.switchToHttp().getRequest();

    // Safety check: ensure the user object and user.role exist
    if (!user || !user.role || !Array.isArray(user.role)) {
      return false;
    }

    // 3. Compare user roles against required roles
    // The user's role array must contain at least one of the required roles.
    return requiredRoles.some((role) => user.role.includes(role));
  }
}
