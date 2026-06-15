import { useEffect, useState } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { getMyInteractions } from '@/lib/api';
import IdeaCard from '@/components/idea/IdeaCard';
import Loading from '@/components/common/Loading';

export default function MyInteractions() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    getMyInteractions(user.uid)
      .then((data) => {
        if (mounted) setIdeas(data);
      })
      .catch(() => {
        toast.error('Failed to load interactions');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <>
      <Head>
        <title>My Interactions | IdeaVault</title>
      </Head>

      <section className="py-10 bg-base-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">My Interactions</h1>
            <p className="text-base-content/70 mt-2">
              Ideas you have commented on and engaged with.
            </p>
          </div>

          {loading ? (
            <Loading />
          ) : ideas.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold">No interactions yet</h3>
              <p className="text-base-content/70 mt-2">
                Start commenting on ideas to see them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <IdeaCard key={idea._id} idea={idea} showActions={false} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
