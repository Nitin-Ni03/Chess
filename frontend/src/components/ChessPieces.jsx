import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// CLASSIC SVG PIECES  (standard FIDE tournament vectors)
// ─────────────────────────────────────────────────────────────────────────────
function ClassicKing({ isWhite, className }) {
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={isWhite ? '#ffffff' : '#1e1e24'} stroke={isWhite ? '#202020' : '#d1d5db'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.5 11.63V6M20 8h5" stroke={isWhite ? '#202020' : '#e5e7eb'} />
        <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill={isWhite ? '#ffffff' : '#222228'} />
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V23.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z" fill={isWhite ? '#f8fafc' : '#1c1c22'} />
        <path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0M11.5 37c5.5-3 15.5-3 21 0" stroke={isWhite ? '#333' : '#9ca3af'} />
        <path d="M32 29.5c.5-2.5 3-4.5 4.5-4.5" stroke={isWhite ? '#555' : '#71717a'} />
        <path d="M12 29.5c-.5-2.5-3-4.5-4.5-4.5" stroke={isWhite ? '#555' : '#71717a'} />
      </g>
    </svg>
  );
}

function ClassicQueen({ isWhite, className }) {
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={isWhite ? '#ffffff' : '#1e1e24'} stroke={isWhite ? '#202020' : '#d1d5db'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="12" r="2.75" />
        <circle cx="14" cy="9" r="2.75" />
        <circle cx="22.5" cy="8" r="2.75" />
        <circle cx="31" cy="9" r="2.75" />
        <circle cx="39" cy="12" r="2.75" />
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-7.5-14-7.5 14-7-11 2 12z" fill={isWhite ? '#ffffff' : '#222228'} />
        <path d="M9 26c0 2 1.5 2 2.5 4 2.5 4 1 8.5 1 8.5h20s-1.5-4.5 1-8.5c1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill={isWhite ? '#f8fafc' : '#1c1c22'} />
        <path d="M11 38.5a35 35 1 0 0 23 0" stroke={isWhite ? '#444' : '#9ca3af'} />
        <path d="M11 29a35 35 1 0 1 23 0M12.5 31.5a35 35 1 0 1 20 0M11.5 34.5a35 35 1 0 1 22 0M10.5 37.5a35 35 1 0 1 24 0" stroke={isWhite ? '#333' : '#a1a1aa'} />
      </g>
    </svg>
  );
}

function ClassicRook({ isWhite, className }) {
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={isWhite ? '#ffffff' : '#1e1e24'} stroke={isWhite ? '#202020' : '#d1d5db'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" fill={isWhite ? '#ffffff' : '#222228'} />
        <path d="M34 14l-3 3H14l-3-3" />
        <path d="M31 17v12.5H14V17" fill={isWhite ? '#f8fafc' : '#1c1c22'} />
        <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" />
        <path d="M11 14h23" stroke={isWhite ? '#333' : '#9ca3af'} />
      </g>
    </svg>
  );
}

function ClassicBishop({ isWhite, className }) {
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={isWhite ? '#ffffff' : '#1e1e24'} stroke={isWhite ? '#202020' : '#d1d5db'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" fill={isWhite ? '#f8fafc' : '#1c1c22'} />
        <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" fill={isWhite ? '#ffffff' : '#222228'} />
        <circle cx="22.5" cy="8" r="2" />
        <path d="M17.5 26h10M15 30h15M22.5 15.5v5M20 18h5" stroke={isWhite ? '#333' : '#9ca3af'} />
      </g>
    </svg>
  );
}

function ClassicKnight({ isWhite, className }) {
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={isWhite ? '#ffffff' : '#1e1e24'} stroke={isWhite ? '#202020' : '#d1d5db'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill={isWhite ? '#f8fafc' : '#1c1c22'} />
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.932 1.39-2 2-1 0-.962-1.07-2-1-1 0-.75.75-2 .5-.5-.5-1.05-1.5-1-2.5s2.5-2.5 3.5-3c1-.5 1.5-1 1.5-1.5 0-.5.5-.5.5-1 0-.5 1.5-2.5 3-4 2-2 3.5-3 5.5-4.5 1.5-1.12 3-1.63 4.5-1.5.89.07 1.5.5 2 1z" fill={isWhite ? '#ffffff' : '#222228'} />
        <circle cx="9.5" cy="25.5" r="1" fill={isWhite ? '#222' : '#e5e7eb'} stroke="none" />
        <path d="M15 15.5s1.5-1.5 3-1.5M24.55 10.4s2.5 1.5 3 4M28 22s4 1.5 6 1" stroke={isWhite ? '#444' : '#9ca3af'} />
      </g>
    </svg>
  );
}

