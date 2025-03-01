import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
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

    @IsUUID('all', { message: 'Priority ID must be a valid UUID' })
    @IsNotEmpty({ message: 'Priority ID is required' })
    priorityId: string = '';

    @IsUUID('all', { message: 'Category ID must be a valid UUID' })
    @IsNotEmpty({ message: 'Category ID is required' })
    categoryId: string = '';

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

    @IsUUID('all', { message: 'Priority ID must be a valid UUID' })
    @IsOptional()
    priorityId?: string;

    @IsUUID('all', { message: 'Category ID must be a valid UUID' })
    @IsOptional()
    categoryId?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'Due date must be a valid date' })
    dueDate?: Date;
}
