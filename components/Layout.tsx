
import React from 'react';
import { NAV_ITEMS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#020617] relative overflow-hidden shadow-2xl">
      {/* Header with Premium Glass Effect */}
      <header className="h-20 px-6 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black shadow-[0_0_20px_rgba(99,102,241,0.4)] transform rotate-6 hover:rotate-0 transition-transform duration-300">
            T
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white leading-none">TIC TAC WIN</h1>
            <span className="text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase">Pro Arena</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <span className="text-[9px] font-black text-indigo-400 tracking-wider">LIVE 0.1ms</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scrollbar-hide pb-28">
        {children}
      </main>

      {/* Modern Bottom Navigation */}
      <nav className="h-24 bg-[#020617]/90 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 px-4">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative group ${
              activeTab === item.id ? 'text-indigo-400' : 'text-slate-500'
            }`}
          >
            {activeTab === item.id && (
              <div className="absolute -top-4 w-10 h-1 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,1)]"></div>
            )}
            <div className={`p-2.5 rounded-2xl transition-all duration-300 ${
              activeTab === item.id ? 'bg-indigo-500/15 scale-110' : 'group-hover:bg-white/5'
            }`}>
              {item.icon}
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.15em]">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
