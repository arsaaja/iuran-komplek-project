import { useEffect, useState } from "react";
import { paymentApi } from "../../api/paymentApi";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate, monthName } from "../../utils/formatDate";
import PaymentForm from "./PaymentForm";

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const { data } = await paymentApi.list({ per_page: 30 });
    setPayments(data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaved = () => {
    setShowForm(false);
    loadData();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Pembayaran Iuran</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Tambah Pembayaran
        </button>
      </div>

      {showForm && <PaymentForm onSaved={handleSaved} />}

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Penghuni</th>
              <th>Rumah</th>
              <th>Rincian Periode</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{formatDate(payment.payment_date)}</td>
                <td>{payment.resident?.name}</td>
                <td>{payment.house?.house_number}</td>
                <td>
                  {payment.items?.map((item, index) => (
                    <div key={index}>
                      {item.due_type} - {monthName(item.period_month)}{" "}
                      {item.period_year}
                    </div>
                  ))}
                </td>
                <td>{formatCurrency(payment.total_amount)}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={5}>Belum ada data pembayaran.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
