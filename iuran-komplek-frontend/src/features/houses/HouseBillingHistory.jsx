import { useEffect, useState } from "react";
import { houseApi } from "../../api/houseApi";
import { formatCurrency } from "../../utils/formatCurrency";
import { monthName } from "../../utils/formatDate";

export default function HouseBillingHistory({ houseId, onClose }) {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    houseApi.billingHistory(houseId).then(({ data }) => {
      setBillings(data);
      setLoading(false);
    });
  }, [houseId]);

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="page-header">
          <h2>Riwayat Pembayaran Rumah</h2>
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
                <th>Periode</th>
                <th>Jenis Iuran</th>
                <th>Penghuni</th>
                <th>Jumlah</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {billings.map((billing) => (
                <tr key={billing.id}>
                  <td>
                    {monthName(billing.period_month)} {billing.period_year}
                  </td>
                  <td>{billing.due_type}</td>
                  <td>{billing.resident}</td>
                  <td>{formatCurrency(billing.amount)}</td>
                  <td>
                    <span
                      className={`badge badge-payment-${billing.status === "lunas" ? "lunas" : "belum"}`}
                    >
                      {billing.status === "lunas" ? "Lunas" : "Belum Lunas"}
                    </span>
                  </td>
                </tr>
              ))}
              {billings.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    Belum ada tagihan untuk rumah ini. Tagihan muncul setelah
                    perintah `php artisan billing:generate` dijalankan untuk
                    periode yang bersangkutan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
