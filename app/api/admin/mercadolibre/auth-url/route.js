import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getMeliAuthUrl } from '@/lib/mercadolibre';

export async function GET(req) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const url = getMeliAuthUrl();
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error fetching ML auth URL:', error);
    return NextResponse.json({ error: 'Error al obtener la URL de autenticación' }, { status: 500 });
  }
}
