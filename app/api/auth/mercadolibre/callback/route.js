import { NextResponse } from 'next/server';
import { exchangeMeliCode } from '@/lib/mercadolibre';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (error) {
    console.error('Error de autorización en Mercado Libre:', error);
    return NextResponse.redirect(`${appUrl}/admin/dashboard?meli_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${appUrl}/admin/dashboard?meli_error=no_code_provided`);
  }

  const result = await exchangeMeliCode(code);

  if (result.success) {
    return NextResponse.redirect(`${appUrl}/admin/dashboard?meli_success=true`);
  } else {
    return NextResponse.redirect(`${appUrl}/admin/dashboard?meli_error=${encodeURIComponent(result.error || 'token_exchange_failed')}`);
  }
}
