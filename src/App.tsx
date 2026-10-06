import { useEffect, useState } from "react";

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
};

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
          <h1 className="text-lg font-medium text-gray-500 mb-2">Total Saldo</h1>
          <p className={`text-4xl font-bold ${balance < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
            Rp {balance.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-red-400">
            <h2 className="text-xl font-semibold text-red-500 mb-4">Pengeluaran</h2>
            <p className="text-sm text-gray-400">Form input expense nanti di sini...</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-emerald-400">
            <h2 className="text-xl font-semibold text-emerald-500 mb-4">Pemasukan</h2>
            <p className="text-sm text-gray-400">Form input income nanti di sini...</p>
          </div>

        </div>
        
      </div>
    </div>
  )
}

export default App;