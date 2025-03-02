import {
    BaseModel,
    NumericIdModel,
    TaskStatus,
    TimestampedModel,
} from './common.interface';
import { TaskCategory } from './taskCategory.interface';
import { TaskPriority } from './taskPriority.interface';
import { User } from './user.interface';

/**
 * Task model interface
 */
export interface Task extends BaseModel, TimestampedModel {
    title: string;
    description?: string | null;
    status: TaskStatus;
    priorityId: number;
    dueDate?: Date | null;
    createdById: string;
    categoryId: number;

    // Relations
    priority?: TaskPriority;
    createdBy?: User;
    category?: TaskCategory;
}

/**
 * Task creation interface
 */
export interface TaskCreate {
    title: string;
    description?: string;
    status?: TaskStatus;
    priorityId: number;
    dueDate?: Date;
    createdById: string;
    categoryId: number;
}

/**
 * Task update interface
 */
export interface TaskUpdate {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    priorityId?: number;
    dueDate?: Date | null;
    categoryId?: number;
}
