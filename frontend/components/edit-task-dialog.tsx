'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TaskForm } from '@/components/task-form';
import {
  Task,
  UpdateTaskDto,
  updateTask,
  TaskCategory,
  TaskPriority,
} from '@/lib/task-service';

interface EditTaskDialogProps {
  task: Task | null;
  categories?: TaskCategory[];
  priorities?: TaskPriority[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdated: () => void;
}

export function EditTaskDialog({
  task,
  categories = [],
  priorities = [],
  open,
  onOpenChange,
  onTaskUpdated,
}: EditTaskDialogProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: UpdateTaskDto) => {
    if (!task) return;

    try {
      setError(null);
      // Ensure we're sending a properly formatted UpdateTaskDto
      const updateData: UpdateTaskDto = {
        title: data.title,
        // Use description as is - UpdateTaskDto accepts string | null | undefined
        description: data.description,
        status: data.status,
        priorityId: data.priorityId,
        categoryId: data.categoryId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      };

      await updateTask(task.id, updateData);
      onOpenChange(false);
      onTaskUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="relative rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}
        {task && (
          <TaskForm
            task={task}
            categories={categories}
            priorities={priorities}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
