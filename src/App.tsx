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

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">EXPENSE TRACKER</h1>
      <p>Total Data Transaksi: {transactions.length}</p>
    </div>
  )
}

export default App;