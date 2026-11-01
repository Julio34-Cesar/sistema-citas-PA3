Instrucciones de ejecución
Backend
cd backend
npm install
copiar .env.example a .env y completar MONGO_URI y JWT_SECRET
node scripts/crear-admin.js "Nombre" correo@ejemplo.com clave (una sola vez)
npm start (http://localhost:3000)


Cliente Angular
cd frontend
npm install
ng serve (http://localhost:4200)
(la URL de la API se cambia en src/app/config.ts)


Panel React
cd panel-react
npm install
npm run dev (http://localhost:5173)
(la URL de la API se toma de VITE_API_URL; por defecto http://localhost:3000/api)
