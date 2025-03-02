import { NumericIdModel } from './common.interface';
import { Task } from './task.interface';

/**
 * TaskCategory model interface
 */
export interface TaskCategory extends NumericIdModel {
    name: string;

    // Relations
    tasks?: Task[];
}

/**
 * TaskCategory creation interface
 */
export interface TaskCategoryCreate {
    name: string;
}

/**
 * TaskCategory update interface
 */
export interface TaskCategoryUpdate {
    name?: string;
}
