import type { User } from '../lib/types';

interface TopBarProps {
  users: User[];
  userId: string;
  onUserChange: (id: string) => void;
  connected: boolean;
  screen: 'feed' | 'chat';
  onScreenChange: (screen: 'feed' | 'chat') => void;
}

export function TopBar({
  users,
  userId,
  onUserChange,
  connected,
  screen,
  onScreenChange,
}: TopBarProps) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="dot-mark" />
        Tangerine
      </div>
      <nav className="nav" aria-label="Sections">
        <button
          className={screen === 'feed' ? 'active' : ''}
          onClick={() => onScreenChange('feed')}
        >
          Feed
        </button>
        <button
          className={screen === 'chat' ? 'active' : ''}
          onClick={() => onScreenChange('chat')}
        >
          Chat
        </button>
      </nav>
      <div className="spacer" />
      <div className={`conn ${connected ? 'online' : ''}`} title="Realtime connection">
        <span className="dot" />
        {connected ? 'Live' : 'Offline'}
      </div>
      <label className="hint" htmlFor="user-switcher" style={{ marginLeft: 4 }}>
        Acting as
      </label>
      <select
        id="user-switcher"
        className="select"
        value={userId}
        onChange={(e) => onUserChange(e.target.value)}
      >
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.displayName} (@{u.handle}) · {u.role.toLowerCase()}
          </option>
        ))}
      </select>
    </header>
  );
}
