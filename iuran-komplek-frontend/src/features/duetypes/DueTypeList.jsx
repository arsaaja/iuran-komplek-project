import { useEffect, useState } from 'react';
import { dueTypeApi } from '../../api/dueTypeApi';
import { formatCurrency } from '../../utils/formatCurrency';

export default function DueTypeList() {
  const [dueTypes, setDueTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState('');

  const loadData = async () => {
    setLoading(true);
    const { data } = await dueTypeApi.list();
    setDueTypes(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const startEdit = (dueType) => {
    setEditingId(dueType.id);
    setEditAmount(dueType.amount);
  };

  const saveEdit = async (dueType) => {
    await dueTypeApi.update(dueType.id, { amount: editAmount });
    setEditingId(null);
    loadData();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Jenis Iuran</h1>
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama</th>
              <th>Nominal / Bulan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dueTypes.map((dueType) => (
              <tr key={dueType.id}>
                <td>{dueType.code}</td>
                <td>{dueType.name}</td>
                <td>
                  {editingId === dueType.id ? (
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(event) => setEditAmount(event.target.value)}
                    />
                  ) : (
                    formatCurrency(dueType.amount)
                  )}
                </td>
                <td className="table-actions">
                  {editingId === dueType.id ? (
                    <button className="btn btn-small btn-primary" onClick={() => saveEdit(dueType)}>
                      Simpan
                    </button>
                  ) : (
                    <button className="btn btn-small" onClick={() => startEdit(dueType)}>
                      Ubah Nominal
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
