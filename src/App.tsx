import { useState, useEffect } from 'react'
import { type Transaction } from './types'
import TransactionList from './components/TransactionList'
import TransactionForm from './components/TransactionForm'
import SummaryCards from './components/SummaryCards'
import EditModal from './components/EditModal'

const EXPENSE_CATEGORIES = ['Makan & Minum', 'Transportasi', 'Tagihan', 'Hiburan', 'Lainnya'];
const INCOME_CATEGORIES = ['Gaji', 'Bonus', 'Bisnis', 'Lainnya'];

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const updateTransaction = (id: string, updatedData: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => (t.id === id ? { ...t, ...updatedData } : t))
    );
    setEditingTransaction(null); // Tutup modal setelah simpan
  };

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

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header / Judul Aplikasi */}
        <div className="text-center py-2">
          <h1 className="text-2xl font-bold text-gray-800">Expense Tracker</h1>
          <p className="text-gray-500 text-sm">Kelola keuanganmu dengan mudah</p>
        </div>

        {/* Memanggil komponen SummaryCards */}
        <SummaryCards 
          income={totalIncome} 
          expense={totalExpense} 
          balance={balance} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TransactionForm type="expense" categories={EXPENSE_CATEGORIES} onSubmit={addTransaction} />
          <TransactionForm type="income" categories={INCOME_CATEGORIES} onSubmit={addTransaction} />
        </div>

        <TransactionList 
          transactions={transactions} 
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