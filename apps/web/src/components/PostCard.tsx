import { useState } from 'react';
import { useApp } from '../app-context';
import { relativeTime } from '../lib/format';
import type { Comment, Post } from '../lib/types';
import { Avatar } from './Avatar';

export function PostCard({ post }: { post: Post }) {
  const { api, toast, openProfile, me } = useApp();
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);

  async function toggleLike() {
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    try {
      const res = next
        ? await api.likePost(post.id)
        : await api.unlikePost(post.id);
      setLiked(res.liked);
      setLikeCount(res.likeCount);
    } catch {
      setLiked(!next);
      setLikeCount((c) => c + (next ? -1 : 1));
      toast('Could not update like');
    }
  }

  async function toggleComments() {
    const next = !open;
    setOpen(next);
    if (next && comments === null) {
      try {
        setComments(await api.getComments(post.id));
      } catch {
        toast('Could not load comments');
        setComments([]);
      }
    }
  }

  async function addComment() {
    const text = draft.trim();
    if (!text || busy) return;
    setBusy(true);
    try {
      const comment = await api.addComment(post.id, text);
      setComments((prev) => [...(prev ?? []), comment]);
      setCommentCount((c) => c + 1);
      setDraft('');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not comment');
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="card">
      <div className="post">
        <button
          className="btn-ghost"
          style={{ padding: 0 }}
          onClick={() => openProfile(post.author.id)}
          aria-label={`Open ${post.author.displayName}'s profile`}
        >
          <Avatar name={post.author.displayName} src={post.author.avatarUrl} size={42} />
        </button>
        <div className="post-main">
          <div className="post-head">
            <span className="post-name" onClick={() => openProfile(post.author.id)}>
              {post.author.displayName}
            </span>
            <span className="handle">@{post.author.handle}</span>
            {post.author.role === 'PRACTITIONER' ? (
              <span className="role-tag">practitioner</span>
            ) : null}
            <span className="time">· {relativeTime(post.createdAt)}</span>
          </div>
          {post.author.headline ? (
            <div className="hint" style={{ fontSize: 12 }}>
              {post.author.headline}
            </div>
          ) : null}
          <div className="post-body">{post.body}</div>
          <div className="post-actions">
            <button
              className={`btn-ghost ${liked ? 'liked' : ''}`}
              onClick={() => void toggleLike()}
              aria-pressed={liked}
            >
              {liked ? '♥' : '♡'} {likeCount}
            </button>
            <button className="btn-ghost" onClick={() => void toggleComments()}>
              💬 {commentCount}
            </button>
          </div>

          {open ? (
            <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              {comments === null ? (
                <div className="hint">Loading comments…</div>
              ) : comments.length === 0 ? (
                <div className="hint">No comments yet. Be the first.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {comments.map((c) => (
                    <div key={c.id} style={{ display: 'flex', gap: 9 }}>
                      <Avatar name={c.author.displayName} src={c.author.avatarUrl} size={28} />
                      <div style={{ minWidth: 0 }}>
                        <div>
                          <strong>{c.author.displayName}</strong>{' '}
                          <span className="handle">@{c.author.handle}</span>{' '}
                          <span className="time">{relativeTime(c.createdAt)}</span>
                        </div>
                        <div>{c.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <input
                  className="select"
                  style={{ flex: 1, maxWidth: 'none' }}
                  placeholder={`Reply as ${me.displayName}…`}
                  value={draft}
                  aria-label="Add a comment"
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void addComment();
                  }}
                />
                <button
                  className="btn"
                  disabled={!draft.trim() || busy}
                  onClick={() => void addComment()}
                >
                  Reply
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
