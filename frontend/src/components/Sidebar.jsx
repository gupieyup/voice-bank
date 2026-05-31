import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Send, Clock, Bell, User, LogOut, Mic } from 'lucide-react';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full flex-shrink-0 z-20">
      
      {/* BRANDING LOGO */}
      <div className="h-24 flex items-center px-8 border-b border-slate-800 shrink-0">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-xl shadow-lg shadow-red-600/20">
             <Mic className="text-white w-6 h-6" />
          </div>
          <span className="tracking-wide">VoiceBank</span>
        </h2>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 font-semibold text-sm ${
              isActive 
                ? 'bg-red-600/10 text-red-500 border border-red-500/20 shadow-inner' 
                : 'text-gray-400 hover:bg-slate-900 hover:text-white border border-transparent'
            }`
          }
        >
          <Home className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink
          to="/transfer"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 font-semibold text-sm ${
              isActive 
                ? 'bg-red-600/10 text-red-500 border border-red-500/20 shadow-inner' 
                : 'text-gray-400 hover:bg-slate-900 hover:text-white border border-transparent'
            }`
          }
        >
          <Send className="w-5 h-5" />
          Transfer
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 font-semibold text-sm ${
              isActive 
                ? 'bg-red-600/10 text-red-500 border border-red-500/20 shadow-inner' 
                : 'text-gray-400 hover:bg-slate-900 hover:text-white border border-transparent'
            }`
          }
        >
          <Clock className="w-5 h-5" />
          Riwayat
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 font-semibold text-sm ${
              isActive 
                ? 'bg-red-600/10 text-red-500 border border-red-500/20 shadow-inner' 
                : 'text-gray-400 hover:bg-slate-900 hover:text-white border border-transparent'
            }`
          }
        >
          <Bell className="w-5 h-5" />
          Notifikasi
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 font-semibold text-sm ${
              isActive 
                ? 'bg-red-600/10 text-red-500 border border-red-500/20 shadow-inner' 
                : 'text-gray-400 hover:bg-slate-900 hover:text-white border border-transparent'
            }`
          }
        >
          <User className="w-5 h-5" />
          Profil
        </NavLink>
      </nav>

      {/* LOGOUT BUTTON */}
      <div className="p-6 border-t border-slate-800 shrink-0">
        <button
          className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-slate-900 hover:bg-red-600 hover:text-white text-gray-400 border border-slate-800 hover:border-red-500 rounded-xl transition-all duration-300 font-bold shadow-lg group active:scale-95"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 group-hover:text-white transition-colors" />
          Keluar
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;