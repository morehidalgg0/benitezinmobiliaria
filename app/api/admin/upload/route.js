import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(req) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Nombre de archivo requerido' }, { status: 400 });
  }

  const contentType = req.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    return NextResponse.json({ error: 'Solo se permiten imágenes' }, { status: 400 });
  }

  try {
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '-');
    const pathname = `properties/${Date.now()}-${safeName}`;
    const blob = await put(pathname, req.body, {
      access: 'public',
      contentType,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Error uploading image to Vercel Blob:', error);
    return NextResponse.json({ error: 'No se pudo subir la imagen' }, { status: 500 });
  }
}
