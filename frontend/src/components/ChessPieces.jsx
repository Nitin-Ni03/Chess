import React from 'react';

// Premium SVG Chess Piece Vector Set with rich gradients, outlines, and embossed highlights
export function ChessPiece({ piece, className = 'w-full h-full' }) {
  if (!piece) return null;
  const color = piece.color; // 'w' | 'b'
  const type = piece.type;   // 'p','n','b','r','q','k'
  const key = `${color}_${type}`;

  const isWhite = color === 'w';

  // Standard FIDE tournament vector paths
  switch (type) {
    case 'k':
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

    case 'q':
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

    case 'r':
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

    case 'b':
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

    case 'n':
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

    case 'p':
    default:
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
}
