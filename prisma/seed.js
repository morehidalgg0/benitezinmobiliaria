const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean existing database records
  await prisma.contactMessage.deleteMany({});
  await prisma.syncState.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.development.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.meliCredentials.deleteMany({});

  // 2. Create default Admin User
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      password: adminPasswordHash,
    },
  });
  console.log(`Created admin user: ${adminUser.username}`);

  // 3. Create Sample Developments
  const dev1 = await prisma.development.create({
    data: {
      title: 'Torres del Yacht Luxury Residences',
      description: 'Emprendimiento residencial premium en Puerto Madero. Departamentos de 2, 3 y 4 ambientes con vista al río y amenities de máxima categoría: piscina climatizada, gimnasio de última generación, spa, helipuerto y seguridad 24 hs.',
      status: 'FINISHED',
      location: 'Juana Manso 1500, Puerto Madero, CABA',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
      ])
    }
  });

  const dev2 = await prisma.development.create({
    data: {
      title: 'Benítez Golf & Residences',
      description: 'Exclusivo proyecto de lotes y villas frente al lago en Nordelta. Un entorno natural incomparable con seguridad de vanguardia, club house con canchas de tenis y fútbol, y bajada náutica propia. Entrega en 18 meses.',
      status: 'CONSTRUCTION',
      location: 'Avenida del Golf 300, Nordelta, Tigre',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
      ])
    }
  });
  console.log('Created developments.');

  // 4. Create Sample Properties
  const propertiesData = [
    {
      title: 'Exclusivo Semipiso con Vista al Río y Amenities Premium',
      description: 'Ubicado en la zona más exclusiva de Puerto Madero, este semipiso de categoría cuenta con terminaciones de alta gama. Gran living comedor con salida a balcón terraza y vista abierta al dique. Master suite con vestidor, baño compartimentado con jacuzzi. Cocina totalmente equipada con comedor diario y dependencia de servicio. Cochera doble cubierta y baulera.',
      price: 1250000,
      currency: 'USD',
      type: 'DEPARTAMENTO',
      operation: 'VENTA',
      totalArea: 180.0,
      coveredArea: 165.0,
      rooms: 4,
      bedrooms: 3,
      bathrooms: 4,
      garage: true,
      address: 'Juana Manso 1100',
      neighborhood: 'Puerto Madero, CABA',
      featured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?auto=format&fit=crop&w=1000&q=80'
      ])
    },
    {
      title: 'Mansión Moderna con Diseño de Autor en Nordelta',
      description: 'Espectacular residencia sobre lote al agua. Diseño arquitectónico minimalista con amplios ventanales de doble altura que integran el paisaje exterior. Living principal con hogar, cocina gourmet integrada con isla. Galería de 70 m2 con parrilla, barra y piscina sin fin con borde infinito hacia el lago principal. Calefacción por losa radiante, aires acondicionados VRV central.',
      price: 1950000,
      currency: 'USD',
      type: 'CASA',
      operation: 'VENTA',
      totalArea: 650.0,
      coveredArea: 480.0,
      rooms: 6,
      bedrooms: 4,
      bathrooms: 5,
      garage: true,
      address: 'Castores Lote 45',
      neighborhood: 'Nordelta, Tigre',
      featured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1000&q=80'
      ])
    },
    {
      title: 'Departamento 3 Ambientes de Estilo Francés Reciclado',
      description: 'Hermoso departamento ubicado en el corazón de Recoleta. Techos altos de 3.5 metros, molduras originales de época y pisos de roble de Eslavonia pulidos e hidrolaqueados. Dos dormitorios amplios (uno en suite). Baños completos revestidos en mármol de Carrara. Cocina moderna totalmente refaccionada con excelente gusto y funcionalidad.',
      price: 3200,
      currency: 'USD', // Alquiler mensual premium
      type: 'DEPARTAMENTO',
      operation: 'ALQUILER',
      totalArea: 95.0,
      coveredArea: 95.0,
      rooms: 3,
      bedrooms: 2,
      bathrooms: 2,
      garage: false,
      address: 'Avenida Alvear 1700',
      neighborhood: 'Recoleta, CABA',
      featured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
      ])
    },
    {
      title: 'PH Tipo Loft Industrial en Palermo Hollywood',
      description: 'Entrada independiente. Increíble PH reciclado a nuevo con estética industrial neoyorquina. Estructura de hormigón a la vista, ladrillo descubierto y grandes ventanales de hierro negro. Planta baja con enorme living comedor, cocina abierta y patio interno parquizado. Planta alta con dormitorio en suite que balconea al living y terraza con jacuzzi.',
      price: 1800,
      currency: 'USD',
      type: 'PH',
      operation: 'ALQUILER_TEMPORARIO',
      totalArea: 120.0,
      coveredArea: 90.0,
      rooms: 2,
      bedrooms: 1,
      bathrooms: 2,
      garage: false,
      address: 'Humboldt 1900',
      neighborhood: 'Palermo Hollywood, CABA',
      featured: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80'
      ])
    },
    {
      title: 'Importante Local Comercial en Esquina de Alto Tránsito',
      description: 'Excepcional local en esquina comercial de Belgrano R. Excelente vidriera de doble altura con más de 25 metros lineales de exposición. Apto para múltiples rubros (gastronómico, bancario, institucional, etc.). Planta baja libre, subsuelo técnico/depósito y primer piso administrativo. Cuenta con tiraje a los 4 vientos instalado.',
      price: 7500,
      currency: 'USD',
      type: 'LOCAL',
      operation: 'ALQUILER',
      totalArea: 350.0,
      coveredArea: 350.0,
      rooms: 4,
      bedrooms: 0,
      bathrooms: 3,
      garage: false,
      address: 'Pampa y Superí',
      neighborhood: 'Belgrano R, CABA',
      featured: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80'
      ])
    },
    {
      title: 'Lote al Agua de 1200 m2 en Barrio Cerrado Premium',
      description: 'Excelente lote de orientación norte sobre el lago central. Uno de los últimos lotes disponibles con costa de lago propia. Nivelado y listo para comenzar a construir. Barrio con seguridad doble control, expensas ordenadas y excelentes servicios sociales.',
      price: 320000,
      currency: 'USD',
      type: 'LOTE',
      operation: 'VENTA',
      totalArea: 1200.0,
      coveredArea: 0.0,
      rooms: 0,
      bedrooms: 0,
      bathrooms: 0,
      garage: false,
      address: 'El Cantón Lote 250',
      neighborhood: 'Escobar, Buenos Aires',
      featured: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80'
      ])
    }
  ];

  for (const propData of propertiesData) {
    const prop = await prisma.property.create({
      data: propData
    });

    // Create a mock SyncState for each property
    await prisma.syncState.create({
      data: {
        propertyId: prop.id,
        argenpropId: prop.id % 2 === 0 ? `ap-${prop.id * 1234}` : null,
        argenpropStatus: prop.id % 2 === 0 ? 'ACTIVE' : 'NOT_PUBLISHED',
        meliId: prop.id % 3 === 0 ? `mla-${prop.id * 5678}` : null,
        meliStatus: prop.id % 3 === 0 ? 'ACTIVE' : 'NOT_PUBLISHED',
        lastSynced: prop.id % 2 === 0 || prop.id % 3 === 0 ? new Date() : null,
      }
    });
  }

  console.log('Seeded properties with sync states.');
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
