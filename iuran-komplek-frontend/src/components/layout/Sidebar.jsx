import { NavLink } from 'react-router-dom';

const menuItems = [
  { to: '/', label: 'Ringkasan Laporan', end: true },
  { to: '/penghuni', label: 'Penghuni' },
  { to: '/rumah', label: 'Rumah' },
  { to: '/jenis-iuran', label: 'Jenis Iuran' },
  { to: '/pembayaran', label: 'Pembayaran' },
  { to: '/pengeluaran', label: 'Pengeluaran' },
  { to: '/laporan-bulanan', label: 'Detail Laporan Bulanan' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Iuran Komplek</div>
      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
