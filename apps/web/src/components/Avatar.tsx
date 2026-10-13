import { initials } from '../lib/format';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: number;
}

export function Avatar({ name, src, size = 40 }: AvatarProps) {
  const style = { width: size, height: size };
  if (src) {
    return <img className="avatar" style={style} src={src} alt={name} />;
  }
  return (
    <div className="avatar avatar-fallback" style={style} aria-hidden>
      {initials(name)}
    </div>
  );
}
