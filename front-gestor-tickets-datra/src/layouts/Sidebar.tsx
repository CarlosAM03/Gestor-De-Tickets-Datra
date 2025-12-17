import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <strong>Datra</strong>
        <small>{user?.role}</small>
      </div>

      <nav className="sidebar-nav">
        <Link to="/">Dashboard</Link>
        <Link to="/tickets">Tickets</Link>

        {user?.role === 'ADMIN' && (
          <Link to="/users">Usuarios</Link>
        )}
      </nav>

      <button className="sidebar-logout" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}
