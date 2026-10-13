import { useState } from 'react';

type TransactionFormProps = {
  type: 'income' | 'expense';
  categories: string[];
  onSubmit: (type: 'income' | 'expense', desc: string, amount: string, category: string) => void;
};

export default function TransactionForm({ type, categories, onSubmit }: TransactionFormProps) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);

  const isExpense = type === 'expense';
  const borderTopClass = isExpense ? 'border-red-400' : 'border-emerald-400';
  const titleClass = isExpense ? 'text-red-500' : 'text-emerald-500';
  const focusRingClass = isExpense ? 'focus:ring-red-200' : 'focus:ring-emerald-200';
  const buttonClass = isExpense ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600';
  
  const title = isExpense ? 'Catat Pengeluaran' : 'Catat Pemasukan';
  const buttonText = isExpense ? 'Tambah Pengeluaran' : 'Tambah Pemasukan';
  const placeholderDesc = isExpense ? 'Contoh: Beli Kopi' : 'Contoh: Gaji / Project';
  const placeholderAmount = isExpense ? '25000' : '5000000';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(type, desc, amount, category);
    
    setDesc('');
    setAmount('');
    setCategory(categories[0]);
  };

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border-t-4 ${borderTopClass}`}>
      <h2 className={`text-xl font-semibold mb-4 ${titleClass}`}>{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Keterangan</label>
          <input 
            type="text" 
            value={desc} 
            onChange={(e) => setDesc(e.target.value)} 
            className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 ${focusRingClass}`} 
            placeholder={placeholderDesc} 
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Kategori</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 ${focusRingClass} bg-white`}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Jumlah (Rp)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 ${focusRingClass}`} 
            placeholder={placeholderAmount} 
          />
        </div>
        <button type="submit" className={`w-full text-white rounded-lg p-2 font-medium transition-colors ${buttonClass}`}>
          {buttonText}
        </button>
      </form>
    </div>
  );
}