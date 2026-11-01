# Bitácora de cambios – Sistema de Gestión de Citas

Registro de correcciones y mejoras realizadas desde la PA2 hasta la PA3.

## [PA3 – 1.3.0] Panel React (T09, T10, T11) – 01/11/2026
### Agregado
- Nuevo cliente `panel-react` (React 18 + Vite) que consume la misma API y la misma base de datos que Angular.
- Rutas con React Router DOM: `/login` (pública), `/`, `/citas`, `/citas/nueva` (protegidas) y `/citas/:id/editar` (solo administrador).
- Estado global con Context API: `AuthContext` (sesión) y `CitasContext` (citas compartidas entre páginas).
- Cliente Axios con interceptores: agrega el token JWT y cierra la sesión si la API responde 401.
- Cierre de sesión automático cuando el token vence (temporizador basado en el campo `exp` del JWT).
- Formulario de citas con las mismas validaciones que Angular y que el esquema de Mongoose.

## [PA3 – 1.2.0] Autenticación en Angular (T04, T07) – 01/11/2026
### Agregado
- Pantallas de inicio de sesión y registro con formularios reactivos y validaciones.
- `AuthService` (sesión en `localStorage`, lectura de expiración del token).
- `AuthInterceptor`: agrega `Authorization: Bearer <token>` y cierra la sesión ante un 401.
- Guards `authGuard` y `adminGuard` para proteger rutas.
- Menú con nombre y rol del usuario, y botón «Cerrar sesión».
- Los botones Editar y Eliminar solo se muestran al administrador.
- `config.ts` con la URL base de la API (un único punto de cambio para el despliegue).
### Cambiado
- `CitaService` usa `API_URL` en lugar de una URL escrita en el código.
### Corregido
- `tsconfig.json`: se agregó `rootDir: "./src"` para eliminar el error TS5011 que mostraba VS Code con TypeScript 6.
- Se eliminó el `app.module.ts` duplicado que estaba fuera de `src/app`.

## [PA3 – 1.1.0] Seguridad en el backend (T05, T07) – 31/10/2026
### Agregado
- Modelo `Usuario` (nombre, correo único, contraseña, rol `admin` o `usuario`).
- Contraseñas cifradas con bcrypt (`bcryptjs`); nunca se devuelven en las respuestas.
- Autenticación con JWT (`jsonwebtoken`) con expiración configurable (`JWT_EXPIRES_IN`).
- Rutas `POST /api/auth/register`, `POST /api/auth/login` y `GET /api/auth/perfil`.
- Middlewares `verificarToken` y `permitirRoles` (respuestas 401 y 403 en JSON).
- Autorización por roles en `/api/citas`: cualquier usuario autenticado puede consultar y registrar; solo el administrador puede editar y eliminar.
- Script `scripts/crear-admin.js` para crear o actualizar el administrador.
- CORS configurable por variable de entorno (`CORS_ORIGINS`) para Angular (4200) y React (5173).
- El servidor no inicia si faltan `MONGO_URI` o `JWT_SECRET`.
### Cambiado
- `.env.example` incluye `JWT_SECRET`, `JWT_EXPIRES_IN` y `CORS_ORIGINS` (sin credenciales reales).
- Todas las rutas de `/api/citas` ahora exigen sesión iniciada.
### Seguridad
- Todo registro público se crea con rol `usuario`; el rol no se acepta desde el cuerpo de la petición.
- El inicio de sesión devuelve el mismo mensaje si falla el correo o la contraseña.
- Se renovaron la contraseña de la base de datos en Atlas y el secreto JWT.

## [PA2 – 1.0.0] CRUD de citas (T01 a T06) – 12/10/2026 al 14/10/2026
### Agregado
- Aplicación Angular 16 + Node.js/Express + MongoDB Atlas para registrar, consultar, editar y eliminar citas.
- Validaciones en Angular (formularios reactivos) y en Mongoose.
- Dashboard con total, citas de hoy y próximas citas.
- Datos de prueba (`datos/citas-prueba.json`) y exportación de la colección (`datos/citas-export.json`).
### Corregido
- Ubicación y nombres de archivos de componentes, servicios y rutas.
- Reinstalación completa de `node_modules` tras una eliminación parcial.
- `tsconfig.json` compatible con VS Code (`moduleResolution: "bundler"`).
- Conexión a Atlas: se agregó la IP del equipo en *Network Access*; `server.js` solo inicia después de conectar.

## Pendiente
- Despliegue del backend y de los dos clientes.
- Repositorio en GitHub con README.
- Informe técnico en PDF y banco de ejercicios.
