import type { components } from './schema';

export type Product = components['schemas']['Product']

export type AuthResponse = components['schemas']['AuthResponse']
export type User = components['schemas']['UserPublic']
export type UserRole = NonNullable<components['schemas']['UpdateUserRoleRequest']['role']>