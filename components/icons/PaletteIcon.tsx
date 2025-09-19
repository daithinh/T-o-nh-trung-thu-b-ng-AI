
import React from 'react';

export const PaletteIcon: React.FC<{ className?: string }> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.667 0-.424-.163-.833-.436-1.133-.39-.425-.854-.852-1.35-1.35-.494-.495-.923-.96-1.349-1.458-.425-.498-.851-.995-1.132-1.437-.28-.442-.435-.983-.435-1.667 0-1.667 1.333-3 3-3s3 1.333 3 3c0 .322-.054.646-.16.969-.265.823-.67 1.65-1.135 2.482-.466.832-.93 1.564-1.225 2.067-.295.503-.45 1.05-.45 1.667 0 1.667 1.333 3 3 3s3-1.333 3-3c0-1.29-.834-2.333-2-2.333" />
  </svg>
);
