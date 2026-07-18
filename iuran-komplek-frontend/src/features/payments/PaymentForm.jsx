import { useEffect, useState } from "react";
import { residentApi } from "../../api/residentApi";
import { dueTypeApi } from "../../api/dueTypeApi";
import { paymentApi } from "../../api/paymentApi";
import { monthName } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

function createEmptyLine(defaultDueTypeId) {
  return {
    key: crypto.randomUUID(),
    due_type_id: defaultDueTypeId || "",
    month_from: currentMonth,
    month_to: currentMonth,
    year: currentYear,
  };
}

export default function PaymentForm({ onSaved }) {
  const [residents, setResidents] = useState([]);
  const [dueTypes, setDueTypes] = useState([]);
  const [dueTypesLoading, setDueTypesLoading] = useState(true);
  const [dueTypesError, setDueTypesError] = useState("");
  const [residentId, setResidentId] = useState("");
  const [selectedResident, setSelectedResident] = useState(null);
  const [lines, setLines] = useState([]);
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 16),
  );
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    residentApi
      .list({ per_page: 100 })
      .then(({ data }) => setResidents(data.data || []));

    dueTypeApi
      .list()
      .then(({ data }) => {
        setDueTypes(data);
        if (data.length === 0) {
          setDueTypesError(
            "Belum ada data jenis iuran di database. Tambahkan dulu data jenis iuran (misalnya lewat seeder atau langsung ke tabel due_types) sebelum bisa mencatat pembayaran.",
          );
        }
        // Mulai dengan satu baris kosong begitu daftar jenis iuran siap
        setLines([createEmptyLine(data[0]?.id)]);
      })
      .catch(() => {
        setDueTypesError(
          "Gagal memuat data jenis iuran dari server. Pastikan backend menyala dan kamu masih login, lalu coba muat ulang halaman ini.",
        );
      })
      .finally(() => setDueTypesLoading(false));
  }, []);

  useEffect(() => {
    if (!residentId) {
      setSelectedResident(null);
      return;
    }
    residentApi.get(residentId).then(({ data }) => setSelectedResident(data));
  }, [residentId]);

  const updateLine = (key, field, value) => {
    setLines((prev) =>
      prev.map((line) =>
        line.key === key ? { ...line, [field]: value } : line,
      ),
    );
  };

  const addLine = () => {
    setLines((prev) => [...prev, createEmptyLine(dueTypes[0]?.id)]);
  };

  const removeLine = (key) => {
    setLines((prev) => prev.filter((line) => line.key !== key));
  };

  // Setiap baris = satu jenis iuran dengan rentang bulannya sendiri.
  // Bisa 1 bulan saja (month_from === month_to) atau rentang bebas
  // (misalnya bulan 3 sampai 5, atau 1 sampai 12). Tidak ada batasan jenis
  // iuran tertentu harus bulanan/tahunan - satpam maupun kebersihan berlaku sama.
  const monthsInLine = (line) => {
    const from = Number(line.month_from);
    const to = Number(line.month_to);
    if (!from || !to || to < from) return [];
    const months = [];
    for (let month = from; month <= to; month++) months.push(month);
    return months;
  };

  const lineSubtotal = (line) => {
    const dueType = dueTypes.find(
      (item) => item.id === Number(line.due_type_id),
    );
    if (!dueType) return 0;
    return Number(dueType.amount) * monthsInLine(line).length;
  };

  const grandTotal = lines.reduce((sum, line) => sum + lineSubtotal(line), 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});

    const items = [];
    for (const line of lines) {
      const months = monthsInLine(line);
      for (const month of months) {
        items.push({
          due_type_id: Number(line.due_type_id),
          period_month: month,
          period_year: Number(line.year),
        });
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
        <select
          value={residentId}
          onChange={(event) => setResidentId(event.target.value)}
          required
        >
          <option value="">-- Pilih Penghuni --</option>
          {residents.map((resident) => (
            <option key={resident.id} value={resident.id}>
              {resident.name}
            </option>
          ))}
        </select>
        {errors.resident_id && (
          <span className="form-error">{errors.resident_id[0]}</span>
        )}
      </div>

      {selectedResident && (
        <div className="info-box">
          Rumah:{" "}
          {selectedResident.current_house?.house_number ||
            "Belum terhubung rumah"}
        </div>
      )}
      {errors.house_id && (
        <span className="form-error">{errors.house_id[0]}</span>
      )}

      <div className="form-row">
        <label>Rincian Iuran yang Dibayar</label>

        {dueTypesLoading && (
          <p className="hint-text">Memuat daftar jenis iuran...</p>
        )}
        {!dueTypesLoading && dueTypesError && (
          <p className="form-error">{dueTypesError}</p>
        )}

        <p className="hint-text">
          Setiap baris di bawah bisa memilih jenis iuran (satpam atau
          kebersihan) dengan rentang bulannya masing-masing secara bebas: satu
          bulan saja, atau rentang beberapa bulan (misalnya bulan 3 sampai 5,
          atau 1 sampai 12). Tidak ada batasan jenis iuran tertentu harus
          bulanan atau tahunan, keduanya berlaku sama.
        </p>

        <table className="data-table payment-line-table">
          <thead>
            <tr>
              <th>Jenis Iuran</th>
              <th>Dari Bulan</th>
              <th>Sampai Bulan</th>
              <th>Tahun</th>
              <th>Jumlah Bulan</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.key}>
                <td>
                  <select
                    value={line.due_type_id}
                    onChange={(event) =>
                      updateLine(line.key, "due_type_id", event.target.value)
                    }
                  >
                    {dueTypes.map((dueType) => (
                      <option key={dueType.id} value={dueType.id}>
                        {dueType.name} ({formatCurrency(dueType.amount)}/bulan)
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={line.month_from}
                    onChange={(event) =>
                      updateLine(line.key, "month_from", event.target.value)
                    }
                  >
                    {Array.from({ length: 12 }, (_, index) => index + 1).map(
                      (month) => (
                        <option key={month} value={month}>
                          {monthName(month)}
                        </option>
                      ),
                    )}
                  </select>
                </td>
                <td>
                  <select
                    value={line.month_to}
                    onChange={(event) =>
                      updateLine(line.key, "month_to", event.target.value)
                    }
                  >
                    {Array.from({ length: 12 }, (_, index) => index + 1).map(
                      (month) => (
                        <option key={month} value={month}>
                          {monthName(month)}
                        </option>
                      ),
                    )}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    value={line.year}
                    onChange={(event) =>
                      updateLine(line.key, "year", event.target.value)
                    }
                    style={{ width: "90px" }}
                  />
                </td>
                <td>{monthsInLine(line).length} bulan</td>
                <td>{formatCurrency(lineSubtotal(line))}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-small btn-danger"
                    onClick={() => removeLine(line.key)}
                    disabled={lines.length === 1}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          className="btn btn-secondary btn-small"
          onClick={addLine}
          disabled={dueTypes.length === 0}
        >
          + Tambah Baris Iuran
        </button>

        {errors.items && <span className="form-error">{errors.items[0]}</span>}
      </div>

      <div className="form-row">
        <label>Tanggal &amp; Jam Bayar</label>
        <input
          type="datetime-local"
          value={paymentDate}
          onChange={(event) => setPaymentDate(event.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <label>Catatan (opsional)</label>
        <input value={note} onChange={(event) => setNote(event.target.value)} />
      </div>

      <div className="total-box">
        Total Pembayaran: {formatCurrency(grandTotal)}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving || dueTypes.length === 0}
        >
          {saving ? "Menyimpan..." : "Simpan Pembayaran"}
        </button>
      </div>
    </form>
  );
}
