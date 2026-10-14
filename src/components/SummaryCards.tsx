type SummaryCardsProps = {
  income: number;
  expense: number;
  balance: number;
};

export default function SummaryCards({ income, expense, balance }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Kartu Saldo */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 flex flex-col justify-center">
        <h2 className="text-sm font-medium text-gray-500 mb-1">Total Saldo</h2>
        <p className={`text-3xl font-bold ${balance < 0 ? 'text-red-500' : 'text-gray-800'}`}>
          Rp {balance.toLocaleString('id-ID')}
        </p>
      </div>

      {/* Kartu Pemasukan */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500 flex flex-col justify-center">
        <h2 className="text-sm font-medium text-gray-500 mb-1">Total Pemasukan</h2>
        <p className="text-2xl font-bold text-emerald-600">
          Rp {income.toLocaleString('id-ID')}
        </p>
      </div>

      {/* Kartu Pengeluaran */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500 flex flex-col justify-center">
        <h2 className="text-sm font-medium text-gray-500 mb-1">Total Pengeluaran</h2>
        <p className="text-2xl font-bold text-red-600">
          Rp {expense.toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
}