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
        <nav className="bg-white shadow-sm border-b border-brand-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-xl font-bold text-brand-900">
              UX Research Synthesizer
            </h1>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
