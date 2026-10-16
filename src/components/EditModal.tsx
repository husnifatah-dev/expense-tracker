import { useState, useEffect } from 'react';
import { type Transaction } from '../types';
import Swal from 'sweetalert2';

type EditModalProps = {
  transaction: Transaction | null;
  categories: string[];
  onClose: () => void;
  onSave: (id: string, updatedData: Partial<Transaction>) => void;
};

export default function EditModal({ transaction, categories, onClose, onSave }: EditModalProps) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (transaction) {
      setDesc(transaction.description);
      setAmount(new Intl.NumberFormat('id-ID').format(transaction.amount));
      setCategory(transaction.category || categories[0]);
      setDate(transaction.date.split('T')[0]); 
    }
  }, [transaction, categories]);

  if (!transaction) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setAmount('');
      return;
    }
    setAmount(new Intl.NumberFormat('id-ID').format(Number(rawValue)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseFloat(amount.replace(/\./g, ''));
    if (isNaN(cleanAmount) || cleanAmount <= 0) return;

    onSave(transaction.id, {
      description: desc,
      amount: cleanAmount,
      category,
      date: new Date(date).toISOString()
    });

    Swal.fire({
      title: 'Diperbarui!',
      text: 'Data transaksi berhasil diubah.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      customClass: { popup: 'rounded-2xl' }
    });
  };

  const isExpense = transaction.type === 'expense';
  const themeColor = isExpense ? 'text-red-500' : 'text-emerald-500';
  const btnColor = isExpense ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600';
  const focusRing = isExpense ? 'focus:ring-red-200' : 'focus:ring-emerald-200';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-semibold ${themeColor}`}>Edit {isExpense ? 'Pengeluaran' : 'Pemasukan'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              {/* Ikon Close sederhana (X) */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tanggal</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 ${focusRing}`} required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Keterangan</label>
              <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 ${focusRing}`} required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Kategori</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 ${focusRing} bg-white`}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Jumlah (Rp)</label>
              <input type="text" inputMode="numeric" value={amount} onChange={handleAmountChange} className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 ${focusRing}`} required />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 rounded-lg p-2 font-medium hover:bg-gray-200 transition-colors">Batal</button>
              <button type="submit" className={`flex-1 text-white rounded-lg p-2 font-medium transition-colors ${btnColor}`}>Simpan Perubahan</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}