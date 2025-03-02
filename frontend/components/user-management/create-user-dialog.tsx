'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { UserForm } from '@/components/user-management/user-form';
import {
  CreateUserDto,
  UpdateUserDto,
  createUser,
  Role,
} from '@/lib/user-service';

interface CreateUserDialogProps {
  roles: Role[];
  onUserCreated: () => void;
}

export function CreateUserDialog({
  roles,
  onUserCreated,
}: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateUserDto | UpdateUserDto) => {
    try {
      setError(null);
      await createUser(data as CreateUserDto);
      setOpen(false);
      onUserCreated();
    } catch (error: any) {
      setError(error.message || 'Failed to create user');
      console.error('Error creating user:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="relative mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <UserForm
          roles={roles}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
