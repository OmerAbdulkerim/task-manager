import {
    IsNotEmpty,
    IsString,
    IsUUID,
    Length,
    IsOptional,
} from 'class-validator';

/**
 * DTO for creating a new comment
 */
export class CreateCommentDto {
    @IsNotEmpty({ message: 'Content is required' })
    @IsString({ message: 'Content must be a string' })
    @Length(1, 1000, {
        message: 'Content must be between 1 and 1000 characters',
    })
    content: string;

    @IsNotEmpty({ message: 'Task ID is required' })
    @IsUUID('4', { message: 'Task ID must be a valid UUID' })
    taskId: string;

    @IsOptional()
    @IsUUID('4', { message: 'Created by ID must be a valid UUID' })
    createdById?: string;
}

/**
 * DTO for updating an existing comment
 */
export class UpdateCommentDto {
    @IsNotEmpty({ message: 'Content is required' })
    @IsString({ message: 'Content must be a string' })
    @Length(1, 1000, {
        message: 'Content must be between 1 and 1000 characters',
    })
    content: string;
}
