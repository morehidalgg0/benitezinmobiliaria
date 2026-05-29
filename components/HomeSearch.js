'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';

export default function HomeSearch() {
  const router = useRouter();
  const [operation, setOperation] = useState('VENTA'); // 'VENTA' o 'ALQUILER'
  const [type, setType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [neighborhood, setNeighborhood] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('operation', operation);
    if (type) params.set('type', type);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (neighborhood) params.set('neighborhood', neighborhood);

    router.push(`/propiedades?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-brand rounded-xl p-2 md:p-4 shadow-2xl animate-fade-in">
      {/* TABS */}
      <div className="flex border-b border-neutral-800 mb-4 px-2">
        <button
          onClick={() => setOperation('VENTA')}
          className={`pb-3 pt-1 px-4 text-xs md:text-sm tracking-wider uppercase font-semibold border-b-2 transition-all duration-300 ${
            operation === 'VENTA'
              ? 'border-brand text-brand font-bold'
              : 'border-transparent text-neutral-400 hover:text-brand'
          }`}
        >
          Quiero Comprar
        </button>
        <button
          onClick={() => setOperation('ALQUILER')}
          className={`pb-3 pt-1 px-4 text-xs md:text-sm tracking-wider uppercase font-semibold border-b-2 transition-all duration-300 ${
            operation === 'ALQUILER'
              ? 'border-brand text-brand font-bold'
              : 'border-transparent text-neutral-400 hover:text-brand'
          }`}
        >
          Quiero Alquilar
        </button>
      </div>

      {/* FILTER FORM */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-2">
        {/* NEIGHBORHOOD */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand" />
          <input
            type="text"
            placeholder="Zona, Barrio..."
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="w-full bg-neutral-900/60 border border-neutral-800 text-sm rounded px-10 py-3 text-neutral-100 placeholder-neutral-500"
          />
        </div>

        {/* PROPERTY TYPE */}
        <div className="relative">
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand" />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-neutral-900/60 border border-neutral-800 text-sm rounded px-10 py-3 text-neutral-100 appearance-none cursor-pointer"
          >
            <option value="">Tipo de Propiedad</option>
            <option value="CASA">Casa</option>
            <option value="DEPARTAMENTO">Departamento</option>
            <option value="PH">PH</option>
            <option value="LOTE">Lote / Terreno</option>
            <option value="LOCAL">Local Comercial</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-xs">▼</div>
        </div>

        {/* BEDROOMS */}
        <div className="relative">
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand" />
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="w-full bg-neutral-900/60 border border-neutral-800 text-sm rounded px-10 py-3 text-neutral-100 appearance-none cursor-pointer"
          >
            <option value="">Ambientes / Dorm.</option>
            <option value="1">1+ Dormitorio</option>
            <option value="2">2+ Dormitorios</option>
            <option value="3">3+ Dormitorios</option>
            <option value="4">4+ Dormitorios</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-xs">▼</div>
        </div>

        {/* PRICE LIMIT */}
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand" />
          <input
            type="number"
            placeholder="Precio Máximo (USD)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-neutral-900/60 border border-neutral-800 text-sm rounded px-10 py-3 text-neutral-100 placeholder-neutral-500"
          />
        </div>

        {/* SEARCH BUTTON */}
        <button
          type="submit"
          className="btn-brand w-full py-3 rounded flex items-center justify-center text-sm font-semibold uppercase tracking-wider gap-2 shadow-lg"
        >
          <Search className="w-4 h-4" />
          Buscar
        </button>
      </form>
    </div>
  );
}
