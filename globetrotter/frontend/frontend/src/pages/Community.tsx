import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Search, Heart, MessageSquare, Share2, Plus, Sparkles, MapPin, CheckCircle2 
} from 'lucide-react';
import { useTrip } from '../context/useTrip';
import type { CommunityPost, PostComment } from '../data/tripData';
import '../styles/Modules.css';

const COMMUNITY_CATEGORIES = ['All', 'Popular', 'Recent', 'Trending', 'Budget Travel', 'Adventure', 'Luxury', 'Solo Travel'];

export const Community: React.FC = () => {
  const { communityPosts, toggleLikePost, addCommentToPost, addCommunityPost } = useTrip();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [commentText, setCommentText] = useState<{ [postId: string]: string }>({});

  // New post modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [postImage, setPostImage] = useState('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80');

  const filteredPosts = communityPosts.filter((post: CommunityPost) => {
    const matchesSearch = 
      post.tripTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.userName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postDesc.trim()) return;

    addCommunityPost({
      userId: '1',
      userName: 'You (Traveler)',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      userLocation: postLocation || 'Global Explorer',
      date: 'Just now',
      tripTitle: postTitle,
      image: postImage,
      description: postDesc,
      tags: ['Travel', 'Adventure', 'GlobeTrotter'],
    });

    setPostTitle('');
    setPostDesc('');
    setIsCreateModalOpen(false);
  };

  const handleAddComment = (postId: string) => {
    const text = commentText[postId];
    if (!text || !text.trim()) return;
    addCommentToPost(postId, text.trim(), 'You');
    setCommentText((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="module-page-container">
      <div className="container">
        {/* Community Hero */}
        <div className="community-hero-card" style={{ marginTop: '2.5rem' }}>
          <span className="module-eyebrow">
            <Users size={16} /> GLOBAL TRAVELER COMMUNITY
          </span>
          <h1 className="module-title" style={{ fontSize: '3.2rem' }}>
            Travel farther. Share more.
          </h1>
          <p className="module-subtitle" style={{ margin: '0 auto 2rem' }}>
            Discover journeys, itinerary recommendations, and real experiences shared by fellow globetrotters.
          </p>

          <div style={{ maxWidth: '580px', margin: '0 auto', display: 'flex', gap: '0.75rem' }}>
            <div className="search-input-wrapper-large" style={{ flex: 1, margin: 0 }}>
              <Search size={18} className="search-icon-inside" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-main"
                placeholder="Search trips, destinations or travelers..."
              />
            </div>
            <button onClick={() => setIsCreateModalOpen(true)} className="btn-gradient-cta">
              <Plus size={18} /> Share Journey
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', marginBottom: '2.5rem' }}>
          {COMMUNITY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn-outline-cta ${activeCategory === cat ? 'selected' : ''}`}
              style={{
                borderRadius: '9999px',
                fontSize: '0.85rem',
                padding: '0.4rem 1rem',
                borderColor: activeCategory === cat ? 'var(--color-sunset-orange)' : undefined,
                color: activeCategory === cat ? 'var(--color-sunset-orange)' : undefined,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Layout: Feed + Sidebar */}
        <div className="community-grid-layout">
          {/* Main Social Feed */}
          <div>
            {filteredPosts.map((post: CommunityPost) => (
              <div key={post.id} className="post-card">
                {/* User Header */}
                <div className="post-header-user">
                  <div className="user-info-group">
                    <img src={post.userAvatar} alt={post.userName} className="user-avatar-img" />
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800 }}>
                        {post.userName}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <MapPin size={12} /> {post.userLocation} • {post.date}
                      </span>
                    </div>
                  </div>
                  <span className="category-pill">{post.tripTitle}</span>
                </div>

                {/* Post Image */}
                <div className="post-image-box">
                  <img src={post.image} alt={post.tripTitle} className="post-img" />
                </div>

                {/* Post Body */}
                <div className="post-body-content">
                  <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    {post.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    {post.tags.map((tag: string) => (
                      <span key={tag} style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-sunset-orange)' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="post-actions-row">
                    <button
                      onClick={() => toggleLikePost(post.id)}
                      className={`btn-post-action ${post.isLiked ? 'liked' : ''}`}
                    >
                      <Heart size={18} fill={post.isLiked ? '#FF4F9A' : 'none'} />
                      <span>{post.likes} Likes</span>
                    </button>

                    <button className="btn-post-action">
                      <MessageSquare size={18} />
                      <span>{post.comments.length} Comments</span>
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Post link copied!');
                      }}
                      className="btn-post-action"
                      style={{ marginLeft: 'auto' }}
                    >
                      <Share2 size={18} />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Comments Drawer */}
                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    {post.comments.map((c: PostComment) => (
                      <div key={c.id} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <img src={c.userAvatar} alt={c.userName} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                        <div style={{ background: 'var(--bg-primary)', padding: '0.5rem 0.85rem', borderRadius: '12px', flex: 1 }}>
                          <span style={{ fontWeight: 800, fontSize: '0.82rem' }}>{c.userName}: </span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.text}</span>
                        </div>
                      </div>
                    ))}

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <input
                        type="text"
                        value={commentText[post.id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                        className="modal-input-control"
                        placeholder="Write a comment..."
                        style={{ height: '38px', fontSize: '0.85rem' }}
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="btn-gradient-cta"
                        style={{ height: '38px', padding: '0 1rem', fontSize: '0.82rem' }}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div>
            {/* Featured Public Trips Card */}
            <div className="expenses-table-card shadow-subtle" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                <Sparkles size={18} style={{ color: 'var(--color-sunset-orange)' }} /> Featured Public Trips
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { id: 'trip-001', name: 'European Summer Adventure', route: 'Paris → Rome → Santorini', cost: '₹85,000' },
                  { id: 'trip-002', name: 'Japan Cultural Discovery', route: 'Tokyo → Kyoto', cost: '₹75,000' },
                ].map((ft) => (
                  <div key={ft.id} style={{ padding: '0.85rem', borderRadius: '14px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                    <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>{ft.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0.5rem' }}>{ft.route}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: 'var(--color-sunset-orange)', fontSize: '0.85rem' }}>{ft.cost}</span>
                      <Link to={`/trips/${ft.id}`} className="btn-outline-cta" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                        View Trip →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travelers to Follow Card */}
            <div className="expenses-table-card shadow-subtle">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                <Users size={18} /> Travelers to Follow
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { name: 'Sarah Miller', trips: '14 Trips', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
                  { name: 'David Kim', trips: '8 Trips', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
                ].map((t) => (
                  <div key={t.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={t.avatar} alt={t.name} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                      <div>
                        <h5 style={{ fontWeight: 800, fontSize: '0.88rem' }}>{t.name}</h5>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.trips}</span>
                      </div>
                    </div>
                    <button className="btn-gradient-cta" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Journey Modal */}
      {isCreateModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card shadow-medium">
            <span className="modal-eyebrow">COMMUNITY POST</span>
            <h3 className="modal-title">Share Your Journey</h3>

            <form onSubmit={handleCreatePost} className="modal-form" style={{ marginTop: '1.25rem' }}>
              <div className="modal-field-group">
                <label className="modal-label">Trip Title *</label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="modal-input-control"
                  placeholder="e.g. 7 Days in Kyoto & Arashiyama"
                />
              </div>

              <div className="modal-field-group">
                <label className="modal-label">Location</label>
                <input
                  type="text"
                  value={postLocation}
                  onChange={(e) => setPostLocation(e.target.value)}
                  className="modal-input-control"
                  placeholder="e.g. Kyoto, Japan"
                />
              </div>

              <div className="modal-field-group">
                <label className="modal-label">Description / Travel Experience *</label>
                <textarea
                  rows={3}
                  required
                  value={postDesc}
                  onChange={(e) => setPostDesc(e.target.value)}
                  className="form-textarea-control"
                  placeholder="What was the highlight of your journey?"
                />
              </div>

              <div className="modal-field-group">
                <label className="modal-label">Cover Image URL</label>
                <input
                  type="text"
                  value={postImage}
                  onChange={(e) => setPostImage(e.target.value)}
                  className="modal-input-control"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn-outline-cta" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-gradient-cta" style={{ flex: 1 }}>
                  Post Journey <CheckCircle2 size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
