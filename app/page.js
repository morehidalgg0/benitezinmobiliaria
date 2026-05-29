import Link from 'next/link';
import prisma from '@/lib/prisma';
import HomeSearch from '@/components/HomeSearch';
import PropertyCard from '@/components/PropertyCard';
import { Award, ShieldCheck, Compass, ArrowRight, Building2, Landmark, LayoutGrid, Trees } from 'lucide-react';

export const revalidate = 0; // Evita el cacheo para ver actualizaciones en tiempo real

export default async function Home() {
  // Obtener propiedades destacadas en venta
  const featuredSales = await prisma.property.findMany({
    where: {
      featured: true,
      operation: 'VENTA',
      active: true,
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  // Obtener propiedades destacadas en alquiler (alquiler anual o temporario)
  const featuredRents = await prisma.property.findMany({
    where: {
      featured: true,
      operation: {
        in: ['ALQUILER', 'ALQUILER_TEMPORARIO'],
      },
      active: true,
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  // Obtener desarrollos/emprendimientos
  const developments = await prisma.development.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const propertyTypes = [
    { name: 'Casas', type: 'CASA', icon: <Landmark className="w-8 h-8" /> },
    { name: 'Departamentos', type: 'DEPARTAMENTO', icon: <Building2 className="w-8 h-8" /> },
    { name: 'Lotes / Terrenos', type: 'LOTE', icon: <Trees className="w-8 h-8" /> },
    { name: 'PHs', type: 'PH', icon: <LayoutGrid className="w-8 h-8" /> },
    { name: 'Locales', type: 'LOCAL', icon: <Building2 className="w-8 h-8" /> },
  ];

  return (
    <div className="flex flex-col space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center -mt-24 overflow-hidden">
        {/* Background Image with elegant overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
            alt="Benítez Inmobiliaria Premium Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 dark-overlay"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
          <span className="text-brand tracking-[0.3em] text-xs md:text-sm font-semibold uppercase mb-4 animate-fade-in">
            Líderes en el Mercado Premium de Argentina
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-wide uppercase max-w-4xl mb-6 leading-tight animate-fade-in">
            Tu mejor inversión <br />
            <span className="text-brand">empieza con Benítez.</span>
          </h1>
          <p className="text-neutral-300 max-w-xl text-sm md:text-base leading-relaxed mb-12 font-medium">
            Encuentre la propiedad de sus sueños en las mejores ubicaciones: Recoleta, Palermo, Puerto Madero y barrios cerrados exclusivos.
          </p>
          
          {/* Central Filter Search */}
          <HomeSearch />
        </div>
      </section>

      {/* 2. PROPIEDADES DESTACADAS EN VENTA */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-brand tracking-[0.2em] text-xs font-semibold uppercase">
              Oportunidades únicas
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-100 uppercase tracking-wider mt-2">
              Propiedades Destacadas en Venta
            </h2>
          </div>
          <Link
            href="/propiedades?operation=VENTA"
            className="hover-brand text-sm font-semibold tracking-wider uppercase flex items-center mt-4 md:mt-0"
          >
            Ver catálogo completo <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {featuredSales.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSales.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-center py-10">No hay propiedades destacadas en venta actualmente.</p>
        )}
      </section>

      {/* 3. CATEGORIAS DE PROPIEDADES */}
      <section className="bg-[#0c0c0c] border-y border-neutral-950 py-20 w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-brand tracking-[0.2em] text-xs font-semibold uppercase">
              Explore por categorías
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-100 uppercase tracking-wider mt-2">
              Tipos de Propiedades
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {propertyTypes.map((cat) => (
              <Link
                key={cat.name}
                href={`/propiedades?type=${cat.type}`}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="text-brand group-hover:scale-110 transition-transform duration-300 mb-4">
                  {cat.icon}
                </div>
                <span className="text-sm font-semibold text-neutral-300 group-hover:text-white uppercase tracking-wider">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROPIEDADES DESTACADAS EN ALQUILER */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-brand tracking-[0.2em] text-xs font-semibold uppercase">
              Para renta exclusiva
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-100 uppercase tracking-wider mt-2">
              Propiedades Destacadas en Alquiler
            </h2>
          </div>
          <Link
            href="/propiedades?operation=ALQUILER"
            className="hover-brand text-sm font-semibold tracking-wider uppercase flex items-center mt-4 md:mt-0"
          >
            Ver todos los alquileres <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {featuredRents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRents.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-center py-10">No hay propiedades destacadas en alquiler actualmente.</p>
        )}
      </section>

      {/* 5. EMPRENDIMIENTOS DESTACADOS */}
      <section className="bg-[#0b0b0b] py-20 border-y border-neutral-900 w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-brand tracking-[0.2em] text-xs font-semibold uppercase">
                Proyectos exclusivos en pozo y terminados
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-100 uppercase tracking-wider mt-2">
                Emprendimientos Destacados
              </h2>
            </div>
            <Link
              href="/emprendimientos"
              className="hover-brand text-sm font-semibold tracking-wider uppercase flex items-center mt-4 md:mt-0"
            >
              Ver todos los proyectos <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {developments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {developments.map((dev) => {
                let devImg = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80';
                try {
                  const imgs = JSON.parse(dev.images || '[]');
                  if (imgs.length > 0) devImg = imgs[0];
                } catch (e) {}

                return (
                  <div key={dev.id} className="bg-neutral-900 border border-neutral-850 rounded-lg overflow-hidden group hover:border-brand/25 transition-all duration-300 flex flex-col h-full">
                    <div className="relative h-56 w-full overflow-hidden">
                      <img
                        src={devImg}
                        alt={dev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/60 dark-overlay"></div>
                      <div className="absolute top-4 left-4">
                        <span className={`text-[9px] tracking-widest uppercase font-bold px-2.5 py-1 rounded ${
                          dev.status === 'FINISHED' ? 'bg-neutral-900 text-emerald-400 border border-emerald-400/20' : 'bg-brand-primary text-white font-semibold border border-brand-primary'
                        }`}>
                          {dev.status === 'FINISHED' ? 'Terminado' : 'En Construcción'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-neutral-100 text-lg font-semibold mb-3 group-hover:text-brand transition-colors">
                        {dev.title}
                      </h3>
                      <p className="text-xs text-neutral-400 mb-2">{dev.location}</p>
                      <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3 mb-6">
                        {dev.description}
                      </p>
                      <Link
                        href={`/emprendimientos#dev-${dev.id}`}
                        className="text-xs text-brand font-semibold uppercase tracking-wider flex items-center hover:underline mt-auto"
                      >
                        Más información <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-neutral-500 text-center py-10">No hay emprendimientos disponibles actualmente.</p>
          )}
        </div>
      </section>

      {/* 6. POR QUE ELEGIRNOS */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-brand tracking-[0.2em] text-xs font-semibold uppercase">
            Garantía de excelencia
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-100 uppercase tracking-wider mt-2">
            ¿Por qué elegirnos?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-neutral-900 border border-neutral-850 rounded-lg p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-brand-light text-brand flex items-center justify-center mb-6">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-neutral-100 text-lg font-semibold tracking-wide mb-4">Trayectoria & Seriedad</h3>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Décadas de experiencia en operaciones inmobiliarias premium. Cada transacción es administrada bajo estrictas normas de profesionalismo y confidencialidad.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-850 rounded-lg p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-brand-light text-brand flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-neutral-100 text-lg font-semibold tracking-wide mb-4">Asesoramiento Exclusivo</h3>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Analizamos minuciosamente las necesidades de cada cliente y las tendencias del mercado de alta gama para asegurar inversiones rentables y hogares ideales.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-850 rounded-lg p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-brand-light text-brand flex items-center justify-center mb-6">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-neutral-100 text-lg font-semibold tracking-wide mb-4">Alcance Multicanal</h3>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Integración nativa con los portales líderes (Argenprop, Mercado Libre) para asegurar máxima visibilidad y velocidad de comercialización para sus propiedades.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
