import { useState } from 'react';
import { expenseApi } from '../../api/expenseApi';

const initialState = {
  category: '',
  amount: '',
  expense_date: new Date().toISOString().slice(0, 10),
  description: '',
};

export default function ExpenseForm({ onSaved, onCancel }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      await expenseApi.create(form);
      onSaved();
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Tambah Pengeluaran</h2>

      <div className="form-row">
        <label>Kategori</label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Contoh: Gaji Satpam, Alat Kebersihan"
          required
        />
        {errors.category && <span className="form-error">{errors.category[0]}</span>}
      </div>

      <div className="form-row">
        <label>Jumlah</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        {errors.amount && <span className="form-error">{errors.amount[0]}</span>}
      </div>

      <div className="form-row">
        <label>Tanggal</label>
        <input
          type="date"
          name="expense_date"
          value={form.expense_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <label>Keterangan (opsional)</label>
        <input name="description" value={form.description} onChange={handleChange} />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}
