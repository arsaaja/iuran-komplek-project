import { useEffect, useState } from 'react';
import { houseApi } from '../../api/houseApi';
import HouseForm from './HouseForm';
import HouseHistory from './HouseHistory';

export default function HouseList() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [historyHouseId, setHistoryHouseId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const { data } = await houseApi.list({ per_page: 50 });
    setHouses(data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (house) => {
    setEditing(house);
    setShowForm(true);
  };

  const handleDelete = async (house) => {
    if (!window.confirm(`Hapus data rumah "${house.house_number}"?`)) return;
    await houseApi.remove(house.id);
    loadData();
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditing(null);
    loadData();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Data Rumah</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          Tambah Rumah
        </button>
      </div>

      {showForm && (
        <HouseForm house={editing} onCancel={() => setShowForm(false)} onSaved={handleSaved} />
      )}

      {historyHouseId && (
        <HouseHistory houseId={historyHouseId} onClose={() => setHistoryHouseId(null)} />
      )}

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>No. Rumah</th>
              <th>Tipe</th>
              <th>Status</th>
              <th>Penghuni Saat Ini</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {houses.map((house) => (
              <tr key={house.id}>
                <td>{house.house_number}</td>
                <td>{house.house_type === 'tetap' ? 'Tetap' : 'Kontrak'}</td>
                <td>
                  <span className={`badge badge-${house.status}`}>
                    {house.status === 'dihuni' ? 'Dihuni' : 'Tidak Dihuni'}
                  </span>
                </td>
                <td>{house.current_resident?.name || '-'}</td>
                <td className="table-actions">
                  <button className="btn btn-small" onClick={() => handleEdit(house)}>
                    Ubah
                  </button>
                  <button
                    className="btn btn-small"
                    onClick={() => setHistoryHouseId(house.id)}
                  >
                    Riwayat
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => handleDelete(house)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {houses.length === 0 && (
              <tr>
                <td colSpan={5}>Belum ada data rumah.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
