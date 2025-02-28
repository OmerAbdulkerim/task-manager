import { BaseModel, TaskStatus, TimestampedModel } from './common.interface';
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
    priorityId: string;
    dueDate?: Date | null;
    createdById: string;
    categoryId: string;

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
    priorityId: string;
    dueDate?: Date;
    createdById: string;
    categoryId: string;
}

/**
 * Task update interface
 */
export interface TaskUpdate {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    priorityId?: string;
    dueDate?: Date | null;
    categoryId?: string;
}
