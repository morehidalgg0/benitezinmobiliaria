'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Bed, Bath, Maximize2, MapPin, MessageCircle, Phone, ArrowLeft, Send, CheckCircle } from 'lucide-react';

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [imagesList, setImagesList] = useState([]);

  // Formulario de contacto
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`);
        const data = await response.json();
        
        if (response.ok) {
          setProperty(data);
          // Procesar imágenes
          let parsedImages = [];
          try {
            parsedImages = JSON.parse(data.images || '[]');
          } catch (e) {
            if (data.images && typeof data.images === 'string') {
              parsedImages = [data.images];
            }
          }
          if (parsedImages.length === 0) {
            parsedImages = ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'];
          }
          setImagesList(parsedImages);
          setActiveImage(parsedImages[0]);
          setMessage(`Hola, estoy interesado en la propiedad "${data.title}" (ID: ${data.id}) y me gustaría recibir más información.`);
        } else {
          setError('Propiedad no encontrada.');
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Error al conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const handleContactSubmit = async (e) => {
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
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          propertyId: Number(id),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
      } else {
        setError(data.error || 'Ocurrió un error al enviar el formulario.');
      }
    } catch (err) {
      setError('Error al enviar el formulario. Intente de nuevo.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center text-neutral-500">
        Cargando detalles de la propiedad...
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-red-400 text-lg mb-6">{error}</p>
        <button onClick={() => router.push('/propiedades')} className="btn-brand px-6 py-2.5 rounded text-xs uppercase tracking-wider">
          Volver al catálogo
        </button>
      </div>
    );
  }

  const operationLabels = {
    'VENTA': 'Venta',
    'ALQUILER': 'Alquiler',
    'ALQUILER_TEMPORARIO': 'Temporario',
  };

  const typeLabels = {
    'CASA': 'Casa',
    'DEPARTAMENTO': 'Departamento',
    'LOTE': 'Lote',
    'PH': 'PH',
    'LOCAL': 'Local',
  };

  const formattedPrice = property.price.toLocaleString('es-AR');
  const priceDisplay = `${property.currency} ${formattedPrice}`;
  const whatsappUrl = `https://wa.me/5492297409477?text=${encodeURIComponent(`Hola, estoy interesado en la propiedad "${property.title}" (ID: ${property.id}).`)}`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* BOTON VOLVER */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-xs text-neutral-400 hover:text-brand uppercase tracking-wider font-semibold mb-8 transition-colors gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* DETALLE PRINCIPAL (COL 1 Y 2) */}
        <div className="lg:col-span-2 space-y-10">
          {/* GALERIA */}
          <div className="space-y-4">
            <div className="w-full h-[450px] bg-neutral-950 rounded-lg overflow-hidden border border-neutral-900 shadow-inner">
              <img
                src={activeImage}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            {imagesList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-2">
                {imagesList.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`w-24 h-16 rounded overflow-hidden border shrink-0 transition-all duration-300 ${
                      activeImage === img ? 'border-brand scale-95 shadow-md shadow-brand/10' : 'border-neutral-850 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DATOS BASICOS */}
          <div className="border-b border-neutral-900 pb-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-brand/15 text-brand text-[10px] tracking-widest uppercase font-semibold px-3 py-1 rounded border border-brand-border">
                {operationLabels[property.operation]}
              </span>
              <span className="bg-neutral-900 text-neutral-100 text-[10px] tracking-wider uppercase font-medium px-2.5 py-1 rounded border border-neutral-800">
                {typeLabels[property.type]}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-100 leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center text-sm text-neutral-400 gap-1.5">
              <MapPin className="w-4 h-4 text-brand shrink-0" />
              <span>{property.address}, {property.neighborhood}</span>
            </div>

            <p className="text-3xl font-extrabold text-brand tracking-wide mt-4">{priceDisplay}</p>
          </div>

          {/* DETALLES TECNICOS */}
          <div className="space-y-6">
            <h2 className="text-neutral-100 font-bold text-sm tracking-widest uppercase border-l-2 border-brand pl-3">
              Ficha Técnica
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-neutral-900/40 border border-neutral-900 rounded-lg p-6 text-center">
              <div className="space-y-1">
                <Maximize2 className="w-5 h-5 text-brand mx-auto" />
                <p className="text-[10px] text-neutral-500 uppercase font-semibold">Sup. Total</p>
                <p className="text-sm font-semibold text-neutral-100">{property.totalArea} m²</p>
              </div>
              <div className="space-y-1 border-l border-neutral-850">
                <Maximize2 className="w-5 h-5 text-brand mx-auto" />
                <p className="text-[10px] text-neutral-500 uppercase font-semibold">Sup. Cubierta</p>
                <p className="text-sm font-semibold text-neutral-100">{property.coveredArea} m²</p>
              </div>
              {property.type !== 'LOTE' && (
                <>
                  <div className="space-y-1 border-l border-neutral-850">
                    <Bed className="w-5 h-5 text-brand mx-auto" />
                    <p className="text-[10px] text-neutral-500 uppercase font-semibold">Dormitorios</p>
                    <p className="text-sm font-semibold text-neutral-100">{property.bedrooms || '-'}</p>
                  </div>
                  <div className="space-y-1 border-l border-neutral-850">
                    <Bath className="w-5 h-5 text-brand mx-auto" />
                    <p className="text-[10px] text-neutral-500 uppercase font-semibold">Baños</p>
                    <p className="text-sm font-semibold text-neutral-100">{property.bathrooms || '-'}</p>
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 bg-neutral-900/20 rounded-lg p-4 text-xs text-neutral-300">
              <div className="flex justify-between py-2 border-b border-neutral-900">
                <span className="text-neutral-500">Cantidad de Ambientes:</span>
                <span className="font-semibold text-neutral-100">{property.rooms || '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-900">
                <span className="text-neutral-500">Cochera:</span>
                <span className="font-semibold text-neutral-100">{property.garage ? 'Sí' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* DESCRIPCION */}
          <div className="space-y-6">
            <h2 className="text-neutral-100 font-bold text-sm tracking-widest uppercase border-l-2 border-brand pl-3">
              Descripción General
            </h2>
            <div className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line bg-neutral-900/20 p-6 rounded-lg border border-neutral-900">
              {property.description}
            </div>
          </div>
        </div>

        {/* SIDEBAR DE CONTACTO (COL 3) */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-neutral-900 border border-neutral-850 rounded-lg p-6 space-y-6 shadow-xl">
            <h3 className="text-neutral-100 font-bold text-sm tracking-widest uppercase border-b border-neutral-800 pb-4">
              Consultar por esta Propiedad
            </h3>

            {success ? (
              <div className="bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 rounded-lg p-5 flex flex-col items-center text-center space-y-3">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
                <p className="text-xs font-semibold uppercase tracking-wider">¡Consulta Enviada!</p>
                <p className="text-xs leading-relaxed text-neutral-400">
                  Hemos recibido su consulta. Un asesor de Benítez Inmobiliaria se comunicará a la brevedad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-950/30 border border-red-500/20 text-red-400 text-xs rounded p-3">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded px-4 py-3 text-neutral-100"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded px-4 py-3 text-neutral-100"
                    placeholder="Ej. juan@correo.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded px-4 py-3 text-neutral-100"
                    placeholder="Ej. 11 1234 5678"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Mensaje o Consulta
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded px-4 py-3 text-neutral-100 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-brand w-full py-3 rounded text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {sending ? 'Enviando...' : 'Enviar Consulta'}
                </button>
              </form>
            )}

            <div className="border-t border-neutral-800 pt-4 flex flex-col space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold py-3 rounded text-center text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:scale-[1.02] transition-all duration-300 shadow-md shadow-green-500/10"
              >
                <MessageCircle className="w-4 h-4 fill-white text-green-500" />
                WhatsApp Directo
              </a>
              <a
                href="tel:2297409477"
                className="bg-neutral-950 text-neutral-300 hover:text-brand border border-neutral-850 hover:border-neutral-700 py-3 rounded text-center text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-brand" />
                Llamar a Oficinas
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
