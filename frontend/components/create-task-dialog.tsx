'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskForm } from '@/components/task-form';
import {
  CreateTaskDto,
  UpdateTaskDto,
  createTask,
  TaskCategory,
  TaskPriority,
} from '@/lib/task-service';

interface CreateTaskDialogProps {
  categories?: TaskCategory[];
  priorities?: TaskPriority[];
  onTaskCreated: () => void;
}

export function CreateTaskDialog({
  categories = [],
  priorities = [],
  onTaskCreated,
}: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: CreateTaskDto | UpdateTaskDto) => {
    try {
      // Convert data to CreateTaskDto and send to server
      const taskDto: CreateTaskDto = {
        title: data.title!,
        description: data.description || undefined, // Convert null to undefined
        status: data.status,
        priorityId: data.priorityId!,
        categoryId: data.categoryId!,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      };

      await createTask(taskDto);
      setOpen(false);
      onTaskCreated();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <TaskForm
          categories={categories}
          priorities={priorities}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
