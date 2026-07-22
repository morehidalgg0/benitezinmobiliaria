'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle, MessageCircle } from 'lucide-react';
import Instagram from '@/components/Instagram';

function ContactFormContent() {
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Rellenar mensaje inicial si hay una consulta sobre un emprendimiento en particular
  useEffect(() => {
    const subject = searchParams.get('subject');
    if (subject) {
      setMessage(`Hola! Deseo recibir información adicional sobre el ${subject}.`);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setError(data.error || 'Ocurrió un error al procesar la solicitud.');
      }
    } catch (err) {
      setError('Error de conexión. Intente nuevamente en unos instantes.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* HEADER BANNER */}
      <div className="border-b border-neutral-900 pb-8 mb-12">
        <span className="text-brand tracking-[0.2em] text-xs font-semibold uppercase">
          Comuníquese con nosotros
        </span>
        <h1 className="text-3xl font-extrabold text-neutral-100 uppercase tracking-wider mt-2">
          Contacto y Oficinas
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* COL 1: OFICINAS Y REDES (5/12) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-neutral-900 border border-neutral-850 rounded-lg p-8 space-y-6">
            <h2 className="text-neutral-100 font-bold text-base tracking-widest uppercase border-l-2 border-brand pl-3">
              Nuestra Oficina
            </h2>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Lo esperamos en nuestro local de Pinamar para brindarle asesoramiento inmobiliario personalizado.
            </p>

            <ul className="space-y-4 text-xs text-neutral-300">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-brand shrink-0 mt-0.5" />
                <span>De la Corvina 1296 Loc 7, B7167 Pinamar, Provincia de Buenos Aires</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-brand shrink-0" />
                <a href="tel:2297409477" className="hover:text-brand transition-colors">
                  2297 40-9477
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-brand shrink-0" />
                <a href="mailto:info@benitezinmobiliaria.com.ar" className="hover:text-brand transition-colors">
                  info@benitezinmobiliaria.com.ar
                </a>
              </li>
              <li className="flex items-start">
                <Clock className="w-5 h-5 mr-3 text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-neutral-100">Horario de Atención:</p>
                  <p className="text-neutral-400 mt-0.5">Lunes a Viernes: 9:00 a 19:00 hs</p>
                  <p className="text-neutral-400">Sábados: 9:30 a 13:00 hs</p>
                </div>
              </li>
            </ul>

            <div className="border-t border-neutral-850 pt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/5492297409477"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-black font-semibold px-4 py-2.5 rounded text-center text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:scale-[1.02] transition-all duration-300 grow"
              >
                <MessageCircle className="w-4 h-4 fill-black text-white" />
                WhatsApp
              </a>
              <a
                href="https://www.instagram.com/benitezinmobiliaria"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-brand px-4 py-2.5 rounded text-center text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all grow"
              >
                <Instagram className="w-4 h-4 text-brand" />
                Instagram
              </a>
            </div>
          </div>

          {/* GOOGLE MAPS CARD */}
          <div className="w-full h-80 rounded-lg overflow-hidden border border-neutral-850 shadow-lg relative group">
            <iframe
              src="https://www.google.com/maps?q=Benitez%20inmobiliaria%20pinamar%2C%20De%20la%20Corvina%201296%20Loc%207%2C%20B7167%20Pinamar%2C%20Provincia%20de%20Buenos%20Aires&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dirección de la inmobiliaria"
            ></iframe>
            <div className="absolute inset-0 bg-brand-primary/5 pointer-events-none group-hover:bg-transparent transition-colors duration-300"></div>
          </div>
        </div>

        {/* COL 2: FORMULARIO (7/12) */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-850 rounded-lg p-8">
          <h2 className="text-neutral-100 font-bold text-base tracking-widest uppercase border-l-2 border-brand pl-3 mb-8">
            Envíenos un mensaje
          </h2>

          {success ? (
            <div className="bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 rounded-lg p-8 flex flex-col items-center text-center space-y-4">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
              <h3 className="text-base font-bold uppercase tracking-wider">Mensaje Enviado con Éxito</h3>
              <p className="text-xs leading-relaxed text-neutral-400 max-w-sm">
                Hemos recibido sus datos y consulta en nuestro sistema. A la brevedad, uno de nuestros asesores comerciales se contactará con usted. Gracias por elegirnos.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="btn-outline-brand px-6 py-2.5 rounded text-xs uppercase tracking-wider font-semibold mt-4"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-950/30 border border-red-500/20 text-red-400 text-xs rounded p-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded px-4 py-3.5 text-neutral-100"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded px-4 py-3.5 text-neutral-100"
                    placeholder="Ej. 11 9876 5432"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded px-4 py-3.5 text-neutral-100"
                  placeholder="Ej. juan@correo.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Mensaje o Consulta
                </label>
                <textarea
                  rows="6"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded px-4 py-3.5 text-neutral-100 resize-none"
                  placeholder="Escriba aquí los detalles de su consulta inmobiliaria..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-brand w-full py-4 rounded text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                {sending ? 'Procesando...' : 'Enviar Mensaje'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-20 text-center text-neutral-500">Cargando formulario...</div>}>
      <ContactFormContent />
    </Suspense>
  );
}
