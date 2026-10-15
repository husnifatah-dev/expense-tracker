// src/components/TransactionList.tsx
import { type Transaction } from '../types';
import Swal from 'sweetalert2';

type TransactionListProps = {
  transactions: Transaction[];
  filter: 'all' | 'income' | 'expense';
  setFilter: (filter: 'all' | 'income' | 'expense') => void;
  onDelete: (id: string) => void;
};

export default function TransactionList({ transactions, filter, setFilter, onDelete }: TransactionListProps) {
  // 1. Filter tipe transaksinya dulu (Semua / Pemasukan / Pengeluaran)
  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  // 2. Tambahkan logika SORTING di sini
  // Kita pakai spread operator [...] agar tidak merusak array aslinya
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    // getTime() mengubah tanggal jadi angka milidetik.
    // b - a artinya urutkan dari angka terbesar (terbaru) ke terkecil (terlama)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleDeleteConfirm = (id: string) => {
    Swal.fire({
      title: 'Yakin mau dihapus?',
      text: "Data transaksi ini tidak bisa dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#9ca3af',  
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-2xl'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
        
        Swal.fire({
          title: 'Terhapus!',
          text: 'Data transaksimu berhasil dihapus.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          customClass: {
            popup: 'rounded-2xl'
          }
        });
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Riwayat Transaksi</h2>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button onClick={() => setFilter('all')} className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filter === 'all' ? 'bg-white shadow-sm font-medium text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>Semua</button>
          <button onClick={() => setFilter('income')} className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filter === 'income' ? 'bg-white shadow-sm font-medium text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}>Pemasukan</button>
          <button onClick={() => setFilter('expense')} className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filter === 'expense' ? 'bg-white shadow-sm font-medium text-red-600' : 'text-gray-500 hover:text-gray-700'}`}>Pengeluaran</button>
        </div>
      </div>
      
      {/* 3. Render array yang sudah di-sort (sortedTransactions) */}
      {sortedTransactions.length === 0 ? (
        <p className="text-center text-gray-400 py-6">Tidak ada transaksi ditemukan.</p>
      ) : (
        <ul className="space-y-3">
          {sortedTransactions.map((t) => (
            <li key={t.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-10 rounded-full ${t.type === 'expense' ? 'bg-red-400' : 'bg-emerald-400'}`}></div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-700">{t.description}</p>
                    {t.category && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${t.type === 'expense' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {t.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className={`text-sm font-semibold ${t.type === 'expense' ? 'text-red-500' : 'text-emerald-500'}`}>
                      {t.type === 'expense' ? '-' : '+'} Rp {t.amount.toLocaleString('id-ID')}
                    </p>
                    {t.date && (
                      <span className="text-xs text-gray-400 border-l border-gray-300 pl-2">
                        {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDeleteConfirm(t.id)} 
                className="text-sm text-gray-400 hover:text-red-500 px-3 py-1 bg-white border border-gray-200 rounded-lg hover:border-red-200 transition-colors"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}