import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken, getSessionCookieHeader } from '@/lib/auth';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas.' },
        { status: 401 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: 'Credenciales inválidas.' },
        { status: 401 }
      );
    }

    // Firmar token y setear cookie
    const token = signToken({ id: user.id, username: user.username });
    const cookieHeader = getSessionCookieHeader(token);

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username },
    });

    response.headers.set('Set-Cookie', cookieHeader);
    return response;
  } catch (error) {
    console.error('Error en Login API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
