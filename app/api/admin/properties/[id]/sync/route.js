import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { syncProperty } from '@/lib/sync';

export async function POST(req, { params }) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = params;

  try {
    const result = await syncProperty(id);

    if (result.success) {
      return NextResponse.json({
        success: true,
        syncState: result.syncState,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in manual sync API:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor durante la sincronización.',
    }, { status: 500 });
  }
}
