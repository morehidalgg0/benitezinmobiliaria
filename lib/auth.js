import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-gold-estate';
const COOKIE_NAME = 'benitez_session';

/**
 * Firma un token JWT para la sesión
 * @param {Object} payload - Datos del usuario
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

/**
 * Verifica un token JWT
 * @param {string} token - Token JWT
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

/**
 * Obtiene la sesión de administrador desde las cookies de la petición
 * @param {Request} req - Petición HTTP
 */
export function getSession(req) {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => c.trim().split('='))
  );

  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  return verifyToken(token);
}

/**
 * Genera la cabecera Cookie para guardar la sesión
 * @param {string} token - Token JWT
 */
export function getSessionCookieHeader(token) {
  const maxAge = 60 * 60 * 24; // 1 día en segundos
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}; Secure=${process.env.NODE_ENV === 'production'}`;
}

/**
 * Genera la cabecera Cookie para cerrar sesión
 */
export function getLogoutCookieHeader() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Secure=${process.env.NODE_ENV === 'production'}`;
}
