import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { name, email, phone, message, propertyId } = await req.json();

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios.' },
        { status: 400 }
      );
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        message,
        propertyId: propertyId ? Number(propertyId) : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Mensaje recibido correctamente.',
      data: newMessage,
    });
  } catch (error) {
    console.error('Error al guardar mensaje de contacto:', error);
    return NextResponse.json(
      { error: 'Error al enviar el mensaje de contacto.' },
      { status: 500 }
    );
  }
}
