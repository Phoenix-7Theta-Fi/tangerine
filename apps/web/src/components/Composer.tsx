import { useState } from 'react';
import { useApp } from '../app-context';
import type { Post } from '../lib/types';

export function Composer({ onPosted }: { onPosted: (post: Post) => void }) {
  const { api, toast } = useApp();
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    const text = body.trim();
    if (!text || busy) return;
    setBusy(true);
    try {
      const post = await api.createPost(text);
      onPosted(post);
      setBody('');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not post');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card composer">
      <textarea
        aria-label="Write a post"
        placeholder="Share something with the community…"
        value={body}
        maxLength={500}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') void submit();
        }}
      />
      <div className="composer-row">
        <span className="hint">{body.length}/500 · ⌘↵ to post</span>
        <button
          className="btn btn-primary"
          disabled={!body.trim() || busy}
          onClick={() => void submit()}
        >
          {busy ? 'Posting…' : 'Post'}
        </button>
      </div>
    </div>
  );
}
