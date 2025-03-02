'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserForm } from '@/components/user-management/user-form';
import { User, UpdateUserDto, updateUser, Role } from '@/lib/user-service';

interface EditUserDialogProps {
  user: User | null;
  roles: Role[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

export function EditUserDialog({
  user,
  roles,
  open,
  onOpenChange,
  onUserUpdated,
}: EditUserDialogProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: UpdateUserDto) => {
    if (!user) return;

    try {
      setError(null);
      await updateUser(user.id, data);
      onOpenChange(false);
      onUserUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="relative mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {user && (
          <UserForm
            user={user}
            roles={roles}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
