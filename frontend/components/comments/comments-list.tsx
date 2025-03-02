'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Comment, fetchCommentsByTaskId } from '@/lib/comment-service';
import { CommentItem } from '@/components/comments/comment-item';
import { NewCommentForm } from '@/components/comments/new-comment-form';
import { useAuthStore } from '@/store/auth-store';

interface CommentListProps {
  taskId: number | string;
}

export function CommentList({ taskId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadComments();
  }, [taskId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const commentsData = await fetchCommentsByTaskId(String(taskId));
      setComments(commentsData);
      setError('');
    } catch (err: any) {
      console.error('Error loading comments:', err);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment: Comment) => {
    setComments([...comments, newComment]);
  };

  const handleCommentUpdated = (updatedComment: Comment) => {
    setComments(
      comments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment,
      ),
    );
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Comments</h2>

      {error && (
        <div className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <NewCommentForm taskId={taskId} onCommentAdded={handleCommentAdded} />

      <div className="mt-6 space-y-4">
        {loading && !comments.length ? (
          <div className="py-4 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">Loading comments...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              taskId={taskId}
              currentUserId={user?.id || ''}
              onCommentUpdated={handleCommentUpdated}
              onCommentDeleted={handleCommentDeleted}
            />
          ))
        ) : (
          <div className="py-4 text-center text-gray-500">
            No comments yet. Be the first to add a comment!
          </div>
        )}
      </div>
    </div>
  );
}
