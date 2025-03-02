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
