import { useEffect, useState } from 'react';
import { reportApi } from '../../api/reportApi';
import { formatCurrency } from '../../utils/formatCurrency';
import MonthlyBalanceChart from '../../components/charts/MonthlyBalanceChart';

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 6 }, (_, index) => currentYear - index);

export default function SummaryDashboard() {
  const [year, setYear] = useState(currentYear);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    reportApi.summary(year).then(({ data }) => {
      setSummary(data);
      setLoading(false);
    });
  }, [year]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Ringkasan Laporan</h1>
        <select value={year} onChange={(event) => setYear(Number(event.target.value))}>
          {yearOptions.map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>
      </div>

      {loading || !summary ? (
        <p>Memuat data...</p>
      ) : (
        <>
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-label">Total Pemasukan {year}</div>
              <div className="stat-value stat-positive">
                {formatCurrency(summary.total_income)}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Pengeluaran {year}</div>
              <div className="stat-value stat-negative">
                {formatCurrency(summary.total_expense)}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Sisa Saldo Akhir {year}</div>
              <div className="stat-value">{formatCurrency(summary.final_balance)}</div>
            </div>
          </div>

          <div className="chart-card">
            <MonthlyBalanceChart data={summary.data} />
          </div>
        </>
      )}
    </div>
  );
}
