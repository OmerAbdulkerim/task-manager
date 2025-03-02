import { z } from 'zod';
import { TaskStatus } from './task-service';

// Task validation schema
export const taskSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  description: z
    .string()
    .min(5, { message: 'Description must be at least 5 characters long' })
    .max(500, { message: 'Description must be less than 500 characters' }),
  status: z
    .nativeEnum(TaskStatus, {
      invalid_type_error: 'Status must be a valid task status',
    })
    .optional(),
  priorityId: z
    .number()
    .int()
    .positive({ message: 'Please select a valid priority' })
    .optional(),
  categoryId: z
    .number()
    .int()
    .positive({ message: 'Please select a valid category' })
    .optional(),
  dueDate: z
    .string()
    .refine(
      (date) => {
        return !isNaN(Date.parse(date));
      },
      { message: 'Please enter a valid date' },
    )
    .optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

// User validation schema
export const userSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .min(5, { message: 'Email must be at least 5 characters long' })
    .max(100, { message: 'Email must be less than 100 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(100, { message: 'Password must be less than 100 characters' })
    .optional(),
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(100, { message: 'Name must be less than 100 characters' })
    .optional(),
  roleId: z.number().int().positive({ message: 'Please select a valid role' }),
});

export type UserFormValues = z.infer<typeof userSchema>;

// Comment validation schema
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, { message: 'Comment cannot be empty' })
    .max(1000, { message: 'Comment must be less than 1000 characters' }),
  taskId: z.number().int().positive({ message: 'Invalid task ID' }),
});

export type CommentFormValues = z.infer<typeof commentSchema>;
