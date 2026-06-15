import Link from 'next/link';
import { FaComment, FaHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';

export default function IdeaCard({
  idea,
  isBookmarked = false,
  onToggleBookmark,
  showActions = true,
}) {
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-200 h-full flex flex-col">
      <figure className="h-48 bg-base-200 overflow-hidden">
        <img
          src={idea.imageURL || 'https://i.ibb.co/1M7zJ02/eco-pack.jpg'}
          alt={idea.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </figure>
      <div className="card-body flex flex-col flex-grow p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="badge badge-outline badge-primary text-xs">
            {idea.category}
          </span>
          <span className="text-xs text-base-content/50">
            {new Date(idea.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h3 className="card-title text-lg font-bold line-clamp-2 mb-2">
          {idea.title}
        </h3>
        <p className="text-sm text-base-content/70 line-clamp-3 flex-grow">
          {idea.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          {idea.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="badge badge-ghost badge-sm">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-base-200">
          <div className="flex items-center gap-3 text-sm text-base-content/70">
            <span className="flex items-center gap-1">
              <FaHeart className="text-error" /> {idea.likes || 0}
            </span>
            <span className="flex items-center gap-1">
              <FaComment className="text-primary" /> {idea.commentsCount || 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {showActions && onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(idea._id)}
                className="btn btn-ghost btn-circle btn-sm"
                aria-label="Bookmark"
              >
                {isBookmarked ? (
                  <FaBookmark className="text-warning" />
                ) : (
                  <FaRegBookmark />
                )}
              </button>
            )}
            <Link
              href={`/ideas/${idea._id}`}
              className="btn btn-primary btn-sm"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
