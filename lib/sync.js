import prisma from './prisma';
import { publishToArgenprop, deleteFromArgenprop } from './argenprop';
import { publishToMeli, updateMeliStatus } from './mercadolibre';

/**
 * Sincroniza una propiedad con Argenprop y Mercado Libre.
 * @param {number} propertyId - ID de la propiedad a sincronizar.
 */
export async function syncProperty(propertyId) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: Number(propertyId) },
      include: { syncState: true },
    });

    if (!property) {
      return { success: false, error: 'Propiedad no encontrada en la base de datos' };
    }

    let syncState = property.syncState;
    if (!syncState) {
      syncState = await prisma.syncState.create({
        data: { propertyId: property.id },
      });
    }

    // 1. Caso: Propiedad Inactiva (Dar de baja o pausar en portales)
    if (!property.active) {
      let argenpropStatus = 'NOT_PUBLISHED';
      let argenpropError = null;
      let meliStatus = 'PAUSED';
      let meliError = null;

      // Dar de baja en Argenprop
      if (syncState.argenpropId) {
        const apDelete = await deleteFromArgenprop(syncState.argenpropId);
        if (!apDelete.success) {
          argenpropStatus = 'ERROR';
          argenpropError = apDelete.error;
        }
      }

      // Pausar en Mercado Libre
      if (syncState.meliId) {
        const meliPause = await updateMeliStatus(syncState.meliId, 'paused');
        if (!meliPause.success) {
          meliStatus = 'ERROR';
          meliError = meliPause.error;
        }
      }

      const updatedState = await prisma.syncState.update({
        where: { propertyId: property.id },
        data: {
          argenpropStatus,
          argenpropError,
          meliStatus,
          meliError,
          lastSynced: new Date(),
        },
      });

      return { success: true, syncState: updatedState };
    }

    // 2. Caso: Propiedad Activa (Sincronizar publicación)
    // --- Sincronización Argenprop ---
    let apSuccess = false;
    let apRemoteId = syncState.argenpropId;
    let apError = null;

    try {
      const apResult = await publishToArgenprop(property);
      if (apResult.success) {
        apSuccess = true;
        apRemoteId = apResult.remoteId;
      } else {
        apError = apResult.error;
      }
    } catch (e) {
      apError = e.message;
    }

    // --- Sincronización Mercado Libre ---
    let meliSuccess = false;
    let meliRemoteId = syncState.meliId;
    let meliError = null;

    try {
      if (syncState.meliId) {
        // Si ya existe, actualizamos a activo
        const meliUpdate = await updateMeliStatus(syncState.meliId, 'active');
        if (meliUpdate.success) {
          meliSuccess = true;
        } else {
          meliError = meliUpdate.error;
        }
      } else {
        // Si no existe, publicamos
        const meliResult = await publishToMeli(property);
        if (meliResult.success) {
          meliSuccess = true;
          meliRemoteId = meliResult.remoteId;
        } else {
          meliError = meliResult.error;
        }
      }
    } catch (e) {
      meliError = e.message;
    }

    // Guardar estados de sincronización en la base de datos
    const updatedState = await prisma.syncState.update({
      where: { propertyId: property.id },
      data: {
        argenpropId: apRemoteId,
        argenpropStatus: apSuccess ? 'ACTIVE' : (apError ? 'ERROR' : 'NOT_PUBLISHED'),
        argenpropError: apError,
        meliId: meliRemoteId,
        meliStatus: meliSuccess ? 'ACTIVE' : (meliError ? 'ERROR' : 'NOT_PUBLISHED'),
        meliError: meliError,
        lastSynced: new Date(),
      },
    });

    return { success: true, syncState: updatedState };
  } catch (error) {
    console.error('Error general en syncProperty:', error);
    return { success: false, error: error.message };
  }
}
