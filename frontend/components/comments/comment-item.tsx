'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { Comment, updateComment, deleteComment } from '@/lib/comment-service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CommentItemProps {
  comment: Comment;
  taskId: number | string;
  currentUserId: string;
  onCommentUpdated: (comment: Comment) => void;
  onCommentDeleted: (commentId: string) => void;
}

export function CommentItem({
  comment,
  taskId,
  currentUserId,
  onCommentUpdated,
  onCommentDeleted,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Check if the current user is the author of the comment
  const isAuthor = comment.authorId === currentUserId;

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const updatedComment = await updateComment(taskId, comment.id, {
        content: editedContent,
      });
      onCommentUpdated(updatedComment);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await deleteComment(comment.id);
      onCommentDeleted(comment.id);
      setShowDeleteDialog(false);
    } catch (err: any) {
      setError(err.message || 'Failed to delete comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="font-medium text-gray-800">
            {comment.author?.email || 'Unknown User'}
          </div>
          <span className="mx-2 text-gray-400">•</span>
          <div className="text-sm text-gray-500">
            {formatDate(comment.createdAt)}
          </div>
        </div>
        {isAuthor && (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 text-gray-500 hover:text-blue-600"
            >
              <Edit2 className="h-4 w-4" />
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
        )}
      </div>

      {isEditing ? (
        <div className="mt-3">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[80px] w-full"
            placeholder="Edit your comment..."
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          <div className="mt-2 flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setEditedContent(comment.content);
                setError('');
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveEdit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-2 whitespace-pre-wrap text-gray-700">
          {comment.content}
        </div>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
