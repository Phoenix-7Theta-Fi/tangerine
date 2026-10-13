import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppContext } from './app-context';
import { createApi, listIdentities } from './lib/api';
import { createSocket } from './lib/socket';
import type { User } from './lib/types';
import { TopBar } from './components/TopBar';
import { Feed } from './components/Feed';
import { Chat } from './components/Chat';
import { ProfileDrawer } from './components/ProfileDrawer';

type Screen = 'feed' | 'chat';

const STORAGE_KEY = 'tangerine.userId';

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>('feed');
  const [connected, setConnected] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null,
  );
  const [bootError, setBootError] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const toast = useCallback((message: string) => {
    setToastMsg(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 4000);
  }, []);

  // Bootstrap identities (mock auth: there is no login, we pick an identity).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const identities = await listIdentities();
        if (cancelled) return;
        if (identities.length === 0) {
          setBootError('No users found. Run the seed: pnpm db:seed');
          return;
        }
        setUsers(identities);
        const stored = localStorage.getItem(STORAGE_KEY);
        const initial =
          identities.find((u) => u.id === stored)?.id ?? identities[0].id;
        setUserId(initial);
      } catch (err) {
        if (!cancelled) {
          setBootError(
            err instanceof Error ? err.message : 'Could not reach the API',
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const me = useMemo(
    () => users.find((u) => u.id === userId) ?? null,
    [users, userId],
  );

  const api = useMemo(() => createApi(userId ?? ''), [userId]);
  const socket = useMemo(
    () => (userId ? createSocket(userId) : null),
    [userId],
  );

  useEffect(() => {
    if (!socket) return;
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    const heartbeat = window.setInterval(
      () => socket.emit('presence:heartbeat'),
      30000,
    );
    return () => {
      window.clearInterval(heartbeat);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
      setConnected(false);
    };
  }, [socket]);

  const changeUser = useCallback((id: string) => {
    localStorage.setItem(STORAGE_KEY, id);
    setActiveConversationId(null);
    setProfileId(null);
    setUserId(id);
  }, []);

  const startChatWith = useCallback(
    async (otherUserId: string) => {
      try {
        const conv = await api.startDirect(otherUserId);
        setActiveConversationId(conv.id);
        setProfileId(null);
        setScreen('chat');
      } catch (err) {
        toast(err instanceof Error ? err.message : 'Could not start chat');
      }
    },
    [api, toast],
  );

  if (bootError) {
    return (
      <div className="center-col">
        <div className="card" style={{ maxWidth: 420 }}>
          <h2 style={{ marginTop: 0 }}>Tangerine</h2>
          <p style={{ color: 'var(--text-dim)' }}>{bootError}</p>
          <p className="hint">
            Start Postgres + Redis with <code>pnpm infra:up</code>, then run the
            API.
          </p>
        </div>
      </div>
    );
  }

  if (!userId || !me || !socket) {
    return (
      <div className="center-col">
        <div className="spinner" />
        <p className="hint" style={{ marginTop: 12 }}>
          Loading Tangerine…
        </p>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        api,
        me,
        users,
        socket,
        connected,
        toast,
        startChatWith: (id) => void startChatWith(id),
        openProfile: setProfileId,
      }}
    >
      <div className="app">
        <TopBar
          users={users}
          userId={userId}
          onUserChange={changeUser}
          connected={connected}
          screen={screen}
          onScreenChange={setScreen}
        />
        {screen === 'feed' ? (
          <Feed />
        ) : (
          <Chat
            activeConversationId={activeConversationId}
            onActiveConversationChange={setActiveConversationId}
          />
        )}
      </div>
      {profileId ? (
        <ProfileDrawer userId={profileId} onClose={() => setProfileId(null)} />
      ) : null}
      {toastMsg ? <div className="toast">{toastMsg}</div> : null}
    </AppContext.Provider>
  );
}
