import { useEffect, useState } from 'react';
import { houseApi } from '../../api/houseApi';
import { formatDate } from '../../utils/formatDate';

export default function HouseHistory({ houseId, onClose }) {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    houseApi.histories(houseId).then(({ data }) => {
      setHistories(data);
      setLoading(false);
    });
  }, [houseId]);

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="page-header">
          <h2>Riwayat Penghuni</h2>
          <button className="btn btn-secondary" onClick={onClose}>
            Tutup
          </button>
        </div>

        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama Penghuni</th>
                <th>Mulai</th>
                <th>Selesai</th>
              </tr>
            </thead>
            <tbody>
              {histories.map((history) => (
                <tr key={history.id}>
                  <td>{history.resident?.name}</td>
                  <td>{formatDate(history.start_date)}</td>
                  <td>{history.is_current ? 'Masih tinggal' : formatDate(history.end_date)}</td>
                </tr>
              ))}
              {histories.length === 0 && (
                <tr>
                  <td colSpan={3}>Belum ada riwayat.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
