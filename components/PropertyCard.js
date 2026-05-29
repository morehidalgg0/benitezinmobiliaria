import Link from 'next/link';
import { Bed, Bath, Maximize2, MapPin } from 'lucide-react';

export default function PropertyCard({ property }) {
  // Obtener primera imagen o fallback
  let imageUrl = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80';
  try {
    const parsedImages = JSON.parse(property.images || '[]');
    if (parsedImages.length > 0) imageUrl = parsedImages[0];
  } catch (e) {
    if (property.images && typeof property.images === 'string' && !property.images.startsWith('[')) {
      imageUrl = property.images;
    }
  }

  // Formatear precio
  const formattedPrice = property.price.toLocaleString('es-AR');
  const priceDisplay = `${property.currency} ${formattedPrice}`;

  // Formatear operación
  const operationLabels = {
    'VENTA': 'Venta',
    'ALQUILER': 'Alquiler',
    'ALQUILER_TEMPORARIO': 'Temporario',
  };

  // Formatear tipo
  const typeLabels = {
    'CASA': 'Casa',
    'DEPARTAMENTO': 'Departamento',
    'LOTE': 'Lote',
    'PH': 'PH',
    'LOCAL': 'Local',
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden group hover:border-brand/30 transition-all duration-500 flex flex-col h-full hover:shadow-xl hover:shadow-brand/5">
      {/* IMAGE CONTAINER WITH ZOOM */}
      <div className="relative h-64 w-full overflow-hidden shrink-0">
        <img
          src={imageUrl}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>

        {/* BADGES */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-brand/10 text-brand text-[10px] tracking-widest uppercase font-bold px-3 py-1 rounded border border-brand/20 backdrop-blur-sm">
            {operationLabels[property.operation]}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 text-neutral-100 text-[10px] tracking-wider uppercase font-bold px-2.5 py-1 rounded border border-neutral-800 backdrop-blur-sm">
            {typeLabels[property.type]}
          </span>
        </div>

        {/* PRICE DISPLAY */}
        <div className="absolute bottom-4 left-4">
          <p className="text-xl font-bold text-white tracking-wide">{priceDisplay}</p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 flex flex-col flex-grow">
        {/* NEIGHBORHOOD */}
        <div className="flex items-center text-xs text-neutral-400 mb-2 gap-1">
          <MapPin className="w-3.5 h-3.5 text-brand" />
          <span>{property.neighborhood}</span>
        </div>

        {/* TITLE */}
        <h3 className="text-neutral-100 font-bold text-base leading-snug tracking-wide mb-3 group-hover:text-brand transition-colors line-clamp-2">
          {property.title}
        </h3>

        {/* DESCRIPTION EXCERPT */}
        <p className="text-neutral-400 text-xs leading-relaxed mb-6 line-clamp-3">
          {property.description}
        </p>

        {/* TECHNICAL DETAILS */}
        <div className="grid grid-cols-3 gap-2 border-t border-neutral-800 pt-4 mt-auto text-neutral-300 text-xs">
          {property.type !== 'LOTE' && (
            <>
              <div className="flex items-center gap-1.5 justify-center">
                <Bed className="w-4 h-4 text-brand shrink-0" />
                <span>{property.bedrooms || '-'} Dorm.</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center">
                <Bath className="w-4 h-4 text-brand shrink-0" />
                <span>{property.bathrooms || '-'} Baños</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-1.5 justify-center col-span-1" style={{ gridColumn: property.type === 'LOTE' ? 'span 3' : 'auto' }}>
            <Maximize2 className="w-4 h-4 text-brand shrink-0" />
            <span>{property.totalArea} m²</span>
          </div>
        </div>

        {/* VIEW DETAILS LINK */}
        <Link
          href={`/propiedad/${property.id}`}
          className="btn-outline-brand text-center py-2.5 rounded text-xs tracking-wider uppercase mt-5 block w-full"
        >
          Ver Ficha Completa
        </Link>
      </div>
    </div>
  );
}
