import { useState } from 'react';
import { residentApi } from '../../api/residentApi';

const initialState = {
  name: '',
  resident_type: 'tetap',
  phone_number: '',
  marital_status: 'lajang',
};

export default function ResidentForm({ resident, onCancel, onSaved }) {
  const [form, setForm] = useState(
    resident
      ? {
          name: resident.name,
          resident_type: resident.resident_type,
          phone_number: resident.phone_number,
          marital_status: resident.marital_status,
        }
      : initialState
  );
  const [ktpPhoto, setKtpPhoto] = useState(null);
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

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (ktpPhoto) {
      formData.append('ktp_photo', ktpPhoto);
    }

    try {
      if (resident) {
        await residentApi.update(resident.id, formData);
      } else {
        await residentApi.create(formData);
      }
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
      <h2>{resident ? 'Ubah Penghuni' : 'Tambah Penghuni'}</h2>

      <div className="form-row">
        <label>Nama</label>
        <input name="name" value={form.name} onChange={handleChange} required />
        {errors.name && <span className="form-error">{errors.name[0]}</span>}
      </div>

      <div className="form-row">
        <label>Foto KTP</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setKtpPhoto(event.target.files[0])}
        />
        {errors.ktp_photo && <span className="form-error">{errors.ktp_photo[0]}</span>}
      </div>

      <div className="form-row">
        <label>Status Penghuni</label>
        <select name="resident_type" value={form.resident_type} onChange={handleChange}>
          <option value="tetap">Tetap</option>
          <option value="kontrak">Kontrak</option>
        </select>
      </div>

      <div className="form-row">
        <label>No. Telepon</label>
        <input
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          required
        />
        {errors.phone_number && <span className="form-error">{errors.phone_number[0]}</span>}
      </div>

      <div className="form-row">
        <label>Status Pernikahan</label>
        <select name="marital_status" value={form.marital_status} onChange={handleChange}>
          <option value="lajang">Lajang</option>
          <option value="menikah">Menikah</option>
          <option value="cerai">Cerai</option>
        </select>
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
