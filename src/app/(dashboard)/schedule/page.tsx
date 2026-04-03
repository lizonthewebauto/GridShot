'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { Post } from '@/types';

export default function SchedulePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
        setLoading(false);
      });
  }, []);

  const scheduled = posts.filter((p) => p.status === 'scheduled');
  const published = posts.filter((p) => p.status === 'published');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Schedule</h1>
        <p className="text-muted mt-1">Manage your scheduled and published posts</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-lg bg-card border border-border p-12 text-center">
          <Calendar className="w-12 h-12 text-muted mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">
            No posts yet
          </h2>
          <p className="text-muted max-w-md mx-auto">
            Create a slide, export it, and then schedule it for posting to your connected social accounts.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {scheduled.length > 0 && (
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                Upcoming
              </h2>
              <div className="space-y-3">
                {scheduled.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-lg bg-card border border-border p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {post.caption?.slice(0, 80) || 'No caption'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-muted" />
                        <span className="text-xs text-muted">
                          {post.scheduled_at
                            ? new Date(post.scheduled_at).toLocaleString()
                            : 'ASAP'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {post.platforms.map((p) => (
                        <span
                          key={p}
                          className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded"
                        >
                          {p.charAt(0) + p.slice(1).toLowerCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {published.length > 0 && (
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                Published
              </h2>
              <div className="space-y-3">
                {published.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-lg bg-card border border-border p-4 flex items-center justify-between opacity-70"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {post.caption?.slice(0, 80) || 'No caption'}
                      </p>
                      <span className="text-xs text-muted">
                        Published {post.published_at ? new Date(post.published_at).toLocaleString() : ''}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {post.platforms.map((p) => (
                        <span
                          key={p}
                          className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded"
                        >
                          {p.charAt(0) + p.slice(1).toLowerCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
