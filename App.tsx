
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
    const hwid = localStorage.getItem('android_device_hwid');
    if (!hwid) {
      const newHwid = 'SECURE-HWID-' + btoa(Math.random().toString()).slice(0, 16).toUpperCase();
      localStorage.setItem('android_device_hwid', newHwid);
    }
  }, []);

  const generateAndSendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpInputs(['', '', '', '', '', '']);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 8000);
  };

  const handleAuth = async (type: 'login' | 'signup') => {
    setError(null);
    setIsLoading(true);
    
    await new Promise(r => setTimeout(r, 1500));

    if (type === 'signup') {
      if (!name) { setError("Name is required."); setIsLoading(false); return; }
      if (!/^\d{11}$/.test(phone)) { setError("Invalid mobile number."); setIsLoading(false); return; }
      if (password.length < 6) { setError("Password must be 6+ chars."); setIsLoading(false); return; }
      
      const deviceLock = localStorage.getItem('device_account_lock');
      if (deviceLock && deviceLock !== phone) {
        setView('device-lock');
        setIsLoading(false);
        return;
      }

      generateAndSendOtp();
      setView('otp');
    } else {
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
    if (entered === generatedOtp) {
      localStorage.setItem('device_account_lock', phone);
      setIsLoggedIn(true);
    } else {
      setError("Incorrect Security Code. Please try again.");
      setOtpInputs(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newInputs = [...otpInputs];
    newInputs[index] = value.slice(-1);
    setOtpInputs(newInputs);

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
    alert("Deposit request submitted!");
  };

  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount < 100) return setError("Minimum withdrawal ৳100");
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
    alert("Withdrawal request queued!");
  };

  const joinTournament = (t: Tournament) => {
    if (depositBalance < t.entryFee) {
      setError("Insufficient deposit balance.");
      setActiveTab('wallet');
      return;
    }
    setDepositBalance(prev => prev - t.entryFee);
    setIsMatchmaking(true);
    setTimeout(() => {
      setIsMatchmaking(false);
      setCurrentGame(t);
    }, 4500);
  };

  if (!isLoggedIn) {
    if (view === 'device-lock') {
      return (
        <div className="flex flex-col min-h-screen bg-[#020617] max-w-md mx-auto p-10 justify-center items-center text-center text-white">
          <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-8 border border-rose-500/20 shadow-2xl animate-pulse">
            <ShieldCheck size={48} />
          </div>
          <h2 className="text-3xl font-black mb-4 tracking-tight italic">SECURITY ALERT</h2>
          <p className="text-slate-400 mb-10 leading-relaxed font-medium">Multiple account usage detected. Our policy enforces one account per device ID.</p>
          <button onClick={() => setView('login')} className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-xl active:scale-95 transition-all">TRY DIFFERENT ACCOUNT</button>
        </div>
      );
    }

    if (view === 'otp') {
      return (
        <div className="flex flex-col min-h-screen bg-[#020617] max-w-md mx-auto p-10 text-white relative">
          {showNotification && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-slate-900 border border-indigo-500/30 p-4 rounded-3xl shadow-2xl flex items-start gap-4 animate-in slide-in-from-top-10 duration-500 z-[100] backdrop-blur-xl">
              <div className="p-2 bg-indigo-600 rounded-xl text-white"><MessageSquare size={20} /></div>
              <div className="flex-1">
                <span className="text-[10px] font-black text-indigo-400 block mb-0.5 uppercase tracking-widest">System Message</span>
                <p className="text-xs font-bold text-white leading-relaxed">Your TIC TAC WIN verification code is: <span className="text-indigo-400 text-sm font-black tracking-widest">{generatedOtp}</span>. Do not share this code.</p>
              </div>
            </div>
          )}

          <button onClick={() => setView('signup')} className="text-indigo-400 mt-10 mb-16 flex items-center gap-2 font-black text-xs uppercase tracking-[0.2em]"><ChevronRight className="rotate-180" size={18} /> BACK</button>
          <h2 className="text-4xl font-black mb-2 italic">VERIFY SMS</h2>
          <p className="text-slate-500 mb-12 font-bold uppercase text-[10px] tracking-widest">Enter the code sent to <span className="text-indigo-400">{phone}</span></p>
          
          {error && (
            <div className="bg-rose-500/10 text-rose-500 p-4 rounded-2xl mb-8 text-xs font-bold border border-rose-500/20 flex items-center gap-3 animate-bounce">
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
                className="w-full h-16 bg-slate-900 border-2 border-slate-800 rounded-2xl text-center text-2xl font-black focus:border-indigo-600 outline-none transition-all shadow-inner text-indigo-400" 
              />
            ))}
          </div>

          <button 
            onClick={verifyOtp}
            className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-[0_20px_40px_rgba(79,70,229,0.3)] active:scale-95 transition-all uppercase tracking-widest mb-6"
          >
            VALIDATE & ENTER
          </button>

          <button 
            onClick={generateAndSendOtp}
            className="w-full text-slate-500 font-black py-2 text-[10px] uppercase tracking-[0.2em]"
          >
            DIDN'T GET CODE? <span className="text-indigo-400 underline">RESEND</span>
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
          <p className="text-indigo-400 mt-2 font-black text-[10px] uppercase tracking-[0.4em]">PROFESSIONAL TOURNAMENT HUB</p>
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
            <input type="tel" placeholder="Mobile Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none focus:border-indigo-600 transition-all font-bold text-sm" />
          </div>
          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input type="password" placeholder="Secure Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none focus:border-indigo-600 transition-all font-bold text-sm" />
          </div>
          
          <button 
            disabled={isLoading}
            onClick={() => handleAuth(view === 'login' ? 'login' : 'signup')}
            className="w-full bg-indigo-600 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (view === 'login' ? 'SECURE LOGIN' : 'PROCEED TO OTP')}
          </button>

          <button 
            onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setError(null); }}
            className="w-full text-slate-500 font-black py-4 text-[10px] uppercase tracking-[0.25em]"
          >
            {view === 'login' ? "NEW PLAYER? " : "ALREADY REGISTERED? "}
            <span className="text-indigo-400">{view === 'login' ? 'JOIN NOW' : 'LOG IN'}</span>
          </button>
        </div>
      </div>
    );
  }

  if (isMatchmaking) {
    return (
      <div className="flex flex-col h-screen bg-[#020617] max-w-md mx-auto p-10 justify-center items-center text-center text-white">
        <div className="relative mb-12">
          <div className="w-36 h-36 border-4 border-indigo-600/10 rounded-full animate-ping absolute inset-0"></div>
          <div className="w-36 h-36 border-4 border-indigo-600 rounded-full animate-spin flex items-center justify-center relative shadow-[0_0_60px_rgba(79,70,229,0.4)]">
            <Users size={48} className="text-indigo-500 animate-pulse" />
          </div>
        </div>
        <h2 className="text-3xl font-black mb-2 tracking-tight italic">PAIRING PLAYERS</h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Establishing Secure Game Room...</p>
        
        <div className="mt-24 w-full space-y-4">
          <div className="bg-slate-900/40 p-7 rounded-[2.5rem] border border-white/5 flex items-center gap-6 backdrop-blur-xl">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center font-black shadow-lg text-xl">X</div>
            <div className="flex-1 text-left">
              <div className="h-3 bg-slate-800 rounded-full w-full overflow-hidden">
                 <div className="h-full bg-indigo-500 animate-[matchmaking_4.5s_linear_forwards]"></div>
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2 block italic">P2P Realtime Syncing...</span>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes matchmaking { 0% { width: 0%; } 100% { width: 100%; } }
        `}</style>
      </div>
    );
  }

  if (currentGame) {
    return <GameRoom tournamentTitle={currentGame.title} onBack={() => setCurrentGame(null)} />;
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
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Jackpot: ৳{t.prizePool}</span>
                      </div>
                    </div>
                    <div className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-xl shadow-indigo-600/30">FEE: ৳{t.entryFee}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#020617] p-4 rounded-3xl border border-white/5 flex flex-col gap-1 shadow-inner">
                      <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">FORMAT</span>
                      <span className="text-xs font-black text-white italic">15S BLITZ DUEL</span>
                    </div>
                    <div className="bg-[#020617] p-4 rounded-3xl border border-white/5 flex flex-col gap-1 shadow-inner">
                      <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">SLOTS</span>
                      <span className="text-xs font-black text-white italic uppercase">{t.slotsLeft} REMAINING</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => joinTournament(t)} 
                    className="w-full py-5 bg-white text-black rounded-[1.75rem] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-[0.97] transition-all shadow-2xl"
                  >
                    ENTER BATTLE <ArrowRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="p-6 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black mb-2 tracking-tight italic">VAULT</h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-10">MANAGED BY ONLINE-ERNING-BD</p>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[3rem] p-10 text-white shadow-[0_30px_60px_rgba(79,70,229,0.4)] mb-12 border border-white/10 relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
              <div className="flex justify-between items-start mb-6">
                 <span className="text-[10px] font-black opacity-60 uppercase tracking-[0.3em] block">NETWORK ASSETS</span>
                 <RefreshCcw size={16} className="opacity-40 animate-spin" />
              </div>
              <h3 className="text-6xl font-black mb-10 tracking-tighter italic">৳{(depositBalance + winningBalance).toFixed(2)}</h3>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] uppercase opacity-50 font-black tracking-widest">DEPOSIT BAL</span>
                  <span className="text-2xl font-black italic tracking-tight">৳{depositBalance.toFixed(2)}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] uppercase opacity-50 font-black text-indigo-300 tracking-widest">WINNING POT</span>
                  <span className="text-2xl font-black italic tracking-tight text-indigo-200">৳{winningBalance.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-10">
               <button onClick={() => setSelectedMethod('bKash')} className={`flex-1 p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3 ${selectedMethod === 'bKash' ? 'bg-pink-600/10 border-pink-500 text-pink-500 shadow-xl' : 'bg-slate-900 border-slate-800 text-slate-600 opacity-60 grayscale'}`}>
                 <span className="font-black text-[11px] uppercase tracking-widest italic">bKash</span>
                 {selectedMethod === 'bKash' && <CheckCircle size={24} className="animate-in zoom-in" />}
               </button>
               <button onClick={() => setSelectedMethod('Nagad')} className={`flex-1 p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3 ${selectedMethod === 'Nagad' ? 'bg-orange-600/10 border-orange-500 text-orange-500 shadow-xl' : 'bg-slate-900 border-slate-800 text-slate-600 opacity-60 grayscale'}`}>
                 <span className="font-black text-[11px] uppercase tracking-widest italic">Nagad</span>
                 {selectedMethod === 'Nagad' && <CheckCircle size={24} className="animate-in zoom-in" />}
               </button>
            </div>

            <div className="space-y-10">
              <div className="bg-slate-900/40 p-8 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-md">
                <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                   <ArrowDownLeft size={16} className="text-emerald-500" /> DEPOSIT INTERFACE
                </h4>
                <div className="bg-[#020617] p-6 rounded-[1.5rem] mb-8 flex justify-between items-center border border-white/5 shadow-inner">
                  <div>
                    <span className="text-[9px] text-slate-600 font-black block uppercase mb-1">Send Money to:</span>
                    <span className="font-mono font-black text-white tracking-[0.2em] text-xl">{ADMIN_NUMBERS[selectedMethod]}</span>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(ADMIN_NUMBERS[selectedMethod]); alert("Number copied!"); }} className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl hover:bg-indigo-600/20 transition-all"><Copy size={20} /></button>
                </div>
                <div className="space-y-4">
                  <input type="tel" placeholder="Your Sender Number" value={senderNumber} onChange={e => setSenderNumber(e.target.value)} className="w-full bg-[#020617] border-2 border-slate-800 rounded-[1.25rem] py-5 px-7 outline-none focus:border-indigo-600 text-sm font-bold transition-all" />
                  <input type="text" placeholder="Transaction ID (TrxID)" value={trxId} onChange={e => setTrxId(e.target.value)} className="w-full bg-[#020617] border-2 border-slate-800 rounded-[1.25rem] py-5 px-7 outline-none focus:border-indigo-600 text-sm font-bold transition-all" />
                  <button onClick={handleDeposit} className="w-full bg-indigo-600 text-white font-black py-5 rounded-[1.5rem] shadow-2xl text-[11px] uppercase tracking-[0.25em] active:scale-95 transition-all">SUBMIT DEPOSIT LOG</button>
                </div>
              </div>

              <div className="bg-slate-900/40 p-8 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-md mb-20">
                <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                   <ArrowUpRight size={16} className="text-rose-500" /> WITHDRAWAL HUB
                </h4>
                <div className="space-y-4">
                  <input type="number" placeholder="Withdrawal Amount (Min ৳100)" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} className="w-full bg-[#020617] border-2 border-slate-800 rounded-[1.25rem] py-5 px-7 outline-none focus:border-indigo-600 text-sm font-bold transition-all" />
                  <input type="tel" placeholder="Receiving Mobile Number" value={withdrawNumber} onChange={e => setWithdrawNumber(e.target.value)} className="w-full bg-[#020617] border-2 border-slate-800 rounded-[1.25rem] py-5 px-7 outline-none focus:border-indigo-600 text-sm font-bold transition-all" />
                  <button onClick={handleWithdrawal} className="w-full bg-white text-black font-black py-5 rounded-[1.5rem] shadow-2xl text-[11px] uppercase tracking-[0.25em] active:scale-95 transition-all">REQUEST PAYOUT</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-6 animate-in fade-in duration-500">
             <h2 className="text-3xl font-black mb-2 tracking-tight italic">AUDIT LOGS</h2>
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-10">TRANSACTION & MATCH HISTORY</p>
             <div className="space-y-4">
               {transactions.map(tx => (
                 <div key={tx.id} className="bg-[#0F172A] p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:bg-indigo-600/5 transition-all">
                   <div className="flex items-center gap-5">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-500' : tx.type === 'withdrawal' ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-400'} border border-white/5`}>
                       {tx.type === 'deposit' ? <Plus size={24} /> : tx.type === 'winning' ? <Trophy size={20} /> : <ArrowUpRight size={24} />}
                     </div>
                     <div>
                       <span className="text-xs font-black block tracking-tight uppercase italic">{tx.type.replace('_', ' ')}</span>
                       <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{tx.id} • {tx.method}</span>
                     </div>
                   </div>
                   <div className="text-right">
                     <span className={`text-lg font-black block tracking-tighter ${tx.type === 'deposit' || tx.type === 'winning' ? 'text-emerald-500' : 'text-rose-500'}`}>
                       {tx.type === 'deposit' || tx.type === 'winning' ? '+' : '-'}৳{tx.amount || '0.00'}
                     </span>
                     <div className="flex items-center justify-end gap-1.5 mt-1">
                       <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                       <span className={`text-[8px] font-black uppercase tracking-widest ${tx.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>{tx.status}</span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-6 pb-32 animate-in fade-in duration-500">
            <div className="flex flex-col items-center mb-12">
              <div className="w-32 h-32 bg-indigo-600 rounded-[3rem] flex items-center justify-center text-white border-4 border-[#020617] shadow-[0_30px_60px_rgba(79,70,229,0.3)] rotate-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
                <Users size={64} className="relative z-10" />
              </div>
              <h2 className="text-3xl font-black mt-8 tracking-tighter italic uppercase">{name || 'ELITE PLAYER'}</h2>
              <div className="bg-indigo-500/10 text-indigo-400 px-5 py-2 rounded-full text-[10px] font-black mt-4 uppercase tracking-[0.3em] border border-indigo-500/20 shadow-lg">PLAYER ID: {phone || 'SECURE'}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="bg-[#0F172A] p-6 rounded-[2rem] border border-white/5 text-center shadow-xl">
                <span className="text-[9px] font-black text-slate-600 block mb-1.5 uppercase tracking-widest">DUELS</span>
                <span className="text-2xl font-black italic tracking-tighter text-white">124</span>
              </div>
              <div className="bg-[#0F172A] p-6 rounded-[2rem] border border-white/5 text-center shadow-xl">
                <span className="text-[9px] font-black text-slate-600 block mb-1.5 uppercase tracking-widest">WINS</span>
                <span className="text-2xl font-black italic tracking-tighter text-emerald-500">82</span>
              </div>
              <div className="bg-[#0F172A] p-6 rounded-[2rem] border border-white/5 text-center shadow-xl">
                <span className="text-[9px] font-black text-slate-600 block mb-1.5 uppercase tracking-widest">WIN %</span>
                <span className="text-2xl font-black italic tracking-tighter text-indigo-400">66</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden mb-12 shadow-2xl group cursor-pointer active:scale-[0.98] transition-all">
              <Share2 className="absolute -right-10 -top-10 opacity-10 rotate-12 transition-transform group-hover:scale-125 duration-700" size={180} />
              <h3 className="text-2xl font-black mb-1 italic tracking-tight uppercase">REFERRAL VAULT</h3>
              <p className="text-white/60 text-[10px] mb-8 font-black uppercase tracking-[0.2em]">INVITE SQUAD & EARN ৳25 PER PLAYER</p>
              <div className="bg-black/20 p-5 rounded-[1.5rem] border border-white/10 flex justify-between items-center backdrop-blur-xl">
                <span className="font-mono font-black tracking-[0.4em] text-xl">REF-{phone.slice(-4) || 'WIN'}</span>
                <button onClick={() => { alert("Link copied to clipboard!"); }} className="bg-white text-indigo-700 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">SHARE</button>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-7 bg-[#0F172A] rounded-[2rem] border border-white/5 group hover:bg-indigo-600/5 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform"><Lock size={22} /></div>
                  <span className="font-black text-[11px] uppercase tracking-[0.25em] text-slate-300">SECURITY SETTINGS</span>
                </div>
                <ChevronRight size={20} className="text-slate-700 group-hover:text-indigo-400" />
              </button>
              
              <button onClick={() => { setIsLoggedIn(false); setView('login'); }} className="w-full p-7 bg-rose-500/5 text-rose-500 rounded-[2rem] font-black flex items-center justify-between group hover:bg-rose-500/10 border border-rose-500/10 transition-all">
                <div className="flex items-center gap-5">
                  <LogOut size={24} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-[11px] uppercase tracking-[0.3em] font-black italic">TERMINATE SESSION</span>
                </div>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
