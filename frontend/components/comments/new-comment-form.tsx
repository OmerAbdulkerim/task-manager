'use client';

import { useState } from 'react';
import { createComment, Comment } from '@/lib/comment-service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/auth-store';

interface NewCommentFormProps {
  taskId: number | string;
  onCommentAdded: (comment: Comment) => void;
}

export function NewCommentForm({
  taskId,
  onCommentAdded,
}: NewCommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const user = useAuthStore((state) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const newComment = await createComment({
        content,
        taskId: String(taskId),
        createdById: user?.id,
      });
      onCommentAdded(newComment);
      setContent('');
    } catch (err: any) {
      setError(err.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px] w-full"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <div className="mt-2 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
}
