import { BaseModel } from './common.interface';
import { User } from './user.interface';

/**
 * Role model interface
 */
export interface Role extends BaseModel {
    name: string;

    // Relations
    users?: User[];
}

/**
 * Role creation interface
 */
export interface RoleCreate {
    name: string;
}

/**
 * Role update interface
 */
export interface RoleUpdate {
    name?: string;
}
