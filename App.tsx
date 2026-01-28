
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import GameRoom from './components/GameRoom';
import { MOCK_TOURNAMENTS, WINNERS_LIST, ADMIN_NUMBERS } from './constants';
import { Tournament, Transaction } from './types';
import { 
  Trophy, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  ChevronRight, 
  LogOut,
  Share2,
  Lock,
  Smartphone,
  ArrowDownLeft,
  ShieldCheck,
  AlertCircle,
  FileText,
  Copy,
  Plus,
  ArrowUpRight,
  Loader2,
  RefreshCcw,
  Zap,
  MessageSquare,
  History as HistoryIcon
} from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<'login' | 'signup' | 'otp' | 'device-lock'>('login');
  const [activeTab, setActiveTab] = useState('home');
  const [currentGame, setCurrentGame] = useState<Tournament | null>(null);
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Auth Form State
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  // OTP Logic State
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  const [showNotification, setShowNotification] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Wallet State
  const [depositBalance, setDepositBalance] = useState(250.00);
  const [winningBalance, setWinningBalance] = useState(1420.50);
  const [selectedMethod, setSelectedMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNumber, setWithdrawNumber] = useState('');
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TX-SEC-882', amount: 500, type: 'deposit', method: 'bKash', trxId: '8N2X91LL', status: 'completed', date: 'Oct 24, 2024', timestamp: Date.now() - 86400000 },
    { id: 'TX-SEC-883', amount: 100, type: 'entry_fee', method: 'Wallet', status: 'completed', date: 'Oct 25, 2024', timestamp: Date.now() - 43200000 },
    { id: 'TX-SEC-884', amount: 1500, type: 'winning', method: 'Wallet', status: 'completed', date: 'Today', timestamp: Date.now() - 3600000 }
  ]);

  useEffect(() => {
    try {
      const hwid = localStorage.getItem('android_device_hwid');
      if (!hwid) {
        const newHwid = 'SECURE-HWID-' + btoa(Math.random().toString()).slice(0, 16).toUpperCase();
        localStorage.setItem('android_device_hwid', newHwid);
      }
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, []);

  const generateAndSendOtp = () => {
    // Generate a strictly random 6-digit code
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpInputs(['', '', '', '', '', '']);
    setShowNotification(true);
    setError(null);
    // Hide notification after 10 seconds
    setTimeout(() => setShowNotification(false), 10000);
  };

  const handleAuth = async (type: 'login' | 'signup') => {
    setError(null);
    setIsLoading(true);
    
    // Simulate Network Delay
    await new Promise(r => setTimeout(r, 1500));

    if (type === 'signup') {
      if (!name) { setError("Name is required."); setIsLoading(false); return; }
      if (!/^\d{11}$/.test(phone)) { setError("Invalid mobile number (11 digits required)."); setIsLoading(false); return; }
      if (password.length < 6) { setError("Password must be at least 6 characters."); setIsLoading(false); return; }
      
      const deviceLock = localStorage.getItem('device_account_lock');
      if (deviceLock && deviceLock !== phone) {
        setView('device-lock');
        setIsLoading(false);
        return;
      }

      generateAndSendOtp();
      setView('otp');
    } else {
      // Basic login simulation
      if (!/^\d{11}$/.test(phone)) { setError("Invalid mobile number."); setIsLoading(false); return; }
      if (!password) { setError("Password required."); setIsLoading(false); return; }

      const deviceLock = localStorage.getItem('device_account_lock');
      if (deviceLock && deviceLock !== phone) {
        setView('device-lock');
        setIsLoading(false);
        return;
      }
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  };

  const verifyOtp = () => {
    const entered = otpInputs.join('');
    if (entered.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    if (entered === generatedOtp) {
      localStorage.setItem('device_account_lock', phone);
      setIsLoggedIn(true);
      setShowNotification(false);
    } else {
      setError("Incorrect Security Code. Check the notification and try again.");
      setOtpInputs(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newInputs = [...otpInputs];
    newInputs[index] = value.slice(-1);
    setOtpInputs(newInputs);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleDeposit = () => {
    if (!/^\d{11}$/.test(senderNumber)) return setError("Invalid sender number.");
    if (trxId.length < 8) return setError("Invalid Transaction ID.");
    setError(null);
    const newTx: Transaction = {
      id: `TX-DEP-${Math.floor(Math.random() * 9999)}`,
      amount: 0,
      type: 'deposit',
      method: selectedMethod,
      senderNumber,
      trxId,
      status: 'pending',
      date: 'Today',
      timestamp: Date.now()
    };
    setTransactions([newTx, ...transactions]);
    setSenderNumber('');
    setTrxId('');
    alert("Deposit request submitted successfully!");
  };

  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount < 100) return setError("Minimum withdrawal is ৳100");
    if (amount > winningBalance) return setError("Insufficient winning balance.");
    if (!/^\d{11}$/.test(withdrawNumber)) return setError("Invalid receiving number.");
    setError(null);
    const newTx: Transaction = {
      id: `TX-WTH-${Math.floor(Math.random() * 9999)}`,
      amount,
      type: 'withdrawal',
      method: selectedMethod,
      status: 'pending',
      date: 'Today',
      timestamp: Date.now()
    };
    setTransactions([newTx, ...transactions]);
    setWinningBalance(prev => prev - amount);
    setWithdrawAmount('');
    setWithdrawNumber('');
    alert("Withdrawal request sent to admin!");
  };

  const joinTournament = (t: Tournament) => {
    if (depositBalance < t.entryFee) {
      setError("Insufficient deposit balance. Please Cash-In.");
      setActiveTab('wallet');
      return;
    }
    setDepositBalance(prev => prev - t.entryFee);
    setIsMatchmaking(true);
    setTimeout(() => {
      setIsMatchmaking(false);
      setCurrentGame(t);
    }, 4000);
  };

  if (!isLoggedIn) {
    if (view === 'device-lock') {
      return (
        <div className="flex flex-col min-h-screen bg-[#020617] max-w-md mx-auto p-10 justify-center items-center text-center text-white">
          <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-8 border border-rose-500/20 shadow-2xl animate-pulse">
            <ShieldCheck size={48} />
          </div>
          <h2 className="text-3xl font-black mb-4 tracking-tight italic">SECURITY ALERT</h2>
          <p className="text-slate-400 mb-10 leading-relaxed font-medium">Multiple account usage detected on this device. Our policy enforces one account per unique Android ID.</p>
          <button onClick={() => setView('login')} className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-xl active:scale-95 transition-all">BACK TO LOGIN</button>
        </div>
      );
    }

    if (view === 'otp') {
      return (
        <div className="flex flex-col min-h-screen bg-[#020617] max-w-md mx-auto p-10 text-white relative">
          {/* Simulated System Notification */}
          {showNotification && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm bg-slate-900 border border-indigo-500/40 p-5 rounded-[2rem] shadow-2xl flex items-start gap-4 animate-in slide-in-from-top-20 duration-700 z-[999] backdrop-blur-2xl ring-1 ring-white/10">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20"><MessageSquare size={20} /></div>
              <div className="flex-1">
                <span className="text-[10px] font-black text-indigo-400 block mb-1 uppercase tracking-widest">SMS VERIFICATION</span>
                <p className="text-xs font-bold text-white leading-tight">Your TicTacWin code is: <span className="text-indigo-400 text-base font-black tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded ml-1">{generatedOtp}</span></p>
              </div>
              <button onClick={() => setShowNotification(false)} className="text-slate-500 hover:text-white p-1"><ArrowRight size={14} className="rotate-90" /></button>
            </div>
          )}

          <button onClick={() => setView('signup')} className="text-indigo-400 mt-10 mb-16 flex items-center gap-2 font-black text-xs uppercase tracking-[0.2em]"><ChevronRight className="rotate-180" size={18} /> BACK</button>
          <h2 className="text-4xl font-black mb-2 italic tracking-tight">VERIFY IDENTITY</h2>
          <p className="text-slate-500 mb-12 font-bold uppercase text-[10px] tracking-widest">Security code sent to <span className="text-indigo-400">{phone}</span></p>
          
          {error && (
            <div className="bg-rose-500/10 text-rose-500 p-4 rounded-2xl mb-8 text-xs font-bold border border-rose-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="flex gap-3 mb-12">
            {otpInputs.map((digit, i) => (
              <input 
                key={i} 
                ref={el => otpRefs.current[i] = el}
                type="tel" 
                maxLength={1} 
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-full h-16 bg-slate-900 border-2 border-slate-800 rounded-2xl text-center text-2xl font-black focus:border-indigo-600 outline-none transition-all shadow-inner text-indigo-400 focus:shadow-[0_0_20px_rgba(99,102,241,0.2)]" 
              />
            ))}
          </div>

          <button 
            onClick={verifyOtp}
            className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-[0_20px_40px_rgba(79,70,229,0.3)] active:scale-95 transition-all uppercase tracking-widest mb-8 text-sm"
          >
            VALIDATE & CONTINUE
          </button>

          <button 
            onClick={generateAndSendOtp}
            className="w-full text-slate-500 font-black py-2 text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2"
          >
            NOT RECEIVED? <span className="text-indigo-400 hover:underline">RESEND OTP</span>
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col min-h-screen bg-[#020617] max-w-md mx-auto p-10 text-white overflow-y-auto">
        <div className="mt-12 mb-16 flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(79,70,229,0.4)] rotate-6 mb-8 transform hover:rotate-0 transition-transform duration-500">
            <Zap size={48} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic">TIC TAC WIN</h1>
          <p className="text-indigo-400 mt-2 font-black text-[10px] uppercase tracking-[0.4em]">PROFESSIONAL BATTLEGROUND</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 text-rose-500 p-4 rounded-2xl mb-8 text-sm font-bold border border-rose-500/20 flex items-center gap-4 animate-in slide-in-from-top-4">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <div className="space-y-5">
          {view === 'signup' && (
            <div className="relative group">
              <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none focus:border-indigo-600 transition-all font-bold text-sm" />
            </div>
          )}
          <div className="relative group">
            <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input type="tel" placeholder="Mobile Number (01xxxxxxxxx)" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none focus:border-indigo-600 transition-all font-bold text-sm" />
          </div>
          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input type="password" placeholder="Secure Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none focus:border-indigo-600 transition-all font-bold text-sm" />
          </div>
          
          <button 
            disabled={isLoading}
            onClick={() => handleAuth(view === 'login' ? 'login' : 'signup')}
            className="w-full bg-indigo-600 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3 mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (view === 'login' ? 'SECURE LOGIN' : 'CREATE ACCOUNT')}
          </button>

          <button 
            onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setError(null); }}
            className="w-full text-slate-500 font-black py-4 text-[10px] uppercase tracking-[0.25em]"
          >
            {view === 'login' ? "NEW PLAYER? " : "ALREADY REGISTERED? "}
            <span className="text-indigo-400 font-black">{view === 'login' ? 'SIGN UP NOW' : 'LOG IN'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="bg-[#020617] min-h-full text-white">
        {activeTab === 'home' && (
          <div className="p-6 animate-in fade-in duration-500">
            <div className="mb-10 overflow-hidden bg-indigo-500/10 py-3 border-y border-indigo-500/10 -mx-6 shadow-inner">
              <div className="animate-marquee">
                {WINNERS_LIST.map((text, i) => (
                  <span key={i} className="text-indigo-400 font-black text-[10px] mx-10 uppercase tracking-[0.25em] italic">🏆 {text}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-black flex items-center gap-4 tracking-tight italic">
                 <div className="w-2.5 h-10 bg-indigo-600 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)]"></div>
                 ACTIVE ARENAS
               </h2>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/10 rounded-full text-indigo-400 border border-indigo-600/20">
                 <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black tracking-widest uppercase">924 LIVE</span>
               </div>
            </div>

            <div className="space-y-6">
              {MOCK_TOURNAMENTS.map((t) => (
                <div key={t.id} className="bg-[#0F172A] rounded-[2.5rem] p-7 shadow-2xl border border-white/5 flex flex-col gap-5 relative overflow-hidden group hover:border-indigo-600/40 transition-all duration-500">
                  <div className="absolute -right-8 -top-8 w-36 h-36 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/15 transition-all"></div>
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight mb-1 italic uppercase">{t.title}</h3>
                      <div className="flex items-center gap-2">
                        <Trophy size={16} className="text-amber-500" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Prize: ৳{t.prizePool}</span>
                      </div>
                    </div>
                    <div className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-xl shadow-indigo-600/30">৳{t.entryFee}</div>
                  </div>
                  <button 
                    onClick={() => joinTournament(t)} 
                    className="w-full py-5 bg-white text-black rounded-[1.75rem] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-[0.97] transition-all shadow-2xl"
                  >
                    JOIN BATTLE <ArrowRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs follow the same professional structure... */}
        {activeTab === 'wallet' && (
          <div className="p-6 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black mb-8 tracking-tight italic">VAULT</h2>
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[3rem] p-10 text-white shadow-2xl mb-12 border border-white/10">
              <span className="text-[10px] font-black opacity-60 uppercase tracking-[0.3em] block mb-2">AVAILABLE BALANCE</span>
              <h3 className="text-5xl font-black mb-10 tracking-tighter italic">৳{(depositBalance + winningBalance).toFixed(2)}</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <span className="text-[9px] uppercase opacity-50 font-black tracking-widest">DEPOSIT</span>
                  <p className="text-xl font-black italic">৳{depositBalance.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase opacity-50 font-black tracking-widest">WINNINGS</span>
                  <p className="text-xl font-black italic text-indigo-200">৳{winningBalance.toFixed(2)}</p>
                </div>
              </div>
            </div>
            {/* Wallet content... */}
            <div className="flex gap-4 mb-8">
               <button onClick={() => setSelectedMethod('bKash')} className={`flex-1 p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${selectedMethod === 'bKash' ? 'bg-pink-600/10 border-pink-500 text-pink-500' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                 <span className="font-black text-[10px] uppercase tracking-widest">bKash</span>
                 {selectedMethod === 'bKash' && <CheckCircle size={20} />}
               </button>
               <button onClick={() => setSelectedMethod('Nagad')} className={`flex-1 p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${selectedMethod === 'Nagad' ? 'bg-orange-600/10 border-orange-500 text-orange-500' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                 <span className="font-black text-[10px] uppercase tracking-widest">Nagad</span>
                 {selectedMethod === 'Nagad' && <CheckCircle size={20} />}
               </button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-6 text-center animate-in fade-in duration-500">
             <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] mx-auto flex items-center justify-center text-white mb-6 shadow-2xl rotate-3">
               <Users size={40} />
             </div>
             <h2 className="text-2xl font-black italic uppercase tracking-tight">{name || 'ELITE PLAYER'}</h2>
             <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mt-2 mb-10">{phone}</p>
             <button onClick={() => { setIsLoggedIn(false); setView('login'); }} className="w-full p-6 bg-rose-500/10 text-rose-500 rounded-[2rem] font-black flex items-center justify-center gap-4 border border-rose-500/10 hover:bg-rose-500/20 transition-all">
                <LogOut size={20} /> TERMINATE SESSION
             </button>
          </div>
        )}

        {isMatchmaking && (
          <div className="fixed inset-0 bg-[#020617] z-[1000] flex flex-col items-center justify-center p-10 text-center text-white">
            <div className="w-32 h-32 border-4 border-indigo-600 rounded-full animate-spin flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(79,70,229,0.4)]">
              <Zap size={40} className="text-indigo-500 animate-pulse" />
            </div>
            <h2 className="text-3xl font-black mb-2 italic">SECURE HANDSHAKE</h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">SYNCING GAME STATE...</p>
          </div>
        )}

        {currentGame && (
          <div className="fixed inset-0 z-[2000] bg-[#020617]">
            <GameRoom tournamentTitle={currentGame.title} onBack={() => setCurrentGame(null)} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
