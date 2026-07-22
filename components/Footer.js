import Link from 'next/link';
import { Mail, MapPin, Phone, MessageCircle, Shield } from 'lucide-react';
import Instagram from './Instagram';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0c0c0c] border-t border-neutral-900 pt-20 pb-8 text-neutral-400">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* COL 1: BRAND */}
        <div className="flex flex-col space-y-6">
          <BrandLogo size="sm" compact />
          <p className="text-sm leading-relaxed">
            Especialistas en propiedades residenciales, comerciales y emprendimientos de alta gama.
            Brindamos soluciones integrales y asesoramiento de excelencia en el mercado inmobiliario premium.
          </p>
          <span className="text-xs italic text-brand font-medium">
            &quot;Tu mejor inversión empieza con Benítez.&quot;
          </span>
        </div>

        {/* COL 2: QUICK LINKS */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-white font-semibold text-sm tracking-widest uppercase">
            Navegación
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/" className="hover:text-brand transition-colors duration-300">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/propiedades?operation=VENTA" className="hover:text-brand transition-colors duration-300">
                Propiedades en Venta
              </Link>
            </li>
            <li>
              <Link href="/propiedades?operation=ALQUILER" className="hover:text-brand transition-colors duration-300">
                Propiedades en Alquiler
              </Link>
            </li>
            <li>
              <Link href="/emprendimientos" className="hover:text-brand transition-colors duration-300">
                Emprendimientos en Pozo
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-brand transition-colors duration-300">
                Contacto / Oficinas
              </Link>
            </li>
          </ul>
        </div>

        {/* COL 3: CONTACT DETAILS */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-white font-semibold text-sm tracking-widest uppercase">
            Contacto
          </h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start">
              <MapPin className="w-5 h-5 mr-3 text-brand shrink-0 mt-0.5" />
              <span>Av. Alvear 1700, Recoleta, CABA, Argentina</span>
            </li>
            <li className="flex items-center">
              <Phone className="w-5 h-5 mr-3 text-brand shrink-0" />
              <a href="tel:2297409477" className="hover:text-white transition-colors">
                2297 40-9477
              </a>
            </li>
            <li className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-3 text-brand shrink-0" />
              <a
                href="https://wa.me/5492297409477"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                +54 9 2297 40-9477
              </a>
            </li>
            <li className="flex items-center">
              <Mail className="w-5 h-5 mr-3 text-brand shrink-0" />
              <a href="mailto:info@benitezinmobiliaria.com.ar" className="hover:text-white transition-colors">
                info@benitezinmobiliaria.com.ar
              </a>
            </li>
          </ul>
        </div>

        {/* COL 4: MAP PLACEHOLDER */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-white font-semibold text-sm tracking-widest uppercase">
            Ubicación
          </h4>
          <div className="w-full h-40 rounded-lg overflow-hidden border border-neutral-800 shadow-inner relative group">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.858079203923!2d-58.39045768423696!3d-34.58887966387807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccab221c5f3b7%3A0xc00f135b1bf4101e!2sAv.%20Alvear%201700%2C%20C1014%20CABA%2C%20Argentina!5e0!3m2!1ses-419!2sar!4v1653300000000!5m2!1ses-419!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Oficinas Benítez Inmobiliaria"
            ></iframe>
            <div className="absolute inset-0 bg-brand-primary/5 pointer-events-none group-hover:bg-transparent transition-colors duration-300"></div>
          </div>
        </div>
      </div>

      {/* FOOTER BAR */}
      <div className="max-w-7xl mx-auto px-6 border-t border-neutral-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <p>© {currentYear} Benítez Inmobiliaria. Todos los derechos reservados.</p>
        <div className="flex items-center space-x-6">
          <a
            href="https://www.instagram.com/benitezinmobiliaria"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center"
          >
            <Instagram className="w-4 h-4 mr-1 text-brand" />
            Instagram
          </a>
          <Link href="/admin/login" className="hover:text-white transition-colors flex items-center text-neutral-500 hover:text-brand">
            <Shield className="w-4 h-4 mr-1" />
            Acceso Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
