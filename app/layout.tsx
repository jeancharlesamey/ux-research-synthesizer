import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UX Research Synthesizer',
  description: 'Turn raw interview notes into structured themes, quotes, and severity ratings in under 30 minutes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-50">
        {children}
      </body>
    </html>
  );
}
