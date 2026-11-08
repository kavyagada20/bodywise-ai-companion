import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bodywise AI Companion — Agentic Personal-Care Assistant',
  description: 'Your Personal Care Journey, Intelligently Managed. Multi-agent AI companion for Be Bodywise products, routines, and wellness.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fbf9fe] text-[#2d1d3a] selection:bg-[#ebdff3] selection:text-[#553267]">
        {children}
      </body>
    </html>
  );
}

