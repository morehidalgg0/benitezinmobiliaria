'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar, Building, ChevronRight, MessageCircle } from 'lucide-react';

export default function DevelopmentsPage() {
  const [developments, setDevelopments] = useState([]);
  const [filteredDevs, setFilteredDevs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'CONSTRUCTION', 'FINISHED'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevelopments = async () => {
      try {
        const response = await fetch('/api/developments');
        const data = await response.json();
        if (response.ok) {
          setDevelopments(data);
          setFilteredDevs(data);
        }
      } catch (e) {
        console.error('Error fetching developments:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDevelopments();
  }, []);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    if (status === 'ALL') {
      setFilteredDevs(developments);
    } else {
      setFilteredDevs(developments.filter((dev) => dev.status === status));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* HEADER BANNER */}
      <div className="border-b border-neutral-900 pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-brand tracking-[0.2em] text-xs font-semibold uppercase">
            Proyectos de pozo y llave en mano
          </span>
          <h1 className="text-3xl font-extrabold text-neutral-100 uppercase tracking-wider mt-2">
            Emprendimientos Exclusivos
          </h1>
        </div>

        {/* TABS DE FILTRO */}
        <div className="flex border border-neutral-800 rounded bg-neutral-900/40 p-1">
          <button
            onClick={() => handleFilterChange('ALL')}
            className={`px-4 py-2 text-xs tracking-wider uppercase font-semibold rounded transition-colors ${
              statusFilter === 'ALL' ? 'bg-brand text-white font-bold' : 'text-neutral-400 hover:text-brand'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => handleFilterChange('CONSTRUCTION')}
            className={`px-4 py-2 text-xs tracking-wider uppercase font-semibold rounded transition-colors ${
              statusFilter === 'CONSTRUCTION' ? 'bg-brand text-white font-bold' : 'text-neutral-400 hover:text-brand'
            }`}
          >
            En Obra
          </button>
          <button
            onClick={() => handleFilterChange('FINISHED')}
            className={`px-4 py-2 text-xs tracking-wider uppercase font-semibold rounded transition-colors ${
              statusFilter === 'FINISHED' ? 'bg-brand text-white font-bold' : 'text-neutral-400 hover:text-brand'
            }`}
          >
            Terminados
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-12">
          {[1, 2].map((i) => (
            <div key={i} className="bg-neutral-900 border border-neutral-850 rounded-lg p-6 flex flex-col lg:flex-row gap-8 animate-pulse">
              <div className="w-full lg:w-1/3 h-64 bg-neutral-800 rounded"></div>
              <div className="w-full lg:w-2/3 space-y-4">
                <div className="h-4 bg-neutral-850 rounded w-1/4"></div>
                <div className="h-8 bg-neutral-800 rounded w-3/4"></div>
                <div className="h-20 bg-neutral-850 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredDevs.length > 0 ? (
        <div className="space-y-12">
          {filteredDevs.map((dev) => {
            let parsedImages = [];
            try {
              parsedImages = JSON.parse(dev.images || '[]');
            } catch (e) {
              if (dev.images && typeof dev.images === 'string') {
                parsedImages = [dev.images];
              }
            }
            const mainImg = parsedImages[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

            const whatsappMessage = `Hola! Estoy interesado en el emprendimiento "${dev.title}" y me gustaría recibir más detalles.`;
            const whatsappLink = `https://wa.me/5492297409477?text=${encodeURIComponent(whatsappMessage)}`;

            return (
              <div
                key={dev.id}
                id={`dev-${dev.id}`}
                className="bg-neutral-900 border border-neutral-850 rounded-lg overflow-hidden flex flex-col lg:flex-row hover:border-brand/20 transition-all duration-300 shadow-lg"
              >
                {/* PICTURE SHOWCASE */}
                <div className="w-full lg:w-2/5 h-64 lg:h-auto min-h-[300px] relative overflow-hidden shrink-0">
                  <img src={mainImg} alt={dev.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 lg:bg-gradient-to-r lg:from-transparent lg:to-neutral-900/90"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-6 left-6">
                    <span className={`text-[10px] tracking-widest uppercase font-bold px-3 py-1.5 rounded border ${
                      dev.status === 'FINISHED'
                        ? 'bg-neutral-950 text-emerald-400 border-emerald-400/20'
                        : 'bg-brand-primary text-white border-brand-primary font-semibold'
                    }`}>
                      {dev.status === 'FINISHED' ? 'Terminado' : 'En Obra'}
                    </span>
                  </div>
                </div>

                {/* DETAILS PANEL */}
                <div className="p-8 flex flex-col justify-between flex-grow">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-neutral-100 tracking-wide uppercase hover:text-brand transition-colors">
                      {dev.title}
                    </h2>
                    
                    <div className="flex flex-wrap gap-4 text-xs text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-brand" />
                        <span>{dev.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-brand" />
                        <span>{dev.status === 'FINISHED' ? 'Entrega Inmediata' : 'Fecha estimada: 18 meses'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-brand" />
                        <span>Categoría Premium</span>
                      </div>
                    </div>

                    <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line pt-2">
                      {dev.description}
                    </p>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-6 border-t border-neutral-850">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-brand px-6 py-3 rounded text-center text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Consultar por WhatsApp
                    </a>
                    <a
                      href={`/contacto?subject=${encodeURIComponent(`Consulta por Emprendimiento: ${dev.title}`)}`}
                      className="bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-brand px-6 py-3 rounded text-center text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      Solicitar Dossier Técnico
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-neutral-900 border border-neutral-850 rounded-lg p-10">
          <p className="text-neutral-400">No se encontraron emprendimientos disponibles en esta categoría.</p>
        </div>
      )}
    </div>
  );
}
