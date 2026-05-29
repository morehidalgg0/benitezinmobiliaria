import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const developments = await prisma.development.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(developments);
  } catch (error) {
    console.error('Error al obtener los emprendimientos:', error);
    return NextResponse.json(
      { error: 'Error al obtener los emprendimientos.' },
      { status: 500 }
    );
  }
}
