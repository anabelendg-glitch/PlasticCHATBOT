import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Taller de Plástica',
  description: 'Chatbot Educativo - Profe de Plástica',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body className="antialiased font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
