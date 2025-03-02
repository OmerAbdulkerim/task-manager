import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
    @IsString({ message: 'Title must be a string' })
    @IsNotEmpty({ message: 'Title is required' })
    title: string = '';

    @IsString({ message: 'Description must be a string' })
    @IsOptional()
    description?: string;

    @IsEnum(TaskStatus, { message: 'Status must be a valid task status' })
    @IsOptional()
    status?: TaskStatus;

    @IsNumber({}, { message: 'Priority ID must be a number' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'Priority ID is required' })
    priorityId: number = 0;

    @IsNumber({}, { message: 'Category ID must be a number' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'Category ID is required' })
    categoryId: number = 0;

    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'Due date must be a valid date' })
    dueDate?: Date;
}

export class UpdateTaskDto {
    @IsString({ message: 'Title must be a string' })
    @IsOptional()
    title?: string;

    @IsString({ message: 'Description must be a string' })
    @IsOptional()
    description?: string;

    @IsEnum(TaskStatus, { message: 'Status must be a valid task status' })
    @IsOptional()
    status?: TaskStatus;

    @IsNumber({}, { message: 'Priority ID must be a number' })
    @Type(() => Number)
    @IsOptional()
    priorityId?: number;

    @IsNumber({}, { message: 'Category ID must be a number' })
    @Type(() => Number)
    @IsOptional()
    categoryId?: number;

    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'Due date must be a valid date' })
    dueDate?: Date;
}

export class TaskFilterDto {
    @IsOptional()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    priorityIds?: number[];

    @IsOptional()
    @IsEnum(TaskStatus, { each: true })
    statuses?: TaskStatus[];

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dueDateFrom?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dueDateTo?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    createdAtFrom?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    createdAtTo?: Date;

    @IsOptional()
    @IsString()
    @IsEnum(['asc', 'desc'])
    sortDirection?: 'asc' | 'desc' = 'desc';

    @IsOptional()
    @IsString()
    @IsEnum(['priority', 'status', 'dueDate', 'createdAt'])
    sortBy?: 'priority' | 'status' | 'dueDate' | 'createdAt' = 'createdAt';
}
