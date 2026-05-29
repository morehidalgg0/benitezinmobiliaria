'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import { Filter, SlidersHorizontal, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

function SearchAndListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estados locales para los filtros vinculados al formulario lateral
  const [operation, setOperation] = useState(searchParams.get('operation') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [neighborhood, setNeighborhood] = useState(searchParams.get('neighborhood') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  
  // Estado para la paginación y carga de datos
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 6, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Cada vez que cambian los parámetros de búsqueda en la URL, hacemos fetch
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams(searchParams.toString());
        const response = await fetch(`/api/properties?${query.toString()}`);
        const data = await response.json();
        
        if (response.ok) {
          setProperties(data.properties || []);
          setPagination(data.pagination || { total: 0, page: 1, limit: 6, totalPages: 1 });
        }
      } catch (e) {
        console.error('Error fetching properties:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);

  // Sincronizar estados locales si la URL cambia externamente (ej: navegando desde home)
  useEffect(() => {
    setOperation(searchParams.get('operation') || '');
    setType(searchParams.get('type') || '');
    setBedrooms(searchParams.get('bedrooms') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setNeighborhood(searchParams.get('neighborhood') || '');
    setSort(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  // Aplicar filtros agregándolos a la URL
  const applyFilters = (updatedPage) => {
    const params = new URLSearchParams();
    if (operation) params.set('operation', operation);
    if (type) params.set('type', type);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (neighborhood) params.set('neighborhood', neighborhood);
    if (sort) params.set('sort', sort);
    
    // Si viene una página específica por argumento, la seteamos, sino por defecto 1
    const targetPage = updatedPage !== undefined ? updatedPage : 1;
    params.set('page', String(targetPage));
    params.set('limit', '6');

    router.push(`/propiedades?${params.toString()}`);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    applyFilters(1);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    // Para aplicar inmediatamente usamos los params actuales agregando el sort
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    params.set('page', '1');
    router.push(`/propiedades?${params.toString()}`);
  };

  const handlePageChange = (targetPage) => {
    if (targetPage < 1 || targetPage > pagination.totalPages) return;
    applyFilters(targetPage);
  };

  const clearFilters = () => {
    setOperation('');
    setType('');
    setBedrooms('');
    setMinPrice('');
    setMaxPrice('');
    setNeighborhood('');
    setSort('newest');
    router.push('/propiedades');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* BANNER DE TITULO */}
      <div className="border-b border-neutral-900 pb-8 mb-12">
        <span className="text-brand tracking-[0.2em] text-xs font-semibold uppercase">
          Búsqueda Avanzada
        </span>
        <h1 className="text-3xl font-extrabold text-neutral-100 uppercase tracking-wider mt-2">
          Catálogo de Propiedades
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* FILTROS LATERALES */}
        <aside className="lg:col-span-1 bg-neutral-900 border border-neutral-850 rounded-lg p-6 h-fit">
          <div className="flex items-center justify-between mb-6 border-b border-neutral-800 pb-4">
            <h2 className="text-neutral-100 font-bold text-sm tracking-widest uppercase flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand" />
              Filtros
            </h2>
            <button
              onClick={clearFilters}
              className="text-xs text-neutral-500 hover:text-brand uppercase tracking-wider font-semibold flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Limpiar
            </button>
          </div>

          <form onSubmit={handleFilterSubmit} className="space-y-6">
            {/* DIRECCION / BARRIO */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Zona o Barrio
              </label>
              <input
                type="text"
                placeholder="Ej. Recoleta, Palermo..."
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded px-4 py-3 text-neutral-100 placeholder-neutral-600"
              />
            </div>

            {/* OPERACION */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Operación
              </label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded px-4 py-3 text-neutral-100 cursor-pointer"
              >
                <option value="">Todas las operaciones</option>
                <option value="VENTA">Comprar (Venta)</option>
                <option value="ALQUILER">Alquilar</option>
                <option value="ALQUILER_TEMPORARIO">Alquiler Temporario</option>
              </select>
            </div>

            {/* TIPO DE PROPIEDAD */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Tipo de Inmueble
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded px-4 py-3 text-neutral-100 cursor-pointer"
              >
                <option value="">Todos los tipos</option>
                <option value="CASA">Casa</option>
                <option value="DEPARTAMENTO">Departamento</option>
                <option value="PH">PH</option>
                <option value="LOTE">Lote / Terreno</option>
                <option value="LOCAL">Local Comercial</option>
              </select>
            </div>

            {/* DORMITORIOS */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Dormitorios
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded px-4 py-3 text-neutral-100 cursor-pointer"
              >
                <option value="">Cualquier cantidad</option>
                <option value="1">1+ Dormitorio</option>
                <option value="2">2+ Dormitorios</option>
                <option value="3">3+ Dormitorios</option>
                <option value="4">4+ Dormitorios</option>
              </select>
            </div>

            {/* RANGO DE PRECIO */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Precio Máximo (USD)
              </label>
              <input
                type="number"
                placeholder="Sin límite"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded px-4 py-3 text-neutral-100 placeholder-neutral-600"
              />
            </div>

            {/* BOTON APLICAR */}
            <button
              type="submit"
              className="btn-brand w-full py-3 rounded text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2"
            >
              Aplicar Filtros
            </button>
          </form>
        </aside>

        {/* LISTADO DE RESULTADOS */}
        <main className="lg:col-span-3">
          {/* HEADER DE ORDENAMIENTO */}
          <div className="flex items-center justify-between bg-neutral-900 border border-neutral-850 rounded-lg px-6 py-4 mb-8">
            <span className="text-xs text-neutral-400">
              {loading ? (
                'Buscando propiedades...'
              ) : (
                <>
                  Se encontraron <strong className="text-neutral-100">{pagination.total}</strong> propiedades
                </>
              )}
            </span>

            <div className="flex items-center space-x-2 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand" />
              <span className="text-neutral-400 mr-2">Ordenar por:</span>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-100 cursor-pointer text-xs"
              >
                <option value="newest">Más recientes</option>
                <option value="price_asc">Menor precio</option>
                <option value="price_desc">Mayor precio</option>
              </select>
            </div>
          </div>

          {/* LISTA O LOADING */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-neutral-900 border border-neutral-850 rounded-lg h-[450px] animate-pulse flex flex-col">
                  <div className="h-64 bg-neutral-800 w-full"></div>
                  <div className="p-6 flex-grow flex flex-col space-y-4">
                    <div className="h-4 bg-neutral-850 rounded w-1/4"></div>
                    <div className="h-6 bg-neutral-800 rounded w-3/4"></div>
                    <div className="h-10 bg-neutral-850 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>

              {/* PAGINACION */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4 mt-12 border-t border-neutral-900 pt-8">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 border border-neutral-800 rounded hover:border-brand disabled:opacity-40 disabled:hover:border-neutral-800 transition-colors"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="w-5 h-5 text-neutral-300" />
                  </button>

                  <div className="flex items-center space-x-2 text-xs font-semibold">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded border transition-all duration-300 ${
                          pagination.page === pageNum
                            ? 'bg-brand border-brand text-white'
                            : 'border-neutral-850 hover:border-brand text-neutral-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 border border-neutral-800 rounded hover:border-brand disabled:opacity-40 disabled:hover:border-neutral-800 transition-colors"
                    aria-label="Página siguiente"
                  >
                    <ChevronRight className="w-5 h-5 text-neutral-300" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-neutral-900 border border-neutral-850 rounded-lg p-10">
              <p className="text-neutral-400 mb-4">No se encontraron propiedades que coincidan con sus filtros.</p>
              <button onClick={clearFilters} className="btn-outline-brand px-6 py-2 rounded text-xs uppercase tracking-wider font-semibold">
                Ver Todas las Propiedades
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Envuelto en Suspense por el uso de useSearchParams
export default function SearchAndList() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-20 text-center text-neutral-500">Cargando catálogo...</div>}>
      <SearchAndListContent />
    </Suspense>
  );
}
