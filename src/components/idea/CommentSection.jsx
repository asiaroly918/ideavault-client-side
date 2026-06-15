import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} from '@/lib/api';
import { FaEdit, FaTrash, FaPaperPlane } from 'react-icons/fa';

export default function CommentSection({ ideaId, onCommentChange }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    let mounted = true;
    getComments(ideaId)
      .then((data) => {
        if (mounted) setComments(data);
      })
      .catch(() => toast.error('Failed to load comments'))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [ideaId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const comment = await addComment(ideaId, text.trim(), user);
      setComments((prev) => [...prev, comment]);
      setText('');
      onCommentChange?.();
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const handleUpdate = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const updated = await updateComment(ideaId, commentId, editText.trim());
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? updated : c))
      );
      setEditingId(null);
      toast.success('Comment updated');
    } catch {
      toast.error('Failed to update comment');
    }
  };

  const [deletingId, setDeletingId] = useState(null);

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteComment(ideaId, deletingId);
      setComments((prev) => prev.filter((c) => c._id !== deletingId));
      onCommentChange?.();
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="card bg-base-100 shadow border border-base-200">
      <div className="card-body">
        <h3 className="card-title text-xl mb-4">
          Discussion ({comments.length})
        </h3>

        {user && (
          <form onSubmit={handleAdd} className="form-control mb-6">
            <label className="label">
              <span className="label-text font-medium">Add a comment</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts or feedback..."
                className="input input-bordered flex-grow"
              />
              <button type="submit" className="btn btn-primary">
                <FaPaperPlane />
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="skeleton h-20 w-full" />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="alert alert-soft">
            No comments yet. Be the first to share your thoughts.
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const isOwner = comment.authorId === user?.uid;
              const isEditing = editingId === comment._id;

              return (
                <div
                  key={comment._id}
                  className="p-4 rounded-xl bg-base-200/50 border border-base-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-10">
                          <span className="text-sm">
                            {(comment.authorName || 'A').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {comment.authorName || 'Anonymous'}
                        </p>
                        <p className="text-xs text-base-content/50">
                          {new Date(comment.createdAt).toLocaleString()}
                          {comment.updatedAt !== comment.createdAt && (
                            <span className="ml-2 italic">(edited)</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {isOwner && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(comment)}
                          className="btn btn-ghost btn-circle btn-xs"
                          aria-label="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => setDeletingId(comment._id)}
                          className="btn btn-ghost btn-circle btn-xs text-error"
                          aria-label="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="input input-bordered input-sm flex-grow"
                      />
                      <button
                        onClick={() => handleUpdate(comment._id)}
                        className="btn btn-primary btn-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="btn btn-ghost btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="mt-3 text-base-content/80">{comment.text}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {deletingId && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Comment?</h3>
            <p className="py-4 text-base-content/80">
              Are you sure you want to remove this comment? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button onClick={() => setDeletingId(null)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-error">
                Delete
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeletingId(null)} />
        </div>
      )}
    </div>
  );
}
