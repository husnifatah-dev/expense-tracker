// src/App.tsx
import { useState, useEffect } from 'react'
import { type Transaction } from './types'
import TransactionList from './components/TransactionList'
import TransactionForm from './components/TransactionForm'

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

  // Fungsi utama untuk menambah data
  const addTransaction = (type: 'income' | 'expense', desc: string, amountStr: string, category: string) => {
    if (!desc || !amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      description: desc,
      amount,
      type,
      date: new Date().toISOString(),
      category,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Kalkulasi Saldo
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

        {/* Layout Kiri Kanan dengan Reusable Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TransactionForm 
            type="expense" 
            categories={EXPENSE_CATEGORIES} 
            onSubmit={addTransaction} 
          />
          <TransactionForm 
            type="income" 
            categories={INCOME_CATEGORIES} 
            onSubmit={addTransaction} 
          />
        </div>

        {/* Komponen Riwayat Transaksi */}
        <TransactionList 
          transactions={transactions} 
          filter={filter} 
          setFilter={setFilter} 
          onDelete={deleteTransaction} 
        />

      </div>
    </div>
  )
}

export default App