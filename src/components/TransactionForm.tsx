import { useState } from 'react';
import Swal from 'sweetalert2'; 

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
  const placeholderAmount = isExpense ? '25.000' : '5.000.000';

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setAmount('');
      return;
    }
    const formattedValue = new Intl.NumberFormat('id-ID').format(Number(rawValue));
    setAmount(formattedValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanAmount = amount.replace(/\./g, '');
    onSubmit(type, desc, cleanAmount, category);
    
    setDesc('');
    setAmount('');
    setCategory(categories[0]);

    Swal.fire({
      title: 'Berhasil!',
      text: isExpense ? 'Pengeluaran berhasil dicatat.' : 'Pemasukan berhasil dicatat.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false, 
    });
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
            required
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
            type="text" 
            inputMode="numeric" 
            value={amount} 
            onChange={handleAmountChange} 
            className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 ${focusRingClass}`} 
            placeholder={placeholderAmount}
            required
          />
        </div>
        <button type="submit" className={`w-full text-white rounded-lg p-2 font-medium transition-colors ${buttonClass}`}>
          {buttonText}
        </button>
      </form>
    </div>
  );
}