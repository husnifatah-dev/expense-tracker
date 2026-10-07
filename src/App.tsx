import { useState, useEffect } from 'react'

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

  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const [incomeDesc, setIncomeDesc] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (type: 'income' | 'expense', desc: string, amountStr: string) => {
    if (!desc || !amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(), 
      description: desc,
      amount,
      type
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction('expense', expenseDesc, expenseAmount);
    setExpenseDesc('');
    setExpenseAmount('');
  };

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction('income', incomeDesc, incomeAmount);
    setIncomeDesc('');
    setIncomeAmount('');
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Saldo */}
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
          <h1 className="text-lg font-medium text-gray-500 mb-2">Total Saldo</h1>
          <p className={`text-4xl font-bold ${balance < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
            Rp {balance.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Layout Kiri Kanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Form Pengeluaran */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-red-400">
            <h2 className="text-xl font-semibold text-red-500 mb-4">Catat Pengeluaran</h2>
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Keterangan</label>
                <input 
                  type="text" 
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="Contoh: Beli Kopi"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Jumlah (Rp)</label>
                <input 
                  type="number" 
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="25000"
                />
              </div>
              <button type="submit" className="w-full bg-red-500 text-white rounded-lg p-2 hover:bg-red-600 font-medium transition-colors">
                Tambah Pengeluaran
              </button>
            </form>
          </div>

          {/* Form Pemasukan */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-emerald-400">
            <h2 className="text-xl font-semibold text-emerald-500 mb-4">Catat Pemasukan</h2>
            <form onSubmit={handleIncomeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Keterangan</label>
                <input 
                  type="text" 
                  value={incomeDesc}
                  onChange={(e) => setIncomeDesc(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Contoh: Gaji / Project"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Jumlah (Rp)</label>
                <input 
                  type="number" 
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="5000000"
                />
              </div>
              <button type="submit" className="w-full bg-emerald-500 text-white rounded-lg p-2 hover:bg-emerald-600 font-medium transition-colors">
                Tambah Pemasukan
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App