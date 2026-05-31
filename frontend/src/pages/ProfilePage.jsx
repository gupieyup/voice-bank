import { useState, useRef } from 'react';
import { Camera, Mail, Phone, User, Save, Shield } from 'lucide-react';

function ProfilePage() {
  const storedUser = JSON.parse(localStorage.getItem('registeredUser')) || {};
  const [user, setUser] = useState({
    name: storedUser.name || 'Gladys', // Mengikuti nama di screenshot
    email: storedUser.email || 'gladyshersaputri21@gmail.com',
    phone: storedUser.phone || '',
    avatar: storedUser.avatar || null
  });
  
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);

  const accountNumber = localStorage.getItem('accountNumber') || '6785130512';

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!user.email) {
      alert('Email wajib diisi untuk pengiriman bukti transaksi!');
      return;
    }

    localStorage.setItem('registeredUser', JSON.stringify(user));
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8 transition-all duration-300 overflow-y-auto">
       
       {/* HEADER */}
       <div className="pb-6 mb-8 border-b border-slate-800 shrink-0">
          <h1 className="text-3xl font-bold text-white tracking-wide">Profil Akun</h1>
          <p className="text-gray-400 mt-1">Kelola informasi pribadi dan preferensi pengiriman resi Anda</p>
       </div>

       <div className="flex flex-col xl:flex-row gap-8 flex-1 animate-fadeIn">
         
         {/* KOLOM KIRI (Avatar & Info Ringkas) */}
         <div className="xl:w-1/3 flex flex-col gap-6 shrink-0">
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg relative overflow-hidden flex flex-col items-center">
               
               <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

               <div className="relative mb-6 z-10 group cursor-pointer" onClick={handleAvatarClick}>
                  <div className="w-32 h-32 rounded-full border-4 border-slate-800 bg-slate-900 flex items-center justify-center overflow-hidden transition group-hover:border-slate-700">
                     {user.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                        <User className="w-16 h-16 text-gray-500 group-hover:text-gray-400 transition" />
                     )}
                  </div>
                  
                  <div className="absolute bottom-0 right-0 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition shadow-lg border-4 border-slate-950 scale-100 group-hover:scale-110 active:scale-95">
                    <Camera className="w-4 h-4" />
                  </div>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*" 
                  />
               </div>
               
               <h2 className="text-2xl font-bold text-white mb-1 z-10 text-center">{user.name}</h2>
               <div className="text-sm font-mono text-gray-400 mb-6 z-10">{accountNumber}</div>

               <div className="w-full bg-slate-900/80 rounded-xl p-4 border border-emerald-500/20 flex items-center gap-3 z-10">
                 <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-500" />
                 </div>
                 <div>
                   <p className="text-sm text-emerald-400 font-bold">Terverifikasi</p>
                   <p className="text-xs text-gray-400">Keamanan level bank</p>
                 </div>
               </div>
            </div>
         </div>

         {/* KOLOM KANAN (Formulir Informasi) */}
         <div className="xl:w-2/3 flex flex-col gap-6">
            {/* Hapus h-full agar form bisa merentang ke bawah sesuai tinggi kontennya */}
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl shadow-lg flex flex-col relative h-auto">
               
               <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-4 mb-6">Informasi Pribadi</h3>
               
               {/* Hapus flex-1 dan ubah space-y-6 menjadi space-y-8 agar jarak antar input lebih lega */}
               <div className="space-y-8">
                 
                 {/* NAMA PEMILIK (READ-ONLY) */}
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Nama Pemilik Rekening</label>
                    <div className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-4 px-4 text-gray-500 cursor-not-allowed flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-600 shrink-0" />
                      <span className="font-semibold truncate">{user.name}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 ml-1">Nama telah sesuai dengan KTP dan tidak dapat diubah.</p>
                 </div>

                 {/* EMAIL (EDITABLE, WAJIB) */}
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">
                      Email Utama <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                         <Mail className={`w-5 h-5 transition-colors ${user.email ? 'text-gray-300' : 'text-gray-600 group-focus-within:text-red-500'}`} />
                      </div>
                      <input 
                        type="email" 
                        value={user.email}
                        onChange={(e) => setUser({...user, email: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-medium"
                        placeholder="Masukkan alamat email Anda"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 ml-1">Wajib diisi. Bukti transaksi akan dikirimkan otomatis ke alamat email ini.</p>
                 </div>

                 {/* NOMOR HANDPHONE (EDITABLE) */}
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Nomor Handphone</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                         <Phone className={`w-5 h-5 transition-colors ${user.phone ? 'text-gray-300' : 'text-gray-600 group-focus-within:text-red-500'}`} />
                      </div>
                      <input 
                        type="tel" 
                        value={user.phone}
                        onChange={(e) => setUser({...user, phone: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-medium"
                        placeholder="Contoh: 081234567890"
                      />
                    </div>
                 </div>
               </div>

               {/* BUTTON SIMPAN */}
               <div className="pt-8 mt-10 border-t border-slate-800 flex items-center justify-between">
                  {isSaved ? (
                     <div className="text-emerald-500 font-medium animate-fadeIn flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Perubahan berhasil disimpan!
                     </div>
                  ) : (
                     <div className="text-gray-500 text-sm">Pastikan data yang dimasukkan sudah benar.</div>
                  )}

                  <button 
                    onClick={handleSave}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-red-900/30 active:scale-95 border border-red-500/50 hover:shadow-red-900/50 shrink-0"
                  >
                    <Save className="w-5 h-5" />
                    Simpan
                  </button>
               </div>

            </div>
         </div>

       </div>
    </div>
  );
}

export default ProfilePage;