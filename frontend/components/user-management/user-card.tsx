'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Shield } from 'lucide-react';
import { User, Role } from '@/lib/user-service';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserCardProps {
  user: User;
  currentUserId: string;
  roles: Role[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export function UserCard({
  user,
  currentUserId,
  roles,
  onEdit,
  onDelete,
}: UserCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Find the role name
  const roleName =
    roles.find((r) => r.id === user.roleId)?.name || 'Unknown Role';

  // Determine if this is an admin user
  const isAdmin = user.roleId === 1;

  // Determine if this is the current user
  const isCurrentUser = user.id === currentUserId;

  const handleDelete = () => {
    onDelete(user.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-lg">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {user.name || user.email}
              {isCurrentUser && (
                <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                  You
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(user)}
              className="h-8 w-8 text-gray-500 hover:text-blue-600"
              disabled={isCurrentUser} // Prevent editing yourself
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              className="h-8 w-8 text-gray-500 hover:text-red-600"
              disabled={isCurrentUser} // Prevent deleting yourself
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>

        <div className="mt-3 mb-2 flex items-center">
          <div
            className={`flex items-center ${isAdmin ? 'text-purple-700' : 'text-gray-600'}`}
          >
            <Shield
              className={`mr-1 h-4 w-4 ${isAdmin ? 'text-purple-700' : 'text-gray-400'}`}
            />
            <span className="text-sm font-medium">{roleName}</span>
          </div>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{user.name || user.email}
              &quot;? This action cannot be undone.
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
