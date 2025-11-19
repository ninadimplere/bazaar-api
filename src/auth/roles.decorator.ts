import { SetMetadata } from '@nestjs/common';

// Key used to store the roles metadata
export const ROLES_KEY = 'roles';

// The Roles decorator accepts an array of strings (roles)
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
