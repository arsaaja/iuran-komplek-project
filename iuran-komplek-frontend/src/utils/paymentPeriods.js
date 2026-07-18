import { monthName } from './formatDate';

/**
 * Mengubah daftar item pembayaran (per bulan) menjadi ringkasan per rentang,
 * supaya pembayaran 12 bulan sekaligus tidak numpuk jadi 12 baris terpisah.
 *
 * Contoh input (payment_items):
 *   [{ due_type: 'Kebersihan', period_month: 1, period_year: 2026, amount: 15000 }, ... x12]
 *
 * Contoh output:
 *   ["Kebersihan: Januari - Desember 2026 (12 bulan, Rp180.000)"]
 *
 * Kalau bulannya tidak berurutan, otomatis dipecah jadi beberapa rentang:
 *   "Satpam: Juli 2026 (1 bulan, Rp100.000)"
 *   "Satpam: September 2026 (1 bulan, Rp100.000)"
 */
export function summarizePaymentItems(items) {
  if (!items || items.length === 0) return [];

  // Kelompokkan dulu per jenis iuran + tahun
  const groups = {};
  for (const item of items) {
    const key = `${item.due_type}__${item.period_year}`;
    if (!groups[key]) {
      groups[key] = {
        dueType: item.due_type,
        year: item.period_year,
        months: [],
        amountPerMonth: item.amount,
      };
    }
    groups[key].months.push(item.period_month);
  }

  const summaries = [];

  for (const group of Object.values(groups)) {
    const sortedMonths = [...group.months].sort((a, b) => a - b);

    // Pecah jadi rentang-rentang bulan yang berurutan
    let rangeStart = sortedMonths[0];
    let rangeEnd = sortedMonths[0];

    const pushRange = () => {
      const monthCount = rangeEnd - rangeStart + 1;
      const label =
        rangeStart === rangeEnd
          ? `${monthName(rangeStart)} ${group.year}`
          : `${monthName(rangeStart)} - ${monthName(rangeEnd)} ${group.year}`;
      const totalAmount = monthCount * Number(group.amountPerMonth);

      summaries.push({
        dueType: group.dueType,
        label,
        monthCount,
        totalAmount,
      });
    };

    for (let i = 1; i < sortedMonths.length; i++) {
      if (sortedMonths[i] === rangeEnd + 1) {
        rangeEnd = sortedMonths[i];
      } else {
        pushRange();
        rangeStart = sortedMonths[i];
        rangeEnd = sortedMonths[i];
      }
    }
    pushRange();
  }

  return summaries;
}
