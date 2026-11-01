import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Protege un grupo de rutas.
//  - Sin sesión: manda al login y recuerda a dónde quería ir.
//  - Con soloAdmin: los usuarios normales vuelven a la lista de citas.
export default function RutaProtegida({ soloAdmin = false }) {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (soloAdmin && usuario.rol !== 'admin') {
    return <Navigate to="/citas" replace />;
  }
  return <Outlet />;
}
