import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CitasProvider } from './context/CitasContext.jsx';
import './styles.css';

// Los proveedores de contexto envuelven toda la aplicación (estado global, T10)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CitasProvider>
          <App />
        </CitasProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
