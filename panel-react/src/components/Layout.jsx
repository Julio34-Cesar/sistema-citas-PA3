import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Barra de navegación + contenido de la página actual
export default function Layout() {
  const { usuario, esAdmin, logout } = useAuth();

  return (
    <>
      <nav className="menu">
        <span className="logo">Panel React · Gestión de Citas</span>
        {usuario && (
          <>
            <NavLink to="/" end>Dashboard</NavLink>
            <NavLink to="/citas" end>Citas</NavLink>
            <NavLink to="/citas/nueva">Nueva cita</NavLink>
            <span className="usuario">
              {usuario.nombre} ({usuario.rol})
              {esAdmin && <span className="insignia">ADMIN</span>}
            </span>
            <button className="btn secundario" type="button" onClick={() => logout()}>
              Cerrar sesión
            </button>
          </>
        )}
      </nav>
      <main className="contenedor">
        <Outlet />
      </main>
    </>
  );
}
