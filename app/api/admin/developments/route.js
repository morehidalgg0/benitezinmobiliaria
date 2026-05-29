import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const developments = await prisma.development.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(developments);
  } catch (error) {
    console.error('Error admin developments GET:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function POST(req) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, status, location, images } = body;

    if (!title || !description || !status || !location) {
      return NextResponse.json({ error: 'Campos obligatorios faltantes' }, { status: 400 });
    }

    const development = await prisma.development.create({
      data: {
        title,
        description,
        status, // "CONSTRUCTION" o "FINISHED"
        location,
        images: Array.isArray(images) ? JSON.stringify(images) : (images || '[]'),
      },
    });

    return NextResponse.json({ success: true, development });
  } catch (error) {
    console.error('Error admin developments POST:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
