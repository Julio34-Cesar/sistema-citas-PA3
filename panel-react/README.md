# Panel React – Gestión de Citas (PA3)

Panel secundario en React que consume la **misma API REST** (Node + Express + MongoDB) que usa el cliente Angular.

## Tecnologías
- React 18 con componentes funcionales, JSX y Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`)
- React Router DOM 6 (rutas públicas, protegidas y solo para administrador)
- Context API para el estado global (`AuthContext` y `CitasContext`)
- Axios con interceptores (token JWT y manejo de 401)
- Vite

## Estructura
```
src/
├── api/http.js              cliente Axios, interceptores y manejo de la sesión
├── context/AuthContext.jsx  usuario, login, logout y cierre automático al vencer el token
├── context/CitasContext.jsx citas compartidas por todas las páginas
├── components/              Layout (menú) y RutaProtegida
├── pages/                   Login, Dashboard, Citas y CitaForm
└── utils/jwt.js             lectura de la fecha de expiración del token
```

## Ejecución
1. Tener el backend encendido (`npm start` en `backend`, puerto 3000).
2. En esta carpeta:
   ```bash
   npm install
   npm run dev
   ```
3. Abrir `http://localhost:5173` en el navegador.

La URL de la API se toma de la variable `VITE_API_URL` (ver `.env.example`). Si no existe, usa `http://localhost:3000/api`.

## Roles
| Rol | Puede hacer |
|---|---|
| usuario | Ver el dashboard y la lista de citas, registrar citas |
| admin | Todo lo anterior, además de editar y eliminar citas |

## Seguridad
- Las rutas privadas redirigen al login si no hay sesión.
- La ruta de edición solo es accesible para el administrador.
- Si la API responde 401 o el token vence, la sesión se cierra automáticamente y se avisa al usuario.
