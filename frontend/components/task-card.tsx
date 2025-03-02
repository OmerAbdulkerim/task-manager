'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { Task, TaskStatus } from '@/lib/task-service';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-purple-100 text-purple-800';
      case TaskStatus.PENDING:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-lg">
        <div className="mb-2 flex items-start justify-between">
          <Link
            href={`/tasks/${task.id}`}
            className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline"
          >
            {task.title}
          </Link>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              className="h-8 w-8 text-gray-500 hover:text-blue-600"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              className="h-8 w-8 text-gray-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>

        <p className="mb-3 line-clamp-2 text-sm text-gray-600">
          {task.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(task.status)}`}
          >
            {task.status.replace('_', ' ')}
          </span>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority?.name || '')}`}
          >
            {task.priority?.name || 'Unknown'} Priority
          </span>
        </div>

        <div className="mt-3 text-sm text-gray-500">
          Due:{' '}
          {task.dueDate
            ? format(new Date(task.dueDate), 'MMM d, yyyy')
            : 'No due date'}
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{task.title}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
