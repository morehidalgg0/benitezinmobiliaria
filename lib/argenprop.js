/**
 * Módulo de integración con la API REST de Argenprop (ArgonProp).
 * Soporta modo simulación para desarrollo local.
 */

const SIMULATION_MODE = process.env.API_SIMULATION_MODE === 'true';
const ARGENPROP_API_KEY = process.env.ARGENPROP_API_KEY || '';
const ARGENPROP_API_URL = process.env.ARGENPROP_API_URL || 'https://api.argenprop.com/v1';

/**
 * Mapea una propiedad de nuestro sistema interno al esquema de Argenprop.
 * @param {Object} property - Objeto Property de Prisma
 */
function mapPropertyToArgenprop(property) {
  // Argenprop requiere tipos y operaciones específicas
  const operationMapping = {
    'VENTA': 'Venta',
    'ALQUILER': 'Alquiler',
    'ALQUILER_TEMPORARIO': 'Alquiler Temporario',
  };

  const typeMapping = {
    'CASA': 'Casa',
    'DEPARTAMENTO': 'Departamento',
    'LOTE': 'Terreno',
    'PH': 'PH',
    'LOCAL': 'Local',
  };

  // Convertir las imágenes del JSON de la base de datos
  let imageUrls = [];
  try {
    imageUrls = JSON.parse(property.images || '[]');
  } catch (e) {
    imageUrls = [];
  }

  return {
    title: property.title,
    description: property.description,
    price: {
      amount: property.price,
      currency: property.currency, // "USD" o "ARS"
    },
    operation_type: operationMapping[property.operation] || 'Venta',
    property_type: typeMapping[property.type] || 'Departamento',
    surface: {
      total: property.totalArea,
      covered: property.coveredArea,
    },
    rooms: property.rooms,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    has_garage: property.garage,
    location: {
      address: property.address,
      neighborhood: property.neighborhood,
      country: 'Argentina',
    },
    photos: imageUrls,
  };
}

/**
 * Publica o actualiza una propiedad en Argenprop.
 * @param {Object} property - Objeto Property de Prisma
 * @returns {Promise<{success: boolean, remoteId?: string, error?: string}>}
 */
export async function publishToArgenprop(property) {
  if (SIMULATION_MODE) {
    console.log(`[Argenprop Simulación] Publicando propiedad #${property.id}: "${property.title}"`);
    // Simulamos latencia de red
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Generar un ID remoto ficticio
    const mockRemoteId = `ap-${property.id}-${Math.floor(Math.random() * 10000)}`;
    return {
      success: true,
      remoteId: mockRemoteId
    };
  }

  try {
    const payload = mapPropertyToArgenprop(property);
    
    const response = await fetch(`${ARGENPROP_API_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ARGENPROP_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error en Argenprop: ${response.statusText}`);
    }

    return {
      success: true,
      remoteId: data.id || `ap-${property.id}-${Date.now()}`
    };
  } catch (error) {
    console.error('Error al publicar en Argenprop:', error);
    return {
      success: false,
      error: error.message || 'Error de conexión'
    };
  }
}

/**
 * Elimina una publicación de Argenprop.
 * @param {string} remoteId - ID de la publicación en Argenprop
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteFromArgenprop(remoteId) {
  if (!remoteId) return { success: true };

  if (SIMULATION_MODE) {
    console.log(`[Argenprop Simulación] Eliminando publicación remota: ${remoteId}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  }

  try {
    const response = await fetch(`${ARGENPROP_API_URL}/properties/${remoteId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${ARGENPROP_API_KEY}`,
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || `Error al dar de baja en Argenprop: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error al eliminar de Argenprop:', error);
    return {
      success: false,
      error: error.message || 'Error de conexión'
    };
  }
}
