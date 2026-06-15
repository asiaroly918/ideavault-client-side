import { useEffect, useState } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/common/Loading';

export default function Profile() {
  const { user, updateUserProfile, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ displayName: '', photoURL: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile(form);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) return <Loading />;

  return (
    <>
      <Head>
        <title>Profile Management | IdeaVault</title>
      </Head>

      <section className="py-10 bg-base-100 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Profile Management</h1>

          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-6">
                <div className="avatar">
                  <div className="w-20 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                    <img
                      src={form.photoURL || 'https://i.ibb.co/5L73mvX/avatar.png'}
                      alt={form.displayName || 'User'}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{form.displayName || 'User'}</h2>
                  <p className="text-base-content/70 text-sm">{user.email}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Display Name</span>
                  </label>
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, displayName: e.target.value }))
                    }
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Photo URL</span>
                  </label>
                  <input
                    type="url"
                    value={form.photoURL}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, photoURL: e.target.value }))
                    }
                    placeholder="https://example.com/photo.jpg"
                    className="input input-bordered w-full"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full md:w-auto min-w-[140px]"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
