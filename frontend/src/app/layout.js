import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'EntradaFácil · Gestión',
  description: 'Panel de gestión de EntradaFácil',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-fondo font-sans text-texto antialiased">
  <Navbar />
  <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
</body>
    </html>
  );
} 