import { useState, useEffect } from 'react'

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string; 
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

  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

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
      type,
      date: new Date().toISOString(), 
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
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

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

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

        {/* Riwayat Transaksi */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-gray-800">Riwayat Transaksi</h2>
            
            {/* Tombol Filter */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filter === 'all' ? 'bg-white shadow-sm font-medium text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Semua
              </button>
              <button 
                onClick={() => setFilter('income')}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filter === 'income' ? 'bg-white shadow-sm font-medium text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Pemasukan
              </button>
              <button 
                onClick={() => setFilter('expense')}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filter === 'expense' ? 'bg-white shadow-sm font-medium text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Pengeluaran
              </button>
            </div>
          </div>
          
          {filteredTransactions.length === 0 ? (
            <p className="text-center text-gray-400 py-6">Tidak ada transaksi ditemukan.</p>
          ) : (
            <ul className="space-y-3">
              {filteredTransactions.map((t) => (
                <li key={t.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-10 rounded-full ${t.type === 'expense' ? 'bg-red-400' : 'bg-emerald-400'}`}></div>
                    <div>
                      <p className="font-medium text-gray-700">{t.description}</p>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${t.type === 'expense' ? 'text-red-500' : 'text-emerald-500'}`}>
                          {t.type === 'expense' ? '-' : '+'} Rp {t.amount.toLocaleString('id-ID')}
                        </p>
                        {/* Render Tanggal jika ada */}
                        {t.date && (
                          <span className="text-xs text-gray-400 border-l border-gray-300 pl-2">
                            {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteTransaction(t.id)}
                    className="text-sm text-gray-400 hover:text-red-500 px-3 py-1 bg-white border border-gray-200 rounded-lg hover:border-red-200 transition-colors"
                  >
                    Hapus
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  )
}

export default App