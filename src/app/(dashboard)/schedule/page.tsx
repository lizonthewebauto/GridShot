'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Post } from '@/types';

export default function SchedulePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const drafts = posts.filter((p) => p.status === 'draft');
  const scheduled = posts.filter((p) => p.status === 'scheduled');
  const publishing = posts.filter((p) => p.status === 'publishing');
  const published = posts.filter((p) => p.status === 'published');
  const failed = posts.filter((p) => p.status === 'failed');

  return (
    <div>
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-foreground"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Schedule
        </h1>
        <p className="text-muted text-sm mt-1">Track scheduled and published posts.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-lg bg-card border border-border p-12 text-center">
          <Calendar className="w-12 h-12 text-muted mx-auto mb-4" />
          <h2
            className="text-xl font-bold text-foreground mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            No posts yet
          </h2>
          <p className="text-muted max-w-md mx-auto text-sm">
            Create a slide, then publish it from the creator. It&apos;ll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <PostSection title="Upcoming" posts={[...publishing, ...scheduled]} kind="upcoming" />
          <PostSection title="Published" posts={published} kind="published" />
          <PostSection title="Drafts" posts={drafts} kind="draft" />
          <PostSection title="Failed" posts={failed} kind="failed" />
        </div>
      )}
    </div>
  );
}

function PostSection({ title, posts, kind }: { title: string; posts: Post[]; kind: 'upcoming' | 'published' | 'draft' | 'failed' }) {
  if (posts.length === 0) return null;
  return (
    <div>
      <h2
        className="text-lg font-bold text-foreground mb-3"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {title} <span className="text-muted text-sm font-normal">({posts.length})</span>
      </h2>
      <div className="space-y-2">
        {posts.map((post) => (
          <PostRow key={post.id} post={post} kind={kind} />
        ))}
      </div>
    </div>
  );
}

function PostRow({ post, kind }: { post: Post; kind: 'upcoming' | 'published' | 'draft' | 'failed' }) {
  const dim = kind === 'published' || kind === 'draft';
  return (
    <div
      className={`rounded-lg bg-card border p-4 flex items-start justify-between gap-4 flex-wrap ${
        kind === 'failed' ? 'border-danger/40' : 'border-border'
      } ${dim ? 'opacity-80' : ''}`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground line-clamp-2">
          {post.caption?.slice(0, 140) || <span className="text-muted italic">No caption</span>}
        </p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted flex-wrap">
          {kind === 'upcoming' && (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.scheduled_at ? new Date(post.scheduled_at).toLocaleString() : 'ASAP'}
            </span>
          )}
          {kind === 'published' && post.published_at && (
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-accent" />
              {new Date(post.published_at).toLocaleString()}
            </span>
          )}
          {kind === 'draft' && (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Draft
            </span>
          )}
          {kind === 'failed' && (
            <span className="inline-flex items-center gap-1 text-danger">
              <AlertCircle className="w-3 h-3" />
              {post.error_message ?? 'Failed'}
            </span>
          )}
          <span>·</span>
          <span>{post.slide_ids.length} slide{post.slide_ids.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {post.platforms.map((p) => (
          <span
            key={p}
            className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded font-medium"
          >
            {p.charAt(0) + p.slice(1).toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  );
}
