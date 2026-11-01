import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El backend permite por CORS el puerto 5173, por eso se fija aquí
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true }
});
