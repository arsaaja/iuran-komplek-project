import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { monthName } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

export default function MonthlyBalanceChart({ data }) {
  const chartData = data.map((item) => ({
    ...item,
    monthLabel: monthName(item.month).slice(0, 3),
  }));

  return (
    <ResponsiveContainer width="100%" height={360}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="monthLabel" />
        <YAxis tickFormatter={(value) => formatCurrency(value)} width={110} />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend />
        <Bar dataKey="income" name="Pemasukan" fill="#4f46e5" />
        <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" />
        <Line
          type="monotone"
          dataKey="running_balance"
          name="Saldo Berjalan"
          stroke="#16a34a"
          strokeWidth={2}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
