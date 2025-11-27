'use client';

import { useColorScheme } from '@mui/material';
import { useEffect } from 'react';
import './globals.module.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { mode, setMode } = useColorScheme();
  useEffect(() => {
    setMode('light');
  });
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