function ClassicPawn({ isWhite, className }) {
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={isWhite ? '#ffffff' : '#1e1e24'} stroke={isWhite ? '#202020' : '#d1d5db'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill={isWhite ? '#ffffff' : '#222228'} />
        <path d="M12 36.5c3.5-1.5 17.5-1.5 21 0" stroke={isWhite ? '#333' : '#9ca3af'} />
        <path d="M16 26c2-1 11-1 13 0" stroke={isWhite ? '#444' : '#9ca3af'} />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED THEMED PIECE BASE
// ─────────────────────────────────────────────────────────────────────────────

/** Renders an emoji-based chess piece inside a shaped SVG badge */
function ThemedPiece({ emoji, label, shape, primaryColor, accentColor, bgGradientId, gradStops, className }) {
  const uid = `${bgGradientId}-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={uid} cx="50%" cy="40%" r="60%">
          {gradStops.map((s, i) => (
            <stop key={i} offset={s.offset} stopColor={s.color} />
          ))}
        </radialGradient>
        <filter id={`glow-${uid}`} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Shape background */}
      {shape === 'hex' && (
        <polygon
          points="22.5,4 39,13.5 39,31.5 22.5,41 6,31.5 6,13.5"
          fill={`url(#${uid})`}
          stroke={accentColor}
          strokeWidth="1.5"
          filter={`url(#glow-${uid})`}
        />
      )}
      {shape === 'circle' && (
        <circle
          cx="22.5" cy="22.5" r="18"
          fill={`url(#${uid})`}
          stroke={accentColor}
          strokeWidth="1.5"
          filter={`url(#glow-${uid})`}
        />
      )}
      {shape === 'shield' && (
        <path
          d="M22.5 3 L40 11 L40 26 Q40 36 22.5 42 Q5 36 5 26 L5 11 Z"
          fill={`url(#${uid})`}
          stroke={accentColor}
          strokeWidth="1.5"
          filter={`url(#glow-${uid})`}
        />
      )}

      {/* Inner accent ring */}
      {shape === 'hex' && (
        <polygon
          points="22.5,8 36,15.5 36,29.5 22.5,37 9,29.5 9,15.5"
          fill="none"
          stroke={`${accentColor}55`}
          strokeWidth="0.7"
        />
      )}
      {shape === 'circle' && (
        <circle cx="22.5" cy="22.5" r="13.5" fill="none" stroke={`${accentColor}55`} strokeWidth="0.7" />
      )}

      {/* Emoji character */}
      <text
        x="22.5"
        y="25"
        textAnchor="middle"
        fontSize="17"
        fontFamily="'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif"
        dominantBaseline="middle"
      >
        {emoji}
      </text>

      {/* Name label */}
      <text
        x="22.5"
        y="40"
        textAnchor="middle"
        fontSize="3.6"
        fill={accentColor}
        fontFamily="'Arial Narrow','Arial',sans-serif"
        fontWeight="bold"
        letterSpacing="0.3"
      >
        {label}
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MARVEL AVENGERS THEME  (White = Avengers | Black = Villains)
// ─────────────────────────────────────────────────────────────────────────────
const MARVEL_AVENGERS_MAP = {
  k: { wEmoji: '🤖', wLabel: 'IRON MAN',   bEmoji: '💜', bLabel: 'THANOS' },
  q: { wEmoji: '⚡', wLabel: 'THOR',        bEmoji: '🐍', bLabel: 'LOKI' },
  r: { wEmoji: '🛡️', wLabel: 'CAP AM.',    bEmoji: '💀', bLabel: 'RED SKULL' },
  b: { wEmoji: '🔮', wLabel: 'DR STRANGE', bEmoji: '🔴', bLabel: 'SCARLET W.' },
  n: { wEmoji: '🐾', wLabel: 'B.PANTHER',  bEmoji: '🕸️', bLabel: 'VENOM' },
  p: { wEmoji: '⭐', wLabel: 'SHIELD',     bEmoji: '🐙', bLabel: 'HYDRA' },
};

function MarvelAvengersPiece({ piece, className }) {
  const { type, color } = piece;
  const isWhite = color === 'w';
  const map = MARVEL_AVENGERS_MAP[type] || MARVEL_AVENGERS_MAP['p'];
  return (
    <ThemedPiece
      emoji={isWhite ? map.wEmoji : map.bEmoji}
      label={isWhite ? map.wLabel : map.bLabel}
      shape="hex"
      accentColor={isWhite ? '#fbbf24' : '#dc2626'}
      bgGradientId={isWhite ? 'avenger-w' : 'avenger-b'}
      gradStops={
        isWhite
          ? [{ offset: '0%', color: '#1e3a8a' }, { offset: '100%', color: '#0f172a' }]
          : [{ offset: '0%', color: '#7f1d1d' }, { offset: '100%', color: '#1a0000' }]
      }
      className={className}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MARVEL X-MEN THEME  (White = X-Men | Black = Brotherhood)
// ─────────────────────────────────────────────────────────────────────────────
const MARVEL_XMEN_MAP = {
  k: { wEmoji: '🌀', wLabel: 'PROF. X',    bEmoji: '🧲', bLabel: 'MAGNETO' },
  q: { wEmoji: '👁️', wLabel: 'CYCLOPS',   bEmoji: '🌪️', bLabel: 'MYSTIQUE' },
  r: { wEmoji: '🐺', wLabel: 'WOLVERINE',  bEmoji: '⚡', bLabel: 'SABRETOOTH' },
  b: { wEmoji: '🌩️', wLabel: 'STORM',     bEmoji: '😈', bLabel: 'PYRO' },
  n: { wEmoji: '🔵', wLabel: 'BEAST',      bEmoji: '🐸', bLabel: 'TOAD' },
  p: { wEmoji: '⚔️', wLabel: 'X-MAN',     bEmoji: '💥', bLabel: 'BROTHERHOOD' },
};

function MarvelXMenPiece({ piece, className }) {
  const { type, color } = piece;
  const isWhite = color === 'w';
  const map = MARVEL_XMEN_MAP[type] || MARVEL_XMEN_MAP['p'];
  return (
    <ThemedPiece
      emoji={isWhite ? map.wEmoji : map.bEmoji}
      label={isWhite ? map.wLabel : map.bLabel}
      shape="shield"
      accentColor={isWhite ? '#facc15' : '#a855f7'}
      bgGradientId={isWhite ? 'xmen-w' : 'xmen-b'}
      gradStops={
        isWhite
          ? [{ offset: '0%', color: '#312e81' }, { offset: '100%', color: '#1e1b4b' }]
          : [{ offset: '0%', color: '#4a1d96' }, { offset: '100%', color: '#1a0a2e' }]
      }
      className={className}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NARUTO THEME  (White = Leaf Village | Black = Akatsuki)
// ─────────────────────────────────────────────────────────────────────────────
const NARUTO_MAP = {
  k: { wEmoji: '🦊', wLabel: 'NARUTO',    bEmoji: '👁️', bLabel: 'PAIN' },
  q: { wEmoji: '💊', wLabel: 'SAKURA',    bEmoji: '📜', bLabel: 'KONAN' },
  r: { wEmoji: '📖', wLabel: 'KAKASHI',   bEmoji: '🌊', bLabel: 'KISAME' },
  b: { wEmoji: '🐸', wLabel: 'JIRAIYA',   bEmoji: '🐍', bLabel: 'OROCHIMARU' },
  n: { wEmoji: '🥋', wLabel: 'ROCK LEE',  bEmoji: '💣', bLabel: 'DEIDARA' },
  p: { wEmoji: '🍃', wLabel: 'GENIN',     bEmoji: '🌧️', bLabel: 'AKATSUKI' },
};

function NarutoPiece({ piece, className }) {
  const { type, color } = piece;
  const isWhite = color === 'w';
  const map = NARUTO_MAP[type] || NARUTO_MAP['p'];
  return (
    <ThemedPiece
      emoji={isWhite ? map.wEmoji : map.bEmoji}
      label={isWhite ? map.wLabel : map.bLabel}
      shape="circle"
      accentColor={isWhite ? '#4ade80' : '#f43f5e'}
      bgGradientId={isWhite ? 'naruto-w' : 'naruto-b'}
      gradStops={
        isWhite
          ? [{ offset: '0%', color: '#15803d' }, { offset: '100%', color: '#052e16' }]
          : [{ offset: '0%', color: '#881337' }, { offset: '100%', color: '#1a0005' }]
      }
      className={className}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTER EXPORT — theme-aware dispatcher
// ─────────────────────────────────────────────────────────────────────────────
export function ChessPiece({ piece, className = 'w-full h-full', theme = 'classic' }) {
  if (!piece) return null;

  const isWhite = piece.color === 'w';
  const type = piece.type;

  if (theme === 'marvel-avengers') return <MarvelAvengersPiece piece={piece} className={className} />;
  if (theme === 'marvel-xmen')     return <MarvelXMenPiece piece={piece} className={className} />;
  if (theme === 'naruto')          return <NarutoPiece piece={piece} className={className} />;

  // Classic SVG (default)
  switch (type) {
    case 'k': return <ClassicKing isWhite={isWhite} className={className} />;
    case 'q': return <ClassicQueen isWhite={isWhite} className={className} />;
    case 'r': return <ClassicRook isWhite={isWhite} className={className} />;
    case 'b': return <ClassicBishop isWhite={isWhite} className={className} />;
    case 'n': return <ClassicKnight isWhite={isWhite} className={className} />;
    case 'p':
    default:  return <ClassicPawn isWhite={isWhite} className={className} />;
  }
}
