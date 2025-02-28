import { BaseModel } from './common.interface';
import { Role } from './role.interface';
import { Task } from './task.interface';

/**
 * User model interface
 */
export interface User extends BaseModel {
    email: string;
    password: string;
    roleId: string;

    // Relations
    role?: Role;
    tasks?: Task[];
}

/**
 * User creation interface
 */
export interface UserCreate {
    email: string;
    password: string;
    roleId: string;
}

/**
 * User update interface
 */
export interface UserUpdate {
    email?: string;
    password?: string;
    roleId?: string;
}
