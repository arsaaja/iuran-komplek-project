import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div>Selamat datang, {user?.name || '-'}</div>
      <button className="btn btn-secondary" onClick={logout}>
        Keluar
      </button>
    </header>
  );
}
