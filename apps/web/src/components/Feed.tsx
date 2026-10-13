import { useCallback, useEffect, useState } from 'react';
import { useApp } from '../app-context';
import type { Post } from '../lib/types';
import { Composer } from './Composer';
import { PostCard } from './PostCard';
import { SuggestedPractitioners } from './SuggestedPractitioners';

export function Feed() {
  const { api, toast } = useApp();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(async () => {
    try {
      const page = await api.getFeed();
      setPosts(page.items);
      setNextCursor(page.nextCursor);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not load feed');
      setPosts([]);
    }
  }, [api, toast]);

  useEffect(() => {
    setPosts(null);
    void load();
  }, [load]);

  async function loadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await api.getFeed(nextCursor);
      setPosts((prev) => [...(prev ?? []), ...page.items]);
      setNextCursor(page.nextCursor);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not load more');
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="layout">
      <div className="stream">
        <Composer onPosted={(post) => setPosts((prev) => [post, ...(prev ?? [])])} />

        {posts === null ? (
          <div className="card center-col" style={{ padding: 40 }}>
            <div className="spinner" />
          </div>
        ) : posts.length === 0 ? (
          <div className="card empty">
            Your feed is empty. Follow some practitioners or write the first post.
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}

        {nextCursor ? (
          <button
            className="btn"
            style={{ alignSelf: 'center' }}
            disabled={loadingMore}
            onClick={() => void loadMore()}
          >
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        ) : null}
      </div>

      <aside className="rail">
        <SuggestedPractitioners />
      </aside>
    </div>
  );
}
