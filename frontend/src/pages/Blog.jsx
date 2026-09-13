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

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Track expanded text content per blog ID
  const [expanded, setExpanded] = useState({});
  // Track share status feedback
  const [copiedId, setCopiedId] = useState(null);

  // Fallback Articles Data
  const fallbackBlogs = [
    {
      id: 'blog-1',
      title: '5 Tips for Maintaining Your Vehicle’s Ceramic Coating',
      content: `Ceramic coatings offer extraordinary hydrophobic protection and depth of shine, but they are not completely maintenance-free. To keep your coating performing at its highest level for years, follow these core maintenance rules:\n\n1. Use pH-Neutral Wash Solutions: Harsh detergents and alkaline dish soaps break down sealant layer hydrophobic qualities over time. Stick strictly to car-specific pH-neutral shampoos.\n2. The Two-Bucket Method: Always utilize dirt-trapping grit guards with separate rinse and wash buckets to prevent swirl marks.\n3. Avoid Automatic Soft-Cloth Car Washes: Abrasive spinning brushes in automated drive-thru washes accumulate debris from prior vehicles and strip ceramic sealants.\n4. Apply Periodic Ceramic Boosters: Every 3 to 6 months, apply a spray ceramic detailer after washing to refresh the top hydrophobic layer.\n5. Dry With Premium Microfiber: Towel dry immediately after rinsing to avoid hard mineral water spot etching.`,
      image_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80',
      created_at: '2026-08-28T10:00:00Z',
      likes: 24
    },
    {
      id: 'blog-2',
      title: 'Upgrading Your Car Audio: Head Units vs. Component Speakers',
      content: `When upgrading an automotive audio system, vehicle owners frequently debate whether to start with the receiver head unit or high-frequency door speakers. Here is how to prioritize your budget for maximum sound quality:\n\nReplacing stock door speakers with two-way or three-way component speakers delivers an immediate improvement in audio clarity and vocal staging. Factory speakers typically use cheap paper cones with integrated paper tweeters.\n\nHowever, if your stock factory amplifier lacks adequate clean power output or Bluetooth signal clarity, feeding new high-end speakers from a distorted head unit will limit performance. For optimal acoustics, pair aftermarket speakers with a clean inline amplifier or a modern digital head unit featuring equalization control.`,
      image_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80',
      created_at: '2026-08-15T14:30:00Z',
      likes: 41
    },
    {
      id: 'blog-3',
      title: 'Why Steam Cleaning is Essential for Vehicle Interior Sanitation',
      content: `Traditional interior surface cleaners mask odors and clean topical vinyl, but deep bacteria and allergens remain embedded inside carpet fibers and seat upholstery.\n\nCommercial high-temperature steam extraction breaks down organic stains, eliminates odor-causing bacteria without harsh chemical fumes, and neutralizes mold spores lodged inside HVAC ventilation ducts. Steam detailing restores fabric texture while sterilizing contact surfaces safely.`,
      image_url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1000&q=80',
      created_at: '2026-07-30T09:15:00Z',
      likes: 18
    }
  ];

  // 1. Load Blog Articles from API / Supabase
  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const res = await fetch('/api/blogs');
        if (!res.ok) throw new Error('Could not fetch blog feed');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Sort chronologically (newest post at top)
          const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setBlogs(sorted);
        } else {
          setBlogs(fallbackBlogs);
        }
      } catch (err) {
        console.warn('API error, rendering fallback blog articles:', err);
        setBlogs(fallbackBlogs);
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
            likes: isLikedLocally ? Math.max(0, post.likes - 1) : post.likes + 1
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
      await fetch(`/api/blogs/${blogId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
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
            <p className="text-slate-400">No blog articles available yet.</p>
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
                  {/* Article Cover Image (Supabase Storage URL) */}
                  {post.image_url && (
                    <div className="relative h-64 sm:h-80 w-full bg-slate-950 overflow-hidden">
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
                  <div className="p-6 sm:p-8">
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
                </article>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}