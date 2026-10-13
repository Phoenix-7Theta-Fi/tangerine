import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../app-context';
import { relativeTime } from '../lib/format';
import type { Conversation, Message } from '../lib/types';
import { Avatar } from './Avatar';
import { MessageThread } from './MessageThread';

export function Chat({
  activeConversationId,
  onActiveConversationChange,
}: {
  activeConversationId: string | null;
  onActiveConversationChange: (id: string | null) => void;
}) {
  const { api, me, users, socket, toast, startChatWith } = useApp();
  const [conversations, setConversations] = useState<Conversation[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await api.getConversations();
        if (!cancelled) setConversations(list);
      } catch (err) {
        if (!cancelled) {
          toast(err instanceof Error ? err.message : 'Could not load conversations');
          setConversations([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api, toast]);

  // Keep the conversation list fresh from realtime events.
  useEffect(() => {
    function onNew(message: Message) {
      setConversations((prev) => {
        if (!prev) return prev;
        const isActive = message.conversationId === activeConversationId;
        return prev
          .map((c) =>
            c.id === message.conversationId
              ? {
                  ...c,
                  lastMessage: {
                    body: message.body,
                    senderId: message.senderId,
                    createdAt: message.createdAt,
                  },
                  lastMessageAt: message.createdAt,
                  unreadCount:
                    isActive || message.senderId === me.id ? c.unreadCount : c.unreadCount + 1,
                }
              : c,
          )
          .sort(
            (a, b) =>
              new Date(b.lastMessageAt ?? 0).getTime() -
              new Date(a.lastMessageAt ?? 0).getTime(),
          );
      });
    }
    function onPresence(payload: { userId: string; online: boolean }) {
      setConversations((prev) =>
        (prev ?? []).map((c) => ({
          ...c,
          members: c.members.map((m) =>
            m.id === payload.userId ? { ...m, online: payload.online } : m,
          ),
        })),
      );
    }
    socket.on('message:new', onNew);
    socket.on('presence:update', onPresence);
    return () => {
      socket.off('message:new', onNew);
      socket.off('presence:update', onPresence);
    };
  }, [activeConversationId, me.id, socket]);

  const active = useMemo(
    () => conversations?.find((c) => c.id === activeConversationId) ?? null,
    [conversations, activeConversationId],
  );

  const others = users.filter((u) => u.id !== me.id).slice(0, 100);

  function select(id: string) {
    onActiveConversationChange(id);
    setConversations((prev) =>
      (prev ?? []).map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
    );
  }

  return (
    <div className={`chat ${active ? 'thread-open' : ''}`}>
      <div className="conv-col">
        <div className="col-head">
          <span>Messages</span>
          <select
            className="select"
            style={{ maxWidth: 150, padding: '5px 8px' }}
            value=""
            onChange={(e) => {
              if (e.target.value) startChatWith(e.target.value);
            }}
            aria-label="Start a new conversation"
          >
            <option value="">New message…</option>
            {others.map((u) => (
              <option key={u.id} value={u.id}>
                {u.displayName}
              </option>
            ))}
          </select>
        </div>
        <div className="conv-scroll">
          {conversations === null ? (
            <div className="hint" style={{ padding: 16 }}>
              Loading…
            </div>
          ) : conversations.length === 0 ? (
            <div className="empty">No conversations yet. Start one with “New message”.</div>
          ) : (
            conversations.map((c) => {
              const other = c.members.find((m) => m.id !== me.id);
              return (
                <button
                  key={c.id}
                  className={`conv-item ${c.id === activeConversationId ? 'active' : ''}`}
                  onClick={() => select(c.id)}
                >
                  <Avatar name={c.title ?? 'Chat'} src={other?.avatarUrl} size={40} />
                  <div className="conv-info">
                    <div className="top">
                      <span className="name">{c.title ?? 'Conversation'}</span>
                      <span className="time">
                        {c.lastMessageAt ? relativeTime(c.lastMessageAt) : ''}
                      </span>
                    </div>
                    <div className="preview">
                      {c.lastMessage
                        ? `${c.lastMessage.senderId === me.id ? 'You: ' : ''}${c.lastMessage.body}`
                        : 'No messages yet'}
                    </div>
                  </div>
                  {c.unreadCount > 0 ? <span className="unread">{c.unreadCount}</span> : null}
                </button>
              );
            })
          )}
        </div>
      </div>

      {active ? (
        <MessageThread conversation={active} onBack={() => onActiveConversationChange(null)} />
      ) : (
        <section className="thread-col center-col">
          <div className="empty">Select a conversation to start messaging.</div>
        </section>
      )}
    </div>
  );
}
