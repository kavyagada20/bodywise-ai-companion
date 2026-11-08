import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bodywise AI Companion — Agentic Personal-Care Assistant',
  description: 'Your Personal Care Journey, Intelligently Managed. Multi-agent AI companion for Be Bodywise formulations, routines, and wellness.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F5F5EF] text-[#252D29] selection:bg-[#EDF3ED] selection:text-[#173F35]">
        {children}
      </body>
    </html>
  );
}
