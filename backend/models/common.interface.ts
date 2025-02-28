/**
 * Common interfaces used across models
 */

/**
 * Base model with ID field
 */
export interface BaseModel {
    id: string;
}

/**
 * Model with timestamps
 */
export interface TimestampedModel {
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Task status enum values
 */
export enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
}
