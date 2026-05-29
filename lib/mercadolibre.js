import prisma from './prisma';

const SIMULATION_MODE = process.env.API_SIMULATION_MODE === 'true';
const MELI_CLIENT_ID = process.env.MELI_CLIENT_ID || '';
const MELI_CLIENT_SECRET = process.env.MELI_CLIENT_SECRET || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005';
const REDIRECT_URI = `${APP_URL}/api/auth/mercadolibre/callback`;

/**
 * Retorna la URL de autorización para el flujo OAuth 2.0
 */
export function getMeliAuthUrl() {
  if (SIMULATION_MODE) {
    return `${APP_URL}/api/auth/mercadolibre/callback?code=mock_authorization_code_12345`;
  }
  return `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${MELI_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
}

/**
 * Intercambia el código de autorización por tokens de acceso
 * @param {string} code - Código de autorización
 */
export async function exchangeMeliCode(code) {
  if (SIMULATION_MODE) {
    console.log('[Meli Simulación] Intercambiando código OAuth...');
    const credentials = {
      accessToken: 'mock_access_token_abc123',
      refreshToken: 'mock_refresh_token_def456',
      expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 horas
    };

    await prisma.meliCredentials.upsert({
      where: { id: 1 },
      update: credentials,
      create: { id: 1, ...credentials },
    });

    return { success: true };
  }

  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: MELI_CLIENT_ID,
      client_secret: MELI_CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
    });

    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error de Mercado Libre: ${response.statusText}`);
    }

    const credentials = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };

    await prisma.meliCredentials.upsert({
      where: { id: 1 },
      update: credentials,
      create: { id: 1, ...credentials },
    });

    return { success: true };
  } catch (error) {
    console.error('Error al intercambiar código de Mercado Libre:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene un token de acceso válido. Si está expirado, lo refresca automáticamente.
 */
async function getValidAccessToken() {
  if (SIMULATION_MODE) {
    return 'mock_access_token_abc123';
  }

  const credentials = await prisma.meliCredentials.findUnique({
    where: { id: 1 },
  });

  if (!credentials) {
    throw new Error('No autenticado con Mercado Libre. Por favor, conecte su cuenta en el panel de administración.');
  }

  // Si expira en menos de 5 minutos, refrescar
  const isExpired = new Date(Date.now() + 5 * 60 * 1000) >= new Date(credentials.expiresAt);

  if (!isExpired) {
    return credentials.accessToken;
  }

  console.log('[Meli] Token expirado o por expirar. Refrescando...');
  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: MELI_CLIENT_ID,
      client_secret: MELI_CLIENT_SECRET,
      refresh_token: credentials.refreshToken,
    });

    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error al refrescar token: ${response.statusText}`);
    }

    const updatedCredentials = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };

    await prisma.meliCredentials.update({
      where: { id: 1 },
      data: updatedCredentials,
    });

    return data.access_token;
  } catch (error) {
    console.error('Error al refrescar token de Mercado Libre:', error);
    throw new Error('Error al refrescar credenciales de Mercado Libre. Inicie sesión nuevamente.');
  }
}

/**
 * Mapea una propiedad de nuestro sistema interno al esquema de Mercado Libre (MLA1459).
 */
function mapPropertyToMeli(property) {
  // Conversión de operación
  let operationType = 'Para la venta';
  if (property.operation === 'ALQUILER') {
    operationType = 'Para alquiler';
  } else if (property.operation === 'ALQUILER_TEMPORARIO') {
    operationType = 'Alquiler temporario';
  }

  // Conversión de tipo de inmueble
  let propertyType = 'Departamento';
  if (property.type === 'CASA') propertyType = 'Casa';
  if (property.type === 'LOTE') propertyType = 'Terreno';
  if (property.type === 'PH') propertyType = 'PH';
  if (property.type === 'LOCAL') propertyType = 'Local comercial';

  // Conversión de fotos
  let imageUrls = [];
  try {
    imageUrls = JSON.parse(property.images || '[]');
  } catch (e) {
    imageUrls = [];
  }

  // Mercado Libre requiere URLs completas de imágenes accesibles públicamente
  // Para pruebas usaremos las URLs provistas
  const pictures = imageUrls.map(url => ({ source: url }));

  return {
    title: property.title.substring(0, 60), // Límite de ML para títulos
    category_id: 'MLA1459', // Categoría Inmuebles
    price: property.price,
    currency_id: property.currency, // "ARS" o "USD"
    available_quantity: 1,
    buying_mode: 'buy_it_now',
    listing_type_id: 'silver', // Tipo de publicación estándar
    condition: 'not_specified',
    pictures: pictures.length > 0 ? pictures : [{ source: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2' }],
    attributes: [
      { id: 'OPERATION', value_name: operationType },
      { id: 'PROPERTY_TYPE', value_name: propertyType },
      { id: 'TOTAL_AREA', value_name: `${property.totalArea} m²` },
      { id: 'COVERED_AREA', value_name: `${property.coveredArea} m²` },
      { id: 'ROOMS', value_name: String(property.rooms) },
      { id: 'BEDROOMS', value_name: String(property.bedrooms) },
      { id: 'BATHROOMS', value_name: String(property.bathrooms) },
    ],
    location: {
      address_line: property.address,
      state: { id: 'AR-C' }, // Buenos Aires
      city: { name: property.neighborhood.split(',')[0].trim() },
    },
  };
}

/**
 * Publica una propiedad en Mercado Libre.
 */
export async function publishToMeli(property) {
  if (SIMULATION_MODE) {
    console.log(`[Meli Simulación] Publicando propiedad #${property.id}: "${property.title}"`);
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      remoteId: `mla-item-${property.id}-${Math.floor(Math.random() * 10000)}`,
    };
  }

  try {
    const accessToken = await getValidAccessToken();
    const payload = mapPropertyToMeli(property);

    const response = await fetch('https://api.mercadolibre.com/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error en Mercado Libre: ${response.statusText}`);
    }

    return {
      success: true,
      remoteId: data.id,
    };
  } catch (error) {
    console.error('Error al publicar en Mercado Libre:', error);
    return {
      success: false,
      error: error.message || 'Error de conexión',
    };
  }
}

/**
 * Pausa o reactiva una publicación en Mercado Libre.
 */
export async function updateMeliStatus(remoteId, status) {
  // status puede ser 'active' o 'paused'
  if (SIMULATION_MODE) {
    console.log(`[Meli Simulación] Cambiando estado de publicación ${remoteId} a: ${status}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  }

  try {
    const accessToken = await getValidAccessToken();
    const response = await fetch(`https://api.mercadolibre.com/items/${remoteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error al actualizar estado en Mercado Libre: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error al actualizar estado en Mercado Libre:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verifica si hay una cuenta de Mercado Libre vinculada.
 */
export async function isMeliConnected() {
  if (SIMULATION_MODE) {
    return true; // Siempre simulamos que está conectado
  }
  const count = await prisma.meliCredentials.count();
  return count > 0;
}

/**
 * Elimina la vinculación con Mercado Libre.
 */
export async function disconnectMeli() {
  await prisma.meliCredentials.deleteMany({});
  return { success: true };
}
