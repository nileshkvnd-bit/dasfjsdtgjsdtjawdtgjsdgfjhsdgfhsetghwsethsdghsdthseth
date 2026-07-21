// Deterministic pseudo-random so server and client render identical
// ember positions (avoids React hydration mismatches).
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seededRandom(42);
const EMBERS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(rand() * 100).toFixed(1)}%`,
  duration: `${(rand() * 10 + 10).toFixed(1)}s`,
  delay: `${(rand() * 14).toFixed(1)}s`,
  drift: `${(rand() * 60 - 30).toFixed(0)}px`,
  size: `${(rand() * 2 + 2).toFixed(1)}px`,
}));

export default function Backdrop() {
  return (
    <div className="kyron-backdrop" aria-hidden="true">
      <div className="kyron-storm-wrap">
        <div className="kyron-storm" />
      </div>
      <div className="kyron-grid" />
      <div className="kyron-flash" />
      <div className="kyron-flash-2" />
      {EMBERS.map((e) => (
        <span
          key={e.id}
          className="kyron-ember"
          style={
            {
              left: e.left,
              width: e.size,
              height: e.size,
              animationDuration: e.duration,
              animationDelay: e.delay,
              "--drift": e.drift,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
