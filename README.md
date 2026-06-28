# Benítez Inmobiliaria - Plataforma Web Premium & Sync Portal

Este es el sistema web completo para **Benítez Inmobiliaria** (benitezinmobiliaria.com.ar), desarrollado con Next.js 14, Tailwind CSS, Prisma y PostgreSQL. Cuenta con un diseño elegante de alta gama en tonos oscuros y dorados (champagne), y un panel de administración integrado para gestionar el catálogo y publicar de forma automatizada en **Argenprop** y **Mercado Libre Inmuebles (MLA1459)**.

---

## 🎨 Identidad Visual y Diseño
* **Acento Principal**: Dorado Champagne (`#c5a880`)
* **Fondo Principal**: Negro mate (`#0a0a0a`) / Gris oscuro (`#121212`)
* **Tipografía**: Montserrat (Raleway fallback) para máxima elegancia
* **Efectos**: Glassmorphic, transiciones suaves de zoom en tarjetas de propiedades y diseño adaptativo completo (mobile-first).

---

## 🗂️ Esquema de Base de Datos (PostgreSQL)
La base de datos utiliza **Prisma ORM** con los siguientes modelos:
* `User`: Credenciales del administrador.
* `Property`: Ficha técnica de inmuebles (ambientes, superficies, precios en ARS/USD, fotos, etc.).
* `Development` (Emprendimientos): Proyectos de pozo o terminados.
* `SyncState`: Estado de publicación y errores en Argenprop y Mercado Libre por cada propiedad.
* `ContactMessage`: Bandeja de entrada de formularios de consulta.
* `MeliCredentials`: Almacena de forma persistente los tokens OAuth 2.0 (Access & Refresh Token) de Mercado Libre.

---

## 🚀 Requisitos e Instalación

### 1. Clonar o Ubicar el Proyecto
El proyecto se encuentra ubicado en:
`C:\Users\Usuario\.gemini\antigravity\scratch\benitez-inmobiliaria`

### 2. Configurar Variables de Entorno
Cree o edite el archivo `.env` en la raíz del proyecto con las siguientes claves:

```env
# Conexión Base de Datos PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"

# Clave secreta para firmar sesiones JWT
JWT_SECRET="benitez-secret-key-premium-token-2026-gold-estate"

# URL de la aplicación (usada para redireccionamientos de Mercado Libre)
NEXT_PUBLIC_APP_URL="http://localhost:3005"

# Modo Simulación de APIs (Activar 'true' para probar localmente sin credenciales reales)
API_SIMULATION_MODE="true"

# Credenciales de Argenprop (ArgonProp REST API)
ARGENPROP_API_KEY="mock_argenprop_api_key_benitez_2026"

# Credenciales de Mercado Libre
MELI_CLIENT_ID="mock_meli_client_id_789456"
MELI_CLIENT_SECRET="mock_meli_client_secret_xyz123"
```

### 3. Instalar Dependencias
Ejecute en la terminal:
```bash
npm install
```

### 4. Sincronizar Base de Datos y Generar Cliente Prisma
Corra el siguiente comando para crear/actualizar las tablas en PostgreSQL:
```bash
npm run db:push
```

### 5. Cargar Datos de Prueba (Seeding)
Para generar el usuario administrador y las propiedades modelo, ejecute solo una vez:
```bash
npm run db:seed
```

Importante: el seed borra datos existentes y vuelve a crear datos de prueba. No lo ejecute sobre una base con datos reales.

### 6. Iniciar Servidor de Desarrollo
Inicie la aplicación localmente:
```bash
npm run dev
```
El sitio estará disponible en [http://localhost:3005](http://localhost:3005).

---

## 🔑 Credenciales Administrador por Defecto
* **Usuario**: `admin`
* **Contraseña**: `admin123`
* **Acceso**: [http://localhost:3005/admin/login](http://localhost:3005/admin/login)

---

## 🔌 Guía de Integración de APIs

El sistema implementa un **Modo Simulación** (`API_SIMULATION_MODE="true"`). Con esta opción activa, todas las publicaciones simularán el envío y darán respuestas exitosas ficticias en el panel administrador. Para operar con APIs reales, configure la bandera en `false` y complete los siguientes pasos:

### 1. ArgonProp (Argenprop)
1. Solicite su clave de API REST y URL de Endpoint al soporte técnico de Argenprop.
2. Agregue la API Key en la variable `ARGENPROP_API_KEY` en su archivo `.env`.
3. Al crear o modificar una propiedad, el sistema enviará automáticamente un `POST /properties` mapeando los campos internos de Benítez al formato oficial.

### 2. Mercado Libre Inmuebles (Argentina - MLA1459)
Debido a que Mercado Libre utiliza autenticación OAuth 2.0 segura con redirección de 3 pasos, el flujo se integra de la siguiente forma:
1. Ingrese a [Mercado Libre Developers](https://developers.mercadolibre.com.ar/) y cree una aplicación de vendedor.
2. Configure la **Redirect URI** de su aplicación con: `http://localhost:3005/api/auth/mercadolibre/callback` (o su dominio de producción).
3. Obtenga su **Client ID** (App ID) y **Client Secret** (Key) y colóquelos en `.env`.
4. Ingrese al panel administrador de Benítez (`/admin/dashboard`).
5. En la esquina superior derecha verá la sección de Mercado Libre. Haga clic en **Conectar Cuenta**.
6. Será redirigido al portal de Mercado Libre para autorizar a la inmobiliaria.
7. Una vez aceptado, Mercado Libre lo devolverá al sistema. Los tokens se guardarán de manera segura en la base de datos PostgreSQL y se auto-refrescarán antes de expirar sin intervención manual.
8. Al guardar una propiedad (tipo CASA, DEPT, LOTE, PH, LOCAL) marcada como activa, el sistema la publicará automáticamente bajo la categoría inmobiliaria **MLA1459**.

---

## Deploy en Vercel con Datos Persistentes

1. Cree una base PostgreSQL persistente, por ejemplo Vercel Postgres, Neon o Supabase.
2. En Vercel, agregue `DATABASE_URL` en Project Settings -> Environment Variables.
3. Ejecute `npm run db:push` contra esa `DATABASE_URL` para crear las tablas.
4. Ejecute `npm run db:seed` solo si necesita cargar datos iniciales. No lo ejecute después de cargar datos reales desde el panel admin.
5. Haga redeploy. El comando `npm run build` ya no modifica ni resetea la base de datos.
