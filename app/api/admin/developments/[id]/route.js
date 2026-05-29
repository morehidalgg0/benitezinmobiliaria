import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(req, { params }) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = params;

  try {
    const body = await req.json();
    const { title, description, status, location, images } = body;

    const existing = await prisma.development.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Emprendimiento no encontrado' }, { status: 404 });
    }

    const updated = await prisma.development.update({
      where: { id: Number(id) },
      data: {
        title: title !== undefined ? title : existing.title,
        description: description !== undefined ? description : existing.description,
        status: status !== undefined ? status : existing.status,
        location: location !== undefined ? location : existing.location,
        images: images !== undefined ? (Array.isArray(images) ? JSON.stringify(images) : images) : existing.images,
      },
    });

    return NextResponse.json({ success: true, development: updated });
  } catch (error) {
    console.error('Error admin developments PUT:', error);
    return NextResponse.json({ error: 'Error al actualizar el emprendimiento' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = params;

  try {
    const existing = await prisma.development.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Emprendimiento no encontrado' }, { status: 404 });
    }

    await prisma.development.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      success: true,
      message: 'Emprendimiento eliminado correctamente.',
    });
  } catch (error) {
    console.error('Error admin developments DELETE:', error);
    return NextResponse.json({ error: 'Error al eliminar el emprendimiento' }, { status: 500 });
  }
}
