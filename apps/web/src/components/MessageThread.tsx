import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../app-context';
import { formatClock } from '../lib/format';
import type { Conversation, Message } from '../lib/types';
import { Avatar } from './Avatar';

const PENDING_SEQ = Number.MAX_SAFE_INTEGER;

function sortMessages(list: Message[]): Message[] {
  return [...list].sort((a, b) => a.seq - b.seq);
}

export function MessageThread({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  const { api, me, socket, toast } = useApp();
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastTypingEmit = useRef(0);
  const typingTimer = useRef<number | null>(null);

  const others = useMemo(
    () => conversation.members.filter((m) => m.id !== me.id),
    [conversation.members, me.id],
  );

  const peerName = (senderId: string) =>
    conversation.members.find((m) => m.id === senderId)?.displayName ??
    (senderId === me.id ? 'You' : 'Someone');

  // Load history + join the room.
  useEffect(() => {
    let cancelled = false;
    setMessages(null);
    setDraft('');
    socket.emit('conversation:join', { conversationId: conversation.id });
    (async () => {
      try {
        const page = await api.getMessages(conversation.id);
        if (cancelled) return;
        setMessages(page.items);
        setNextCursor(page.nextCursor);
        const top = page.items.reduce((max, m) => Math.max(max, m.seq), 0);
        if (top > 0) socket.emit('message:read', { conversationId: conversation.id, seq: top });
      } catch (err) {
        if (!cancelled) {
          toast(err instanceof Error ? err.message : 'Could not load messages');
          setMessages([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api, conversation.id, socket, toast]);

  // Realtime listeners for this conversation.
  useEffect(() => {
    function onNew(message: Message) {
      if (message.conversationId !== conversation.id) return;
      setMessages((prev) => {
        if (!prev) return prev;
        // Reconcile an optimistic/local copy with the server's canonical row.
        const withoutPending = prev.filter(
          (m) => !(m.id.startsWith('local:') && m.clientMsgId === message.clientMsgId),
        );
        if (withoutPending.some((m) => m.id === message.id)) return withoutPending;
        return sortMessages([...withoutPending, message]);
      });
      socket.emit('message:read', { conversationId: conversation.id, seq: message.seq });
    }
    function onRead(payload: { conversationId: string }) {
      if (payload.conversationId === conversation.id) setTypingUser(null);
    }
    function onTyping(payload: { conversationId: string; userId: string }) {
      if (payload.conversationId !== conversation.id || payload.userId === me.id) return;
      setTypingUser(payload.userId);
      if (typingTimer.current) window.clearTimeout(typingTimer.current);
      typingTimer.current = window.setTimeout(() => setTypingUser(null), 3500);
    }
    socket.on('message:new', onNew);
    socket.on('read:update', onRead);
    socket.on('typing:update', onTyping);
    return () => {
      socket.off('message:new', onNew);
      socket.off('read:update', onRead);
      socket.off('typing:update', onTyping);
    };
  }, [conversation.id, me.id, socket]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function loadOlder() {
    if (!nextCursor || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const page = await api.getMessages(conversation.id, nextCursor);
      setMessages((prev) => sortMessages([...page.items, ...(prev ?? [])]));
      setNextCursor(page.nextCursor);
    } catch {
      toast('Could not load older messages');
    } finally {
      setLoadingOlder(false);
    }
  }

  function send() {
    const text = draft.trim();
    if (!text) return;
    const clientMsgId = crypto.randomUUID();
    const optimistic: Message = {
      id: `local:${clientMsgId}`,
      conversationId: conversation.id,
      senderId: me.id,
      body: text,
      seq: PENDING_SEQ,
      type: 'TEXT',
      createdAt: new Date().toISOString(),
      clientMsgId,
    };
    setMessages((prev) => sortMessages([...(prev ?? []), optimistic]));
    setDraft('');
    socket.emit(
      'message:send',
      { conversationId: conversation.id, body: text, clientMsgId },
      (res: { message?: Message; error?: string }) => {
        if (res?.error) toast(res.error);
      },
    );
  }

  function onDraftChange(value: string) {
    setDraft(value);
    const now = Date.now();
    if (now - lastTypingEmit.current > 1200) {
      lastTypingEmit.current = now;
      socket.emit('typing', { conversationId: conversation.id });
    }
  }

  const online = others[0]?.online;

  return (
    <section className="thread-col">
      <div className="thread-head">
        <button className="btn btn-ghost" onClick={onBack} aria-label="Back">
          ←
        </button>
        <Avatar name={conversation.title ?? 'Chat'} size={34} src={others[0]?.avatarUrl} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 650, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {conversation.title ?? 'Conversation'}
          </div>
          <div className="hint" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className={`online-dot ${online ? 'on' : ''}`} />
            {online ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      <div className="thread-scroll" ref={scrollRef}>
        {nextCursor ? (
          <button
            className="btn btn-ghost"
            style={{ alignSelf: 'center' }}
            disabled={loadingOlder}
            onClick={() => void loadOlder()}
          >
            {loadingOlder ? 'Loading…' : 'Load older'}
          </button>
        ) : null}

        {messages === null ? (
          <div className="hint" style={{ textAlign: 'center' }}>
            Loading messages…
          </div>
        ) : messages.length === 0 ? (
          <div className="hint" style={{ textAlign: 'center' }}>
            No messages yet. Say hello.
          </div>
        ) : (
          messages.map((m) => {
            const own = m.senderId === me.id;
            return (
              <div key={m.id} className={`msg ${own ? 'own' : ''}`}>
                {m.body}
                <div className="meta">
                  {own ? '' : `${peerName(m.senderId)} · `}
                  {m.id.startsWith('local:') ? 'sending…' : formatClock(m.createdAt)}
                </div>
              </div>
            );
          })
        )}
        {typingUser ? (
          <div className="typing" style={{ alignSelf: 'flex-start', padding: 0 }}>
            {peerName(typingUser)} is typing…
          </div>
        ) : null}
      </div>

      <div className="thread-composer">
        <textarea
          aria-label="Write a message"
          placeholder="Write a message…"
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button className="btn btn-primary" disabled={!draft.trim()} onClick={send}>
          Send
        </button>
      </div>
    </section>
  );
}
