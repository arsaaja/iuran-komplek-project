import { useEffect, useState } from 'react';
import { houseApi } from '../../api/houseApi';
import { residentApi } from '../../api/residentApi';

const initialState = {
  house_number: '',
  house_type: 'tetap',
  status: 'tidak_dihuni',
  current_resident_id: '',
};

export default function HouseForm({ house, onCancel, onSaved }) {
  const [form, setForm] = useState(
    house
      ? {
          house_number: house.house_number,
          house_type: house.house_type,
          status: house.status,
          current_resident_id: house.current_resident?.id || '',
        }
      : initialState
  );
  const [residents, setResidents] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    residentApi.list({ per_page: 100 }).then(({ data }) => setResidents(data.data || []));
  }, []);

  const isDihuni = form.status === 'dihuni';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Reset pilihan penghuni jika status diubah jadi tidak dihuni
      ...(name === 'status' && value === 'tidak_dihuni' ? { current_resident_id: '' } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});

    const payload = {
      ...form,
      current_resident_id: form.current_resident_id || null,
    };

    try {
      if (house) {
        await houseApi.update(house.id, payload);
      } else {
        await houseApi.create(payload);
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
      <h2>{house ? 'Ubah Rumah' : 'Tambah Rumah'}</h2>

      <div className="form-row">
        <label>Nomor Rumah</label>
        <input
          name="house_number"
          value={form.house_number}
          onChange={handleChange}
          placeholder="Contoh: Blok A-01"
          required
        />
        {errors.house_number && <span className="form-error">{errors.house_number[0]}</span>}
      </div>

      <div className="form-row">
        <label>Tipe Rumah</label>
        <select name="house_type" value={form.house_type} onChange={handleChange}>
          <option value="tetap">Tetap</option>
          <option value="kontrak">Kontrak</option>
        </select>
      </div>

      <div className="form-row">
        <label>Status Rumah</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="tidak_dihuni">Tidak Dihuni</option>
          <option value="dihuni">Dihuni</option>
        </select>
      </div>

      <div className="form-row">
        <label>
          Penghuni {isDihuni && <span className="required-mark">(wajib diisi)</span>}
        </label>
        <select
          name="current_resident_id"
          value={form.current_resident_id}
          onChange={handleChange}
          required={isDihuni}
          disabled={!isDihuni}
        >
          <option value="">-- Pilih Penghuni --</option>
          {residents.map((resident) => (
            <option key={resident.id} value={resident.id}>
              {resident.name} ({resident.resident_type})
            </option>
          ))}
        </select>
        {errors.current_resident_id && (
          <span className="form-error">{errors.current_resident_id[0]}</span>
        )}
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
