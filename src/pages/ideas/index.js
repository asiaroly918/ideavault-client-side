import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getIdeas, getBookmarks, toggleBookmark } from '@/lib/api';
import IdeaCard from '@/components/idea/IdeaCard';
import Loading from '@/components/common/Loading';
import toast from 'react-hot-toast';

const categories = ['All', 'Tech', 'Health', 'AI', 'Education', 'Sustainability', 'Business', 'Finance', 'Other'];

export default function Ideas() {
  const router = useRouter();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState(new Set());

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sync filters from URL query and fetch on changes
  useEffect(() => {
    if (!router.isReady) return;
    const qSearch = router.query.search || '';
    const qCategory = router.query.category || 'All';
    const qStart = router.query.start || '';
    const qEnd = router.query.end || '';

    setSearch(qSearch);
    setCategory(qCategory);
    setStartDate(qStart);
    setEndDate(qEnd);

    const params = {
      search: qSearch.trim(),
      category: qCategory === 'All' ? '' : qCategory,
      start: qStart,
      end: qEnd,
    };
    setLoading(true);
    getIdeas(params)
      .then((data) => setIdeas(data))
      .catch(() => {
        toast.error('Failed to load ideas');
        setIdeas([]);
      })
      .finally(() => setLoading(false));
  }, [router.isReady, router.query]);

  useEffect(() => {
    getBookmarks()
      .then((data) => setBookmarks(new Set(data.map((i) => i._id))))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(
      { pathname: '/ideas', query: { search, category: category === 'All' ? '' : category, start: startDate, end: endDate } },
      undefined,
      { shallow: true }
    );
    fetchIdeas();
  };

  const handleToggleBookmark = async (id) => {
    try {
      await toggleBookmark(id);
      setBookmarks((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      toast.success('Bookmark updated');
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  return (
    <>
      <Head>
        <title>Explore Ideas | IdeaVault</title>
      </Head>

      <section className="py-12 bg-base-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold">Explore Startup Ideas</h1>
            <p className="text-base-content/70 mt-2">
              Search, filter, and discover ideas worth building.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="card bg-base-200 shadow-sm mb-8"
          >
            <div className="card-body grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="form-control md:col-span-1">
                <label className="label">
                  <span className="label-text font-medium">Search</span>
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title..."
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Category</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="select select-bordered w-full"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Date Range</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="From"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="To"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Apply Filters
              </button>
            </div>
          </form>

          {loading ? (
            <Loading />
          ) : ideas.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold">No ideas found</h3>
              <p className="text-base-content/70 mt-2">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <IdeaCard
                  key={idea._id}
                  idea={idea}
                  isBookmarked={bookmarks.has(idea._id)}
                  onToggleBookmark={handleToggleBookmark}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
