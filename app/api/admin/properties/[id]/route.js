import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { syncProperty } from '@/lib/sync';
import { deleteFromArgenprop } from '@/lib/argenprop';
import { updateMeliStatus } from '@/lib/mercadolibre';

// Actualizar propiedad y sincronizar cambios
export async function PUT(req, { params }) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = params;

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

    // Verificar existencia
    const existing = await prisma.property.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 });
    }

    // Actualizar en base de datos
    const updated = await prisma.property.update({
      where: { id: Number(id) },
      data: {
        title: title !== undefined ? title : existing.title,
        description: description !== undefined ? description : existing.description,
        price: price !== undefined ? parseFloat(price) : existing.price,
        currency: currency !== undefined ? currency : existing.currency,
        type: type !== undefined ? type : existing.type,
        operation: operation !== undefined ? operation : existing.operation,
        totalArea: totalArea !== undefined ? parseFloat(totalArea) : existing.totalArea,
        coveredArea: coveredArea !== undefined ? parseFloat(coveredArea) : existing.coveredArea,
        rooms: rooms !== undefined ? parseInt(rooms) : existing.rooms,
        bedrooms: bedrooms !== undefined ? parseInt(bedrooms) : existing.bedrooms,
        bathrooms: bathrooms !== undefined ? parseInt(bathrooms) : existing.bathrooms,
        garage: garage !== undefined ? !!garage : existing.garage,
        address: address !== undefined ? address : existing.address,
        neighborhood: neighborhood !== undefined ? neighborhood : existing.neighborhood,
        images: images !== undefined ? (Array.isArray(images) ? JSON.stringify(images) : images) : existing.images,
        featured: featured !== undefined ? !!featured : existing.featured,
        active: active !== undefined ? !!active : existing.active,
      },
    });

    // Sincronizar automáticamente con portales
    const syncResult = await syncProperty(updated.id);

    return NextResponse.json({
      success: true,
      property: updated,
      syncResult,
    });
  } catch (error) {
    console.error('Error admin properties PUT:', error);
    return NextResponse.json({ error: 'Error al actualizar la propiedad' }, { status: 500 });
  }
}

// Eliminar propiedad física o lógicamente y removerla de portales
export async function DELETE(req, { params }) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = params;

  try {
    // Buscar la propiedad y su estado de sincronización
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: { syncState: true },
    });

    if (!property) {
      return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 });
    }

    // 1. Dar de baja de Argenprop si estaba publicado
    if (property.syncState?.argenpropId) {
      await deleteFromArgenprop(property.syncState.argenpropId);
    }

    // 2. Pausar o borrar de Mercado Libre si estaba publicado
    if (property.syncState?.meliId) {
      await updateMeliStatus(property.syncState.meliId, 'paused');
    }

    // 3. Eliminar de la base de datos local (Cascades SyncState y ContactMessages)
    await prisma.property.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      success: true,
      message: 'Propiedad eliminada y dada de baja de los portales correctamente.',
    });
  } catch (error) {
    console.error('Error admin properties DELETE:', error);
    return NextResponse.json({ error: 'Error al eliminar la propiedad' }, { status: 500 });
  }
}
