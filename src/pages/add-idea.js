import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { createIdea } from '@/lib/api';
import IdeaForm from '@/components/idea/IdeaForm';

export default function AddIdea() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      const idea = await createIdea(payload, user);
      toast.success('Idea published successfully');
      router.push(`/ideas/${idea._id}`);
    } catch {
      toast.error('Failed to publish idea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add Idea | IdeaVault</title>
      </Head>

      <section className="py-10 bg-base-100 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Share Your Startup Idea</h1>
            <p className="text-base-content/70 mt-2">
              The best ideas are clear, problem-focused, and open to feedback.
            </p>
          </div>

          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              <IdeaForm
                onSubmit={handleSubmit}
                submitLabel="Publish Idea"
                loading={loading}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
