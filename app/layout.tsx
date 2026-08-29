import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.ENVPLANE_SITE_ORIGIN ?? 'https://envplane.dev',
  ),
  title: 'Install envplane',
  description: 'A credential-free guided install for the signed stable envplane release.',
  openGraph: {
    title: 'Install envplane',
    description: 'One verified release. Your cluster.',
    type: 'website',
    url: '/install',
    images: [{ url: '/install-og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Install envplane',
    description: 'One verified release. Your cluster.',
    images: ['/install-og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
