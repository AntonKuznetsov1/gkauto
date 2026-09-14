import React, { useState, useEffect } from 'react';
import {
  Heart,
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  BookOpen,
  Share2,
  Check
} from 'lucide-react';
import { getBlogs, toggleBlogLike } from '../api';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Track expanded text content per blog ID
  const [expanded, setExpanded] = useState({});
  // Track share status feedback
  const [copiedId, setCopiedId] = useState(null);

  // 1. Load Blog Articles from API / Supabase
  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const data = await getBlogs();
        const sorted = (Array.isArray(data) ? data : []).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setBlogs(sorted.map((post) => ({ ...post, likes: Number(post.likes) || 0 })));
      } catch (err) {
        console.warn('Could not load blog articles:', err);
        setError('Could not load blog articles right now.');
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  // 2. Client-Side Restricted Like System Handler
  const handleToggleLike = async (blogId) => {
    const storageKey = `liked_blogs_${blogId}`;
    const isLikedLocally = localStorage.getItem(storageKey) === 'true';
    const action = isLikedLocally ? 'decrement' : 'increment';

    // Optimistic UI Update
    setBlogs((prev) =>
      prev.map((post) => {
        if (post.id === blogId) {
          return {
            ...post,
            likes: isLikedLocally ? Math.max(0, Number(post.likes) - 1) : Number(post.likes) + 1
          };
        }
        return post;
      })
    );

    if (isLikedLocally) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, 'true');
    }

    // Persist to Server API
    try {
      await toggleBlogLike(blogId, action);
    } catch (err) {
      console.warn('Could not sync like update with server:', err);
    }
  };

  // Content Expansion Toggle
  const toggleExpand = (blogId) => {
    setExpanded((prev) => ({ ...prev, [blogId]: !prev[blogId] }));
  };

  // Share Article Link
  const handleShare = (blogId) => {
    const url = `${window.location.origin}/blog#${blogId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(blogId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper Date Formatter
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#70BAE6]/10 text-[#70BAE6] text-sm font-medium mb-3 border border-[#70BAE6]/20">
            <BookOpen className="w-4 h-4" />
            <span>G&K Journal & Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Auto Detailing & Audio Insights
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Expert tips, detailing walkthroughs, and custom stereo installation guides direct from our shop specialists.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-[#70BAE6] mb-3" />
            <p className="text-sm font-medium">Fetching latest articles...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400">{error || 'No blog articles available yet.'}</p>
          </div>
        ) : (
          /* Article Feed Container */
          <div className="space-y-8">
            {blogs.map((post) => {
              const storageKey = `liked_blogs_${post.id}`;
              const isLiked = localStorage.getItem(storageKey) === 'true';
              const isExpanded = expanded[post.id];
              const contentText = post.content || '';
              const shouldTruncate = contentText.length > 280;

              return (
                <article
                  key={post.id}
                  id={post.id}
                  className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700/80 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Article Cover Image (Supabase Storage URL) */}
                    {post.image_url && (
                    <div className="relative h-56 md:h-auto md:min-h-[320px] md:w-2/5 shrink-0 bg-slate-950 overflow-hidden">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                    </div>
                    )}

                    {/* Article Content Container */}
                    <div className="flex-1 p-6 sm:p-8">
                    {/* Date Tag */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                      <Calendar className="w-3.5 h-3.5 text-[#70BAE6]" />
                      <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                    </div>

                    {/* Article Title */}
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-snug">
                      {post.title}
                    </h2>

                    {/* Article Body Content */}
                    <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3 whitespace-pre-line">
                      {shouldTruncate && !isExpanded
                        ? `${contentText.slice(0, 280)}...`
                        : contentText}
                    </div>

                    {/* Expand / Collapse Toggle Button */}
                    {shouldTruncate && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(post.id)}
                        className="mt-3 text-xs sm:text-sm font-semibold text-[#70BAE6] hover:underline inline-flex items-center gap-1 focus:outline-none"
                      >
                        <span>{isExpanded ? 'Read Less' : 'Read Full Article'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}

                    {/* Article Footer Toolbar */}
                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      {/* Like Action System */}
                      <button
                        type="button"
                        onClick={() => handleToggleLike(post.id)}
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                          isLiked
                            ? 'bg-[#70BAE6]/10 text-[#70BAE6] border-[#70BAE6]/30'
                            : 'bg-slate-800/50 text-slate-400 border-slate-700/60 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 transition-transform ${
                            isLiked ? 'fill-[#70BAE6] text-[#70BAE6] scale-110' : ''
                          }`}
                        />
                        <span>{post.likes} {post.likes === 1 ? 'Like' : 'Likes'}</span>
                      </button>

                      {/* Share Article Link */}
                      <button
                        type="button"
                        onClick={() => handleShare(post.id)}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {copiedId === post.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Link Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                    </div>

                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}