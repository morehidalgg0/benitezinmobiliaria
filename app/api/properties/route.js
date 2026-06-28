export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Filtros
    const operation = searchParams.get('operation'); // VENTA, ALQUILER, ALQUILER_TEMPORARIO
    const type = searchParams.get('type'); // CASA, DEPARTAMENTO, LOTE, PH, LOCAL
    const bedrooms = searchParams.get('bedrooms');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const currency = searchParams.get('currency'); // USD, ARS
    const neighborhood = searchParams.get('neighborhood');
    const featured = searchParams.get('featured');

    // Paginación
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '6'));
    const skip = (page - 1) * limit;

    // Ordenamiento
    const sort = searchParams.get('sort') || 'newest'; // newest, price_asc, price_desc

    // Construcción del objeto where para Prisma
    const where = {
      active: true, // Las búsquedas públicas sólo ven propiedades activas
    };

    if (operation) where.operation = operation;
    if (type) where.type = type;
    if (bedrooms && parseInt(bedrooms) > 0) {
      where.bedrooms = { gte: parseInt(bedrooms) };
    }
    
    // Filtro de precio
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    
    if (currency) where.currency = currency;
    
    if (neighborhood) {
      where.neighborhood = {
        contains: neighborhood,
      };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    // Configuración del ordenamiento en Prisma
    let orderBy = {};
    if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    }

    // Consulta en paralelo (conteo total y obtención de datos)
    const [total, properties] = await prisma.$transaction([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          syncState: true,
        },
      }),
    ]);

    return NextResponse.json({
      properties,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error al listar propiedades:', error);
    return NextResponse.json(
      { error: 'Error al obtener las propiedades.' },
      { status: 500 }
    );
  }
}
