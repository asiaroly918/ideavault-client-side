import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { getIdea, toggleLike, toggleBookmark, getBookmarks } from '@/lib/api';
import Loading from '@/components/common/Loading';
import CommentSection from '@/components/idea/CommentSection';
import { FaHeart, FaBookmark, FaRegBookmark, FaCalendar, FaUser, FaTags } from 'react-icons/fa';

export default function IdeaDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    getIdea(id)
      .then((data) => {
        if (mounted) setIdea(data);
      })
      .catch(() => {
        toast.error('Idea not found');
        router.replace('/404');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    getBookmarks()
      .then((data) => {
        if (mounted) setBookmarked(data.some((i) => i._id === id));
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [id, router]);

  const handleLike = async () => {
    if (liked) return;
    try {
      await toggleLike(id);
      setLiked(true);
      setIdea((prev) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
      toast.success('Idea liked');
    } catch {
      toast.error('Failed to like idea');
    }
  };

  const handleBookmark = async () => {
    try {
      await toggleBookmark(id);
      setBookmarked((prev) => !prev);
      toast.success(bookmarked ? 'Removed bookmark' : 'Bookmarked');
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  const refreshMeta = () => {
    setIdea((prev) => ({ ...prev, commentsCount: (prev.commentsCount || 0) }));
  };

  if (loading || !idea) return <Loading />;

  return (
    <>
      <Head>
        <title>{idea.title} | IdeaVault</title>
        <meta name="description" content={idea.shortDescription} />
      </Head>

      <section className="py-10 bg-base-100 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
            <figure className="h-64 md:h-80 bg-base-200">
              <img
                src={idea.imageURL || 'https://i.ibb.co/1M7zJ02/eco-pack.jpg'}
                alt={idea.title}
                className="w-full h-full object-cover"
              />
            </figure>

            <div className="card-body">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="badge badge-primary badge-lg">{idea.category}</span>
                <span className="flex items-center gap-1 text-sm text-base-content/60">
                  <FaCalendar /> {new Date(idea.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1 text-sm text-base-content/60">
                  <FaUser /> {idea.authorName || 'Anonymous'}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{idea.title}</h1>
              <p className="text-lg text-base-content/80 mb-6">{idea.shortDescription}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 rounded-xl bg-base-200">
                  <h3 className="font-bold text-lg mb-2">Problem Statement</h3>
                  <p className="text-base-content/80">{idea.problem}</p>
                </div>
                <div className="p-4 rounded-xl bg-base-200">
                  <h3 className="font-bold text-lg mb-2">Proposed Solution</h3>
                  <p className="text-base-content/80">{idea.solution}</p>
                </div>
              </div>

              <div className="prose max-w-none mb-8">
                <h3 className="font-bold text-xl mb-2">Detailed Description</h3>
                <p className="text-base-content/80 whitespace-pre-line">{idea.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-base-200">
                  <h4 className="font-semibold text-sm text-base-content/60">Target Audience</h4>
                  <p className="font-medium">{idea.targetAudience}</p>
                </div>
                <div className="p-4 rounded-xl bg-base-200">
                  <h4 className="font-semibold text-sm text-base-content/60">Estimated Budget</h4>
                  <p className="font-medium">
                    {idea.budget ? `$${idea.budget.toLocaleString()}` : 'Not specified'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-base-200">
                  <h4 className="font-semibold text-sm text-base-content/60">Likes & Comments</h4>
                  <p className="font-medium">
                    {idea.likes || 0} likes · {idea.commentsCount || 0} comments
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <FaTags className="text-base-content/50" />
                {idea.tags?.map((tag) => (
                  <span key={tag} className="badge badge-ghost">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleLike}
                  className={`btn gap-2 ${liked ? 'btn-error' : 'btn-outline btn-error'}`}
                >
                  <FaHeart /> {liked ? 'Liked' : 'Like'} ({idea.likes || 0})
                </button>
                <button
                  onClick={handleBookmark}
                  className={`btn gap-2 ${bookmarked ? 'btn-warning' : 'btn-outline btn-warning'}`}
                >
                  {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
                  {bookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <CommentSection ideaId={id} onCommentChange={refreshMeta} />
          </div>
        </div>
      </section>
    </>
  );
}
