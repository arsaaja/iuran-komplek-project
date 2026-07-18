import { useEffect, useState } from "react";
import { houseApi } from "../../api/houseApi";
import HouseForm from "./HouseForm";
import HouseHistory from "./HouseHistory";
import HouseBillingHistory from "./HouseBillingHistory";

// Sesuai spesifikasi: rumah hanya perlu Create, Read, Update (tanpa Delete).
// Data awal 20 rumah (15 tetap + 5 kontrak) sudah diisi lewat seeder, tapi
// tombol "Tambah Rumah" tetap disediakan untuk penambahan unit baru di masa depan.
export default function HouseList() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [historyHouseId, setHistoryHouseId] = useState(null);
  const [billingHistoryHouseId, setBillingHistoryHouseId] = useState(null);

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
        <HouseForm
          house={editing}
          onCancel={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}

      {historyHouseId && (
        <HouseHistory
          houseId={historyHouseId}
          onClose={() => setHistoryHouseId(null)}
        />
      )}

      {billingHistoryHouseId && (
        <HouseBillingHistory
          houseId={billingHistoryHouseId}
          onClose={() => setBillingHistoryHouseId(null)}
        />
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
                <td>{house.house_type === "tetap" ? "Tetap" : "Kontrak"}</td>
                <td>
                  <span className={`badge badge-${house.status}`}>
                    {house.status === "dihuni" ? "Dihuni" : "Tidak Dihuni"}
                  </span>
                </td>
                <td>{house.current_resident?.name || "-"}</td>
                <td className="table-actions">
                  <button
                    className="btn btn-small"
                    onClick={() => handleEdit(house)}
                  >
                    Ubah
                  </button>
                  <button
                    className="btn btn-small"
                    onClick={() => setHistoryHouseId(house.id)}
                  >
                    Riwayat Penghuni
                  </button>
                  <button
                    className="btn btn-small"
                    onClick={() => setBillingHistoryHouseId(house.id)}
                  >
                    Riwayat Pembayaran
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
