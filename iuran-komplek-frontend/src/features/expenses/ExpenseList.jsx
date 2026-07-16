import { useEffect, useState } from 'react';
import { expenseApi } from '../../api/expenseApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import ExpenseForm from './ExpenseForm';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const { data } = await expenseApi.list({ per_page: 30 });
    setExpenses(data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (expense) => {
    if (!window.confirm(`Hapus data pengeluaran "${expense.category}"?`)) return;
    await expenseApi.remove(expense.id);
    loadData();
  };

  const handleSaved = () => {
    setShowForm(false);
    loadData();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Pengeluaran</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Tambah Pengeluaran
        </button>
      </div>

      {showForm && <ExpenseForm onSaved={handleSaved} onCancel={() => setShowForm(false)} />}

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Kategori</th>
              <th>Keterangan</th>
              <th>Jumlah</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{formatDate(expense.expense_date)}</td>
                <td>{expense.category}</td>
                <td>{expense.description || '-'}</td>
                <td>{formatCurrency(expense.amount)}</td>
                <td className="table-actions">
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => handleDelete(expense)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={5}>Belum ada data pengeluaran.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
