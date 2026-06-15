import { useEffect, useState } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { getMyIdeas, updateIdea, deleteIdea } from '@/lib/api';
import IdeaCard from '@/components/idea/IdeaCard';
import IdeaForm from '@/components/idea/IdeaForm';
import Loading from '@/components/common/Loading';

export default function MyIdeas() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIdea, setEditingIdea] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const data = await getMyIdeas(user?.uid);
      setIdeas(data);
    } catch {
      toast.error('Failed to load your ideas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchIdeas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleUpdate = async (payload) => {
    if (!editingIdea) return;
    setSubmitting(true);
    try {
      const updated = await updateIdea(editingIdea._id, payload);
      setIdeas((prev) =>
        prev.map((i) => (i._id === updated._id ? updated : i))
      );
      setEditingIdea(null);
      toast.success('Idea updated');
    } catch {
      toast.error('Failed to update idea');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteIdea(deletingId);
      setIdeas((prev) => prev.filter((i) => i._id !== deletingId));
      setDeletingId(null);
      toast.success('Idea deleted');
    } catch {
      toast.error('Failed to delete idea');
    }
  };

  return (
    <>
      <Head>
        <title>My Ideas | IdeaVault</title>
      </Head>

      <section className="py-10 bg-base-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">My Ideas</h1>

          {loading ? (
            <Loading />
          ) : ideas.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold">No ideas yet</h3>
              <p className="text-base-content/70 mt-2">
                Share your first startup idea and start collecting feedback.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <div key={idea._id} className="relative group">
                  <IdeaCard idea={idea} showActions={false} />
                  <div className="absolute top-3 right-3 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingIdea(idea)}
                      className="btn btn-sm btn-primary"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setDeletingId(idea._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Edit Modal */}
      {editingIdea && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-2xl mb-4">Update Idea</h3>
            <IdeaForm
              initialData={editingIdea}
              onSubmit={handleUpdate}
              submitLabel="Save Changes"
              loading={submitting}
            />
            <div className="modal-action">
              <button onClick={() => setEditingIdea(null)} className="btn btn-ghost">
                Cancel
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setEditingIdea(null)} />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Idea?</h3>
            <p className="py-4 text-base-content/80">
              This action cannot be undone. All comments and interactions will be removed.
            </p>
            <div className="modal-action">
              <button onClick={() => setDeletingId(null)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn btn-error">
                Delete
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeletingId(null)} />
        </div>
      )}
    </>
  );
}
