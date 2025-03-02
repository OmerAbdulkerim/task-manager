'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { taskSchema, TaskFormValues } from '@/lib/validation';
import {
  CreateTaskDto,
  Task,
  TaskStatus,
  TaskCategory,
  TaskPriority,
  UpdateTaskDto,
} from '@/lib/task-service';

interface TaskFormProps {
  task?: Task;
  categories?: TaskCategory[];
  priorities?: TaskPriority[];
  onSubmit: (data: CreateTaskDto | UpdateTaskDto) => Promise<void>;
  onCancel: () => void;
}

export function TaskForm({
  task,
  categories = [],
  priorities = [],
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default values for categories and priorities if none are provided
  const defaultCategories: TaskCategory[] = categories.length
    ? categories
    : [
        { id: 1, name: 'Work' },
        { id: 2, name: 'Personal' },
      ];

  const defaultPriorities: TaskPriority[] = priorities.length
    ? priorities
    : [
        { id: 1, name: 'LOW' },
        { id: 2, name: 'MEDIUM' },
        { id: 3, name: 'HIGH' },
      ];

  // Find the default category and priority objects
  const defaultCategory = task?.category || defaultCategories[0];
  const defaultPriority = task?.priority || defaultPriorities[1]; // Medium priority default

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description || '',
          status: task.status,
          priorityId: task.priorityId,
          categoryId: task.categoryId,
          dueDate: task.dueDate
            ? format(new Date(task.dueDate), 'yyyy-MM-dd')
            : format(new Date(), 'yyyy-MM-dd'),
        }
      : {
          title: '',
          description: '',
          status: TaskStatus.PENDING,
          priorityId: defaultPriority.id,
          categoryId: defaultCategory.id,
          dueDate: format(new Date(), 'yyyy-MM-dd'),
        },
  });

  // Set form values when task changes
  useEffect(() => {
    if (task) {
      setValue('title', task.title);
      setValue('description', task.description || '');
      setValue('status', task.status);
      setValue('priorityId', task.priorityId);
      setValue('categoryId', task.categoryId);
      setValue(
        'dueDate',
        task.dueDate
          ? format(new Date(task.dueDate), 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
      );
    }
  }, [task, setValue]);

  const onFormSubmit = async (data: TaskFormValues) => {
    try {
      setIsSubmitting(true);
      // Transform form data to match the DTO
      const taskData: CreateTaskDto | UpdateTaskDto = {
        ...data,
        priorityId: Number(data.priorityId),
        categoryId: Number(data.categoryId),
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      };
      await onSubmit(taskData);
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register('title')} placeholder="Task title" />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          {...register('description')}
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Task description"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            defaultValue={task?.status || TaskStatus.PENDING}
            onValueChange={(value) => setValue('status', value as TaskStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TaskStatus.PENDING}>
                {TaskStatus.PENDING.replace('_', ' ')}
              </SelectItem>
              <SelectItem value={TaskStatus.IN_PROGRESS}>
                {TaskStatus.IN_PROGRESS.replace('_', ' ')}
              </SelectItem>
              <SelectItem value={TaskStatus.COMPLETED}>
                {TaskStatus.COMPLETED.replace('_', ' ')}
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            defaultValue={
              String(task?.priorityId) || String(defaultPriority.id)
            }
            onValueChange={(value) => setValue('priorityId', Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {defaultPriorities.map((priority) => (
                <SelectItem key={priority.id} value={String(priority.id)}>
                  {priority.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.priorityId && (
            <p className="text-sm text-red-500">{errors.priorityId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            defaultValue={
              String(task?.categoryId) || String(defaultCategory.id)
            }
            onValueChange={(value) => setValue('categoryId', Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {defaultCategories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-red-500">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input id="dueDate" type="date" {...register('dueDate')} />
          {errors.dueDate && (
            <p className="text-sm text-red-500">{errors.dueDate.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
