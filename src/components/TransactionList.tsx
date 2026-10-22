import { useState, useEffect } from 'react';
import { type Transaction } from '../types';
import Swal from 'sweetalert2';

type TransactionListProps = {
  transactions: Transaction[];
  filter: 'all' | 'income' | 'expense';
  setFilter: (filter: 'all' | 'income' | 'expense') => void;
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
};

export default function TransactionList({ transactions, filter, setFilter, onDelete, onEdit }: TransactionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5; 

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filter, transactions]);

  const filteredTransactions = transactions.filter(t => {
    const matchFilter = filter === 'all' ? true : t.type === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = t.description.toLowerCase().includes(searchLower) || 
                        (t.category && t.category.toLowerCase().includes(searchLower));
    return matchFilter && matchSearch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const totalPages = Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = sortedTransactions.slice(startIndex, endIndex);

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
      customClass: { popup: 'rounded-2xl' }
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
        Swal.fire({
          title: 'Terhapus!',
          text: 'Data transaksimu berhasil dihapus.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          customClass: { popup: 'rounded-2xl' }
        });
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Riwayat Transaksi</h2>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setFilter('all')} className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filter === 'all' ? 'bg-white shadow-sm font-medium text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>Semua</button>
            <button onClick={() => setFilter('income')} className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filter === 'income' ? 'bg-white shadow-sm font-medium text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}>Pemasukan</button>
            <button onClick={() => setFilter('expense')} className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filter === 'expense' ? 'bg-white shadow-sm font-medium text-red-600' : 'text-gray-500 hover:text-gray-700'}`}>Pengeluaran</button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari transaksi berdasarkan keterangan atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all text-sm"
          />
        </div>
      </div>
      
      {/* 4. Render data spesifik per halaman (currentTransactions) */}
      {currentTransactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">
            {searchQuery 
              ? `Tidak ada transaksi yang cocok dengan pencarian "${searchQuery}".` 
              : "Tidak ada transaksi ditemukan."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <ul className="space-y-3">
            {currentTransactions.map((t) => (
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
                
                <div className="flex gap-2">
                  <button onClick={() => onEdit(t)} className="text-sm text-blue-500 hover:text-blue-600 px-3 py-1 bg-white border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">Edit</button>
                  <button onClick={() => handleDeleteConfirm(t.id)} className="text-sm text-gray-400 hover:text-red-500 px-3 py-1 bg-white border border-gray-200 rounded-lg hover:border-red-200 transition-colors">Hapus</button>
                </div>
              </li>
            ))}
          </ul>

          {/* 5. UI Kontrol Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
              >
                Sebelumnya
              </button>
              
              <span className="text-sm font-medium text-gray-500">
                Halaman {currentPage} dari {totalPages}
              </span>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}