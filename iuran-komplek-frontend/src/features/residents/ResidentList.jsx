import { useEffect, useState } from "react";
import { residentApi } from "../../api/residentApi";
import ResidentForm from "./ResidentForm";

export default function ResidentList() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const { data } = await residentApi.list({ per_page: 50 });
    setResidents(data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (resident) => {
    setEditing(resident);
    setShowForm(true);
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditing(null);
    loadData();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Data Penghuni</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          Tambah Penghuni
        </button>
      </div>

      {showForm && (
        <ResidentForm
          resident={editing}
          onCancel={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Status</th>
              <th>No. Telepon</th>
              <th>Status Pernikahan</th>
              <th>Rumah Saat Ini</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {residents.map((resident) => (
              <tr key={resident.id}>
                <td>{resident.name}</td>
                <td>
                  <span className={`badge badge-${resident.resident_type}`}>
                    {resident.resident_type === "tetap" ? "Tetap" : "Kontrak"}
                  </span>
                </td>
                <td>{resident.phone_number}</td>
                <td>{resident.marital_status}</td>
                <td>{resident.current_house?.house_number || "-"}</td>
                <td className="table-actions">
                  <button
                    className="btn btn-small"
                    onClick={() => handleEdit(resident)}
                  >
                    Ubah
                  </button>
                </td>
              </tr>
            ))}
            {residents.length === 0 && (
              <tr>
                <td colSpan={6}>Belum ada data penghuni.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
