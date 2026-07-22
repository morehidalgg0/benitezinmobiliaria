'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import Instagram from './Instagram';
import BrandLogo from './BrandLogo';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Ventas', href: '/propiedades?operation=VENTA' },
    { name: 'Alquileres', href: '/propiedades?operation=ALQUILER' },
    { name: 'Temporarios', href: '/propiedades?operation=ALQUILER_TEMPORARIO' },
    { name: 'Emprendimientos', href: '/emprendimientos' },
    { name: 'Contacto', href: '/contacto' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled || isOpen
          ? 'bg-brand border-b border-brand-dark/20 shadow-lg py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="group" aria-label="Benítez Inmobiliaria">
          <BrandLogo size="sm" compact className="transition-transform duration-300 group-hover:scale-[1.02]" />
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href.split('?')[0];
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm tracking-wider uppercase transition-colors duration-300 font-semibold ${
                  isActive
                    ? (scrolled ? 'text-brand-light underline underline-offset-4 decoration-2' : 'text-brand underline underline-offset-4 decoration-2')
                    : 'text-white hover:text-brand-light'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* SOCIALS & CONTACT */}
        <div className="hidden lg:flex items-center space-x-6">
          <a
            href="https://www.instagram.com/benitezinmobiliaria"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors duration-300"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="tel:2297409477"
            className="flex items-center text-sm text-white/90 hover:text-white transition-colors duration-300 font-semibold"
          >
            <Phone className="w-4 h-4 mr-2" />
            2297 40-9477
          </a>
          <a
            href="https://wa.me/5492297409477?text=Hola!%20Quiero%20hacer%20una%20consulta%20inmobiliaria."
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2 rounded text-xs tracking-wider uppercase flex items-center transition-all duration-300 font-bold ${
              scrolled
                ? 'bg-brand-dark hover:bg-brand-dark/80 text-white border border-brand-dark shadow-md'
                : 'bg-white hover:bg-brand-light text-brand border border-white shadow-md'
            }`}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </a>
        </div>

        {/* MOBILE MENU TRIGGER */}
        <button
          className="lg:hidden text-white hover:text-brand-light transition-colors duration-300"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="lg:hidden absolute top-[100%] left-0 w-full bg-brand border-b border-brand-dark/20 animate-fade-in shadow-2xl">
          <div className="px-6 py-8 flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base tracking-wider uppercase text-white hover:text-brand-light transition-colors font-bold"
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-white/20 pt-6 flex flex-col space-y-4">
              <a
                href="tel:2297409477"
                className="flex items-center text-white/90 hover:text-white font-bold"
              >
                <Phone className="w-5 h-5 mr-3" />
                2297 40-9477
              </a>
              <a
                href="https://wa.me/5492297409477?text=Hola!%20Quiero%20hacer%20una%20consulta%20inmobiliaria."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-dark text-white w-full justify-center py-3 rounded text-center tracking-wider uppercase flex items-center font-bold border border-brand-dark"
                onClick={() => setIsOpen(false)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </a>
              <a
                href="https://www.instagram.com/benitezinmobiliaria"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-white/80 hover:text-white transition-colors py-2 font-bold"
                onClick={() => setIsOpen(false)}
              >
                <Instagram className="w-5 h-5 mr-3" />
                Seguinos en Instagram
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
