import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { syncProperty } from '@/lib/sync';

// Listar todas las propiedades para el panel admin (activa o inactivas)
export async function GET(req) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        syncState: true,
      },
    });

    // Validamos estado de conexión con Mercado Libre
    const hasMeli = await prisma.meliCredentials.count() > 0;

    return NextResponse.json({
      properties,
      meliConnected: hasMeli || process.env.API_SIMULATION_MODE === 'true',
    });
  } catch (error) {
    console.error('Error admin properties GET:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// Crear una propiedad y gatillar sincronización automática
export async function POST(req) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      description,
      price,
      currency,
      type,
      operation,
      totalArea,
      coveredArea,
      rooms,
      bedrooms,
      bathrooms,
      garage,
      address,
      neighborhood,
      images,
      featured,
      active,
    } = body;

    // Validación básica
    if (!title || !description || price === undefined || !type || !operation || totalArea === undefined || coveredArea === undefined || !address || !neighborhood) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Guardar en la DB
    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        currency: currency || 'USD',
        type,
        operation,
        totalArea: parseFloat(totalArea),
        coveredArea: parseFloat(coveredArea),
        rooms: parseInt(rooms || '0'),
        bedrooms: parseInt(bedrooms || '0'),
        bathrooms: parseInt(bathrooms || '0'),
        garage: !!garage,
        address,
        neighborhood,
        images: Array.isArray(images) ? JSON.stringify(images) : (images || '[]'),
        featured: !!featured,
        active: active !== undefined ? !!active : true,
      },
    });

    // Inicializar SyncState
    await prisma.syncState.create({
      data: {
        propertyId: property.id,
      },
    });

    // Gatillar sincronización automática
    let syncResult = null;
    if (property.active) {
      syncResult = await syncProperty(property.id);
    }

    return NextResponse.json({
      success: true,
      property,
      syncResult,
    });
  } catch (error) {
    console.error('Error admin properties POST:', error);
    return NextResponse.json({ error: 'Error del servidor al crear propiedad' }, { status: 500 });
  }
}
