import { useEffect, useState } from 'react';
import { useApp } from '../app-context';
import { relativeTime } from '../lib/format';
import type { Post, UserProfile } from '../lib/types';
import { Avatar } from './Avatar';

export function ProfileDrawer({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const { api, toast, startChatWith } = useApp();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [p, feed] = await Promise.all([
          api.getProfile(userId),
          api.getUserPosts(userId),
        ]);
        if (cancelled) return;
        setProfile(p);
        setPosts(feed.items);
      } catch (err) {
        if (!cancelled) toast(err instanceof Error ? err.message : 'Could not load profile');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api, userId, toast]);

  async function toggleFollow() {
    if (!profile) return;
    const next = !profile.isFollowing;
    setProfile({
      ...profile,
      isFollowing: next,
      followerCount: profile.followerCount + (next ? 1 : -1),
    });
    try {
      const res = next ? await api.follow(userId) : await api.unfollow(userId);
      setProfile((p) =>
        p ? { ...p, isFollowing: res.following, followerCount: res.followerCount } : p,
      );
    } catch {
      toast('Could not update follow');
    }
  }

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Profile">
        <div className="drawer-head">
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Avatar
              name={profile?.displayName ?? '…'}
              src={profile?.avatarUrl}
              size={56}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>
                {profile?.displayName ?? 'Loading…'}
              </div>
              <div className="handle">@{profile?.handle ?? '…'}</div>
              {profile?.role === 'PRACTITIONER' ? (
                <span className="role-tag">practitioner</span>
              ) : null}
            </div>
          </div>
          <button className="btn-ghost btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {profile ? (
          <>
            {profile.headline ? (
              <p style={{ marginTop: 14, color: 'var(--text-dim)' }}>{profile.headline}</p>
            ) : null}
            {profile.bio ? <p>{profile.bio}</p> : null}
            {profile.region ? <div className="hint">📍 {profile.region}</div> : null}

            <div className="stat-row">
              <div className="stat">
                <div className="num">{profile.followerCount}</div>
                <div className="lbl">Followers</div>
              </div>
              <div className="stat">
                <div className="num">{profile.followingCount}</div>
                <div className="lbl">Following</div>
              </div>
              <div className="stat">
                <div className="num">{profile.postCount}</div>
                <div className="lbl">Posts</div>
              </div>
            </div>

            {!profile.isSelf ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className={`btn ${profile.isFollowing ? '' : 'btn-primary'}`}
                  style={{ flex: 1 }}
                  onClick={() => void toggleFollow()}
                >
                  {profile.isFollowing ? 'Following' : 'Follow'}
                </button>
                <button
                  className="btn"
                  style={{ flex: 1 }}
                  onClick={() => startChatWith(profile.id)}
                >
                  Message
                </button>
              </div>
            ) : null}

            <h3 className="card-title" style={{ marginTop: 24 }}>
              Posts
            </h3>
            {posts.length === 0 ? (
              <div className="hint">No posts yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {posts.map((post) => (
                  <div key={post.id} style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <div className="hint" style={{ fontSize: 12 }}>
                      {relativeTime(post.createdAt)} · ♥ {post.likeCount} · 💬 {post.commentCount}
                    </div>
                    <div style={{ marginTop: 4 }}>{post.body}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="spinner" style={{ margin: '40px auto' }} />
        )}
      </aside>
    </>
  );
}
