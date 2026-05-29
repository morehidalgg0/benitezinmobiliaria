'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsappButton() {
  const whatsappUrl = 'https://wa.me/5492297409477?text=Hola!%20Me%20contacto%20desde%20la%20web%20para%20realizar%20una%20consulta.';

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Pulse effect rings */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-25 animate-ping"></span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 border border-white/10"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white text-green-500" />
      </a>
      
      {/* Tooltip */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-black/90 text-white text-xs tracking-wider uppercase font-semibold px-3 py-1.5 rounded border border-neutral-800 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
        Consúltanos en línea
      </div>
    </div>
  );
}
