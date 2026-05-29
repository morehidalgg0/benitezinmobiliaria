import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: {
        syncState: true,
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Propiedad no encontrada.' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error al obtener la propiedad:', error);
    return NextResponse.json(
      { error: 'Error al obtener la propiedad.' },
      { status: 500 }
    );
  }
}
