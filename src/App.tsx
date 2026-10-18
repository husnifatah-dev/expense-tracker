import { useState, useEffect } from 'react'
import { type Transaction } from './types'
import TransactionList from './components/TransactionList'
import TransactionForm from './components/TransactionForm'
import SummaryCards from './components/SummaryCards'
import EditModal from './components/EditModal'
import ExpenseChart from './components/ExpenseChart'

const EXPENSE_CATEGORIES = ['Makan & Minum', 'Transportasi', 'Tagihan', 'Hiburan', 'Lainnya'];
const INCOME_CATEGORIES = ['Gaji', 'Bonus', 'Bisnis', 'Lainnya'];

const getCurrentMonthString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - offset).toISOString().slice(0, 7);
};

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString());

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (type: 'income' | 'expense', desc: string, amountStr: string, category: string, dateStr: string) => {
    if (!desc || !amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      description: desc,
      amount,
      type,
      date: new Date(dateStr).toISOString(),
      category,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id: string, updatedData: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => (t.id === id ? { ...t, ...updatedData } : t))
    );
    setEditingTransaction(null);
  };

  const transactionsForSelectedMonth = selectedMonth 
    ? transactions.filter(t => t.date.startsWith(selectedMonth))
    : transactions;

  const totalIncome = transactionsForSelectedMonth.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactionsForSelectedMonth.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header dengan Filter Bulan */}
        <div className="flex flex-col sm:flex-row justify-between items-center py-2 mb-2 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-800">Expense Tracker</h1>
            <p className="text-gray-500 text-sm">Kelola keuanganmu dengan mudah</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <label className="text-sm font-medium text-gray-600 pl-2">Periode:</label>
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border-none focus:ring-0 bg-transparent text-gray-800 font-semibold cursor-pointer outline-none"
            />
          </div>
        </div>

        {/* Summary Cards ikut menyesuaikan bulan yang dipilih */}
        <SummaryCards 
          income={totalIncome} 
          expense={totalExpense} 
          balance={balance} 
        />

        <ExpenseChart transactions={transactionsForSelectedMonth} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TransactionForm type="expense" categories={EXPENSE_CATEGORIES} onSubmit={addTransaction} />
          <TransactionForm type="income" categories={INCOME_CATEGORIES} onSubmit={addTransaction} />
        </div>

        {/* TransactionList hanya menerima data bulan yang dipilih */}
        <TransactionList 
          transactions={transactionsForSelectedMonth} 
          filter={filter} 
          setFilter={setFilter} 
          onDelete={deleteTransaction} 
          onEdit={setEditingTransaction}
        />

        <EditModal 
          transaction={editingTransaction}
          categories={editingTransaction?.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES}
          onClose={() => setEditingTransaction(null)}
          onSave={updateTransaction}
        />

      </div>
    </div>
  )
}

export default App