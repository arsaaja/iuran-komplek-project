import { useEffect, useState } from 'react';
import { residentApi } from '../../api/residentApi';
import { dueTypeApi } from '../../api/dueTypeApi';
import { paymentApi } from '../../api/paymentApi';
import { monthName } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

const currentYear = new Date().getFullYear();

export default function PaymentForm({ onSaved }) {
  const [residents, setResidents] = useState([]);
  const [dueTypes, setDueTypes] = useState([]);
  const [residentId, setResidentId] = useState('');
  const [selectedResident, setSelectedResident] = useState(null);
  const [selectedDueTypes, setSelectedDueTypes] = useState([]);
  const [monthFrom, setMonthFrom] = useState(new Date().getMonth() + 1);
  const [monthTo, setMonthTo] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    residentApi.list({ per_page: 100 }).then(({ data }) => setResidents(data.data || []));
    dueTypeApi.list().then(({ data }) => setDueTypes(data));
  }, []);

  useEffect(() => {
    if (!residentId) {
      setSelectedResident(null);
      return;
    }
    residentApi.get(residentId).then(({ data }) => setSelectedResident(data));
  }, [residentId]);

  const toggleDueType = (dueTypeId) => {
    setSelectedDueTypes((prev) =>
      prev.includes(dueTypeId) ? prev.filter((id) => id !== dueTypeId) : [...prev, dueTypeId]
    );
  };

  const buildPeriods = () => {
    const periods = [];
    for (let month = Number(monthFrom); month <= Number(monthTo); month++) {
      periods.push(month);
    }
    return periods;
  };

  const estimatedTotal = () => {
    const periods = buildPeriods();
    const selectedAmounts = dueTypes
      .filter((dueType) => selectedDueTypes.includes(dueType.id))
      .reduce((sum, dueType) => sum + Number(dueType.amount), 0);
    return selectedAmounts * periods.length;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});

    const periods = buildPeriods();
    const items = [];
    for (const dueTypeId of selectedDueTypes) {
      for (const month of periods) {
        items.push({ due_type_id: dueTypeId, period_month: month, period_year: year });
      }
    }

    const payload = {
      resident_id: residentId,
      house_id: selectedResident?.current_house?.id,
      payment_date: paymentDate,
      note,
      items,
    };

    try {
      await paymentApi.create(payload);
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
      <h2>Input Pembayaran</h2>

      <div className="form-row">
        <label>Penghuni</label>
        <select value={residentId} onChange={(event) => setResidentId(event.target.value)} required>
          <option value="">-- Pilih Penghuni --</option>
          {residents.map((resident) => (
            <option key={resident.id} value={resident.id}>
              {resident.name}
            </option>
          ))}
        </select>
        {errors.resident_id && <span className="form-error">{errors.resident_id[0]}</span>}
      </div>

      {selectedResident && (
        <div className="info-box">
          Rumah: {selectedResident.current_house?.house_number || 'Belum terhubung rumah'}
        </div>
      )}
      {errors.house_id && <span className="form-error">{errors.house_id[0]}</span>}

      <div className="form-row">
        <label>Jenis Iuran</label>
        <div className="checkbox-group">
          {dueTypes.map((dueType) => (
            <label key={dueType.id} className="checkbox-item">
              <input
                type="checkbox"
                checked={selectedDueTypes.includes(dueType.id)}
                onChange={() => toggleDueType(dueType.id)}
              />
              {dueType.name} ({formatCurrency(dueType.amount)}/bulan)
            </label>
          ))}
        </div>
        {errors.items && <span className="form-error">{errors.items[0]}</span>}
      </div>

      <div className="form-row form-row-inline">
        <div>
          <label>Dari Bulan</label>
          <select value={monthFrom} onChange={(event) => setMonthFrom(event.target.value)}>
            {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
              <option key={month} value={month}>
                {monthName(month)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Sampai Bulan</label>
          <select value={monthTo} onChange={(event) => setMonthTo(event.target.value)}>
            {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
              <option key={month} value={month}>
                {monthName(month)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Tahun</label>
          <input
            type="number"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
        </div>
      </div>

      <p className="hint-text">
        Pilih rentang bulan yang sama untuk bayar sekaligus (misalnya Januari - Desember untuk
        pembayaran 1 tahun).
      </p>

      <div className="form-row">
        <label>Tanggal Bayar</label>
        <input
          type="date"
          value={paymentDate}
          onChange={(event) => setPaymentDate(event.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <label>Catatan (opsional)</label>
        <input value={note} onChange={(event) => setNote(event.target.value)} />
      </div>

      <div className="total-box">Estimasi Total: {formatCurrency(estimatedTotal())}</div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan Pembayaran'}
        </button>
      </div>
    </form>
  );
}
