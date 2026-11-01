import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { mensajeError } from '../api/http.js';

export default function Login() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Si ya hay sesión, no tiene sentido mostrar el login
  if (usuario) return <Navigate to="/" replace />;

  const aviso = location.state?.motivo === 'expirada' ? 'Tu sesión expiró. Inicia sesión de nuevo.' : '';

  const enviar = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y tu contraseña');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await login(email.trim(), password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(mensajeError(err, 'Error al iniciar sesión'));
      setEnviando(false);
    }
  };

  return (
    <>
      <nav className="menu">
        <span className="logo">Panel React · Gestión de Citas</span>
      </nav>
      <main className="contenedor estrecho">
        <h2>Iniciar sesión</h2>
        {aviso && <p className="ok">{aviso}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={enviar}>
          <label>
            Correo
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          <button className="btn" type="submit" disabled={enviando}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </main>
    </>
  );
}
