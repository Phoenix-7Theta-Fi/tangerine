import { useEffect, useState } from 'react';
import { useApp } from '../app-context';
import type { User } from '../lib/types';
import { Avatar } from './Avatar';

export function SuggestedPractitioners() {
  const { api, toast, startChatWith, openProfile } = useApp();
  const [people, setPeople] = useState<User[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const page = await api.listUsers('&role=PRACTITIONER');
        if (!cancelled) setPeople(page.items.slice(0, 6));
      } catch {
        if (!cancelled) setPeople([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api]);

  async function toggleFollow(user: User) {
    const next = !user.isFollowing;
    setPeople((prev) =>
      (prev ?? []).map((p) => (p.id === user.id ? { ...p, isFollowing: next } : p)),
    );
    try {
      if (next) await api.follow(user.id);
      else await api.unfollow(user.id);
    } catch {
      setPeople((prev) =>
        (prev ?? []).map((p) =>
          p.id === user.id ? { ...p, isFollowing: !next } : p,
        ),
      );
      toast('Could not update follow');
    }
  }

  return (
    <div className="card">
      <h3 className="card-title">Practitioners to follow</h3>
      {people === null ? (
        <div className="hint">Loading…</div>
      ) : people.length === 0 ? (
        <div className="hint">No practitioners found.</div>
      ) : (
        people.map((p) => (
          <div className="suggest-row" key={p.id}>
            <Avatar name={p.displayName} src={p.avatarUrl} size={36} />
            <div className="suggest-info">
              <div
                className="name"
                style={{ cursor: 'pointer' }}
                onClick={() => openProfile(p.id)}
              >
                {p.displayName}
              </div>
              <div className="sub">{p.headline ?? `@${p.handle}`}</div>
            </div>
            <button
              className="btn btn-ghost"
              title="Message"
              onClick={() => startChatWith(p.id)}
            >
              ✉
            </button>
            <button
              className={`btn ${p.isFollowing ? '' : 'btn-primary'}`}
              style={{ padding: '6px 12px' }}
              onClick={() => void toggleFollow(p)}
            >
              {p.isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
