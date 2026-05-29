import { Montserrat } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappButton from '@/components/WhatsappButton';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'Benítez Inmobiliaria | Tu mejor inversión empieza con Benítez',
  description: 'Venta, alquiler y alquiler temporario de propiedades residenciales, comerciales y emprendimientos exclusivos en Argentina. Av. Alvear 1700, Recoleta.',
  keywords: 'inmobiliaria, benitez, premium, recoleta, puerto madero, nordelta, alquiler, venta, departamentos, casas',
  robots: 'index, follow',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${montserrat.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24">
          {children}
        </main>
        <Footer />
        <WhatsappButton />
      </body>
    </html>
  );
}
