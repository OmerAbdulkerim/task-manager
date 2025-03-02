'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import {
  Task,
  fetchTaskById,
  deleteTask,
  TaskStatus,
  TaskPriority,
  TaskCategory,
} from '@/lib/task-service';
import { EditTaskDialog } from '@/components/edit-task-dialog';
import { CommentList } from '@/components/comments/comments-list';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function loadTask() {
      try {
        setLoading(true);
        const taskData = await fetchTaskById(taskId);
        setTask(taskData);
      } catch (err: any) {
        console.error('Error loading task:', err);
        setError('Failed to load task details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (taskId) {
      loadTask();
    }
  }, [taskId]);

  const handleDeleteTask = async () => {
    try {
      await deleteTask(taskId);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again later.');
    }
  };

  const refreshTask = async () => {
    try {
      setLoading(true);
      const taskData = await fetchTaskById(taskId);
      setTask(taskData);
    } catch (err: any) {
      console.error('Error refreshing task:', err);
      setError('Failed to refresh task details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority?: TaskPriority) => {
    if (!priority) return 'bg-gray-100 text-gray-800';

    switch (priority.name) {
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold">Loading...</h2>
            <p className="text-gray-500">
              Please wait while we load the task details
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error || !task) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="mb-6 flex items-center gap-2"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="relative rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error || 'Task not found'}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 flex items-start justify-between">
            <h1 className="text-2xl font-bold">{task.title}</h1>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">Description</h2>
            <p className="whitespace-pre-line text-gray-700">
              {task.description}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">Status</h3>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(task.status)}`}
              >
                {task.status}
              </span>
            </div>

            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">
                Priority
              </h3>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${getPriorityColor(task.priority)}`}
              >
                {task.priority?.name || 'Unknown'}
              </span>
            </div>

            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">
                Due Date
              </h3>
              <p className="text-gray-900">
                {task.dueDate
                  ? format(new Date(task.dueDate), 'MMMM d, yyyy')
                  : 'Not set'}
              </p>
            </div>

            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">
                Category
              </h3>
              <p className="text-gray-900">
                {task.category?.name || 'Uncategorized'}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-500">
                  Created
                </h3>
                <p className="text-gray-700">
                  {format(new Date(task.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>

              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-500">
                  Last Updated
                </h3>
                <p className="text-gray-700">
                  {format(new Date(task.updatedAt), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <CommentList taskId={task.id} />
        </div>
      </div>

      <EditTaskDialog
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onTaskUpdated={refreshTask}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTask}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
