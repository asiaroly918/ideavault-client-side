import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTrendingIdeas } from '@/lib/api';
import IdeaCard from '@/components/idea/IdeaCard';
import Loading from '@/components/common/Loading';

export default function TrendingIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getTrendingIdeas(6)
      .then((res) => {
        if (mounted) {
          // res.data বা res যদি array হয়, সে অনুযায়ী safe set করা
          const ideaList = Array.isArray(res) ? res : (res?.data || []);
          setIdeas(ideaList);
        }
      })
      .catch(() => {
        if (mounted) setIdeas([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold">Trending Ideas</h2>
            <p className="text-base-content/70 mt-2">
              The most loved and discussed startup ideas this week.
            </p>
          </div>
          <Link href="/ideas" className="btn btn-outline btn-primary hidden sm:flex">
            View All Ideas
          </Link>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Array.isArray দিয়ে নিরাপদভাবে Rendering করা */}
            {Array.isArray(ideas) && ideas.length > 0 ? (
              ideas.map((idea) => (
                <IdeaCard key={idea._id} idea={idea} />
              ))
            ) : (
              <p className="text-center col-span-3 text-base-content/60">
                No trending ideas found!
              </p>
            )}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/ideas" className="btn btn-outline btn-primary">
            View All Ideas
          </Link>
        </div>
      </div>
    </section>
  );
}