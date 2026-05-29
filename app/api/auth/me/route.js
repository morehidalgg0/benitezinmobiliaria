import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(req) {
  const session = getSession(req);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: { id: session.id, username: session.username },
  });
}
