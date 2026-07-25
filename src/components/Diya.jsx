import React from 'react';

// A brass diya (oil lamp) with a marigold flame — the recurring motif.
export const Diya = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 22"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M12 1.5c.9 2.6 3.3 4 3.3 6.9a3.3 3.3 0 0 1-6.6 0c0-1.3.5-2.3 1.3-3.2.06 1.05.62 1.75 1.25 1.75.62 0 .97-.62.97-1.5 0-1.45-.66-2.75-.19-3.95z"
      fill="var(--genda)"
    />
    <path
      d="M3.6 12.4h16.8c-.5 2.45-2.6 4.15-5.1 4.15H8.7c-2.5 0-4.6-1.7-5.1-4.15z"
      fill="var(--peetal)"
    />
    <path
      d="M8.8 18.3h6.4"
      stroke="var(--peetal)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Just the flame, in currentColor — used as the "lit" marker beside a deity.
export const Flame = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M12 2c1.15 3 4 4.7 4 8a4 4 0 0 1-8 0c0-1.7.65-2.85 1.6-3.9.06 1.35.78 2.15 1.5 2.15.75 0 1.1-.78 1.1-1.85 0-1.75-.82-3.25-.2-4.55z"
      fill="currentColor"
    />
  </svg>
);
