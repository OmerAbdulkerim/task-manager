import { NumericIdModel } from './common.interface';
import { Task } from './task.interface';

/**
 * TaskPriority model interface
 */
export interface TaskPriority extends NumericIdModel {
    name: string;

    // Relations
    tasks?: Task[];
}

/**
 * TaskPriority creation interface
 */
export interface TaskPriorityCreate {
    name: string;
}

/**
 * TaskPriority update interface
 */
export interface TaskPriorityUpdate {
    name?: string;
}
