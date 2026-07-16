import { useEffect, useState } from 'react';
import { reportApi } from '../../api/reportApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate, monthName } from '../../utils/formatDate';

const currentDate = new Date();
const yearOptions = Array.from({ length: 6 }, (_, index) => currentDate.getFullYear() - index);

export default function MonthlyDetailReport() {
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    reportApi.monthlyDetail(month, year).then(({ data }) => {
      setDetail(data);
      setLoading(false);
    });
  }, [month, year]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Detail Laporan Bulanan</h1>
        <div className="filter-group">
          <select value={month} onChange={(event) => setMonth(Number(event.target.value))}>
            {Array.from({ length: 12 }, (_, index) => index + 1).map((monthOption) => (
              <option key={monthOption} value={monthOption}>
                {monthName(monthOption)}
              </option>
            ))}
          </select>
          <select value={year} onChange={(event) => setYear(Number(event.target.value))}>
            {yearOptions.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading || !detail ? (
        <p>Memuat data...</p>
      ) : (
        <>
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-label">Total Pemasukan</div>
              <div className="stat-value stat-positive">
                {formatCurrency(detail.total_income)}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Pengeluaran</div>
              <div className="stat-value stat-negative">
                {formatCurrency(detail.total_expense)}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Saldo Bulan Ini</div>
              <div className="stat-value">{formatCurrency(detail.balance)}</div>
            </div>
          </div>

          <h2>Rincian Pemasukan</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Penghuni</th>
                <th>Rumah</th>
                <th>Jenis Iuran</th>
                <th>Tanggal Bayar</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {detail.incomes.map((income, index) => (
                <tr key={index}>
                  <td>{income.resident}</td>
                  <td>{income.house_number}</td>
                  <td>{income.due_type}</td>
                  <td>{formatDate(income.paid_at)}</td>
                  <td>{formatCurrency(income.amount)}</td>
                </tr>
              ))}
              {detail.incomes.length === 0 && (
                <tr>
                  <td colSpan={5}>Tidak ada pemasukan pada bulan ini.</td>
                </tr>
              )}
            </tbody>
          </table>

          <h2>Rincian Pengeluaran</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Kategori</th>
                <th>Keterangan</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {detail.expenses.map((expense, index) => (
                <tr key={index}>
                  <td>{formatDate(expense.date)}</td>
                  <td>{expense.category}</td>
                  <td>{expense.description || '-'}</td>
                  <td>{formatCurrency(expense.amount)}</td>
                </tr>
              ))}
              {detail.expenses.length === 0 && (
                <tr>
                  <td colSpan={4}>Tidak ada pengeluaran pada bulan ini.</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
