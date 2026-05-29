import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { disconnectMeli } from '@/lib/mercadolibre';

export async function POST(req) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const result = await disconnectMeli();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error disconnecting Mercado Libre:', error);
    return NextResponse.json({ error: 'Error al desconectar Mercado Libre' }, { status: 500 });
  }
}
