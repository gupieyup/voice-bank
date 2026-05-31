import { useNavigate } from 'react-router-dom';
import { Bell, User as UserIcon } from 'lucide-react';

function Header() {
  const navigate = useNavigate();

  // Ambil data user atau fallback
  const user = JSON.parse(localStorage.getItem('registeredUser')) || { name: 'Dzu Sunan' };
  
  // Sinkronisasi Account Number
  const accountNumber = localStorage.getItem('accountNumber') || generateAccountNumber();
  localStorage.setItem('accountNumber', accountNumber);

  function generateAccountNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }

  // Waktu & Sapaan Dinamis
  const currentHour = new Date().getHours();
  let greeting = 'Selamat Malam';
  if (currentHour < 12) {
    greeting = 'Selamat Pagi';
  } else if (currentHour < 18) {
    greeting = 'Selamat Siang';
  }

  return (
    <header className="h-24 bg-slate-950 border-b border-slate-800 px-8 flex items-center justify-between shrink-0 z-10 sticky top-0 shadow-sm">
      
      {/* BAGIAN KIRI - Sapaan */}
      <div className="flex flex-col">
        <h3 className="text-xl font-bold text-white tracking-wide">{greeting}</h3>
        <p className="text-sm text-gray-400 mt-1">
          Selamat datang kembali, <span className="text-white font-medium">{user?.name}</span>
        </p>
      </div>

      {/* BAGIAN KANAN - Aksi & Info Profil */}
      <div className="flex items-center gap-6">
        
        {/* Tombol Notifikasi */}
        <button
          className="relative p-3 text-gray-400 hover:text-white transition-colors bg-slate-900 border border-slate-800 rounded-full hover:bg-slate-800 hover:border-slate-700 active:scale-95"
          onClick={() => navigate('/notifications')}
        >
          <Bell className="w-5 h-5" />
          {/* Indikator Merah Notifikasi Aktif */}
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-slate-900 animate-pulse"></span>
        </button>

        {/* Info Nama & Rekening (Disembunyikan di Mobile) */}
        <div className="hidden md:flex flex-col items-end pr-4 border-r border-slate-800">
          <h3 className="text-sm font-bold text-white">{user?.name}</h3>
          <p className="text-xs font-mono text-gray-400 mt-0.5">{accountNumber}</p>
        </div>

        {/* Avatar Bulat (Bisa di-klik ke profil) */}
        <div 
           className="w-12 h-12 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center overflow-hidden cursor-pointer hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-900/20 active:scale-95" 
           onClick={() => navigate('/profile')}
        >
          {user?.avatar ? (
             <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
             <UserIcon className="w-6 h-6 text-gray-400" />
          )}
        </div>
        
      </div>
    </header>
  );
}

export default Header;