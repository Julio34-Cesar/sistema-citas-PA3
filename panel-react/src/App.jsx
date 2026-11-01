import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Citas from './pages/Citas.jsx';
import CitaForm from './pages/CitaForm.jsx';

export default function App() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        {/* Rutas protegidas: requieren sesión iniciada */}
        <Route element={<RutaProtegida />}>
          <Route index element={<Dashboard />} />
          <Route path="citas" element={<Citas />} />
          <Route path="citas/nueva" element={<CitaForm />} />
        </Route>

        {/* Ruta solo para administrador */}
        <Route element={<RutaProtegida soloAdmin />}>
          <Route path="citas/:id/editar" element={<CitaForm />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
