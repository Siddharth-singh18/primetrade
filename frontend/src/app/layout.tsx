import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TaskFlow | Minimal Task Management',
  description: 'Production-grade task management system built with Next.js and Express',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-zinc-100 min-h-screen selection:bg-[#7c3aed] selection:text-white`}>
        {children}
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
