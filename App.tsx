
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
  Smartphone,
  Lock,
  ShieldCheck,
  AlertCircle,
  FileText,
  Copy,
  Plus,
  ArrowUpRight,
  Loader2,
  Zap,
  MessageSquare
} from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<'login' | 'signup' | 'otp' | 'device-lock'>('login');
  const [activeTab, setActiveTab] = useState('home');
  const [currentGame, setCurrentGame] = useState<Tournament | null>(null);
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  const [showNotification, setShowNotification] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [depositBalance, setDepositBalance] = useState(250.00);
  const [winningBalance, setWinningBalance] = useState(1420.50);
  const [selectedMethod, setSelectedMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNumber, setWithdrawNumber] = useState('');
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TX-101', amount: 500, type: 'deposit', method: 'bKash', status: 'completed', date: 'Oct 24, 2024', timestamp: Date.now() - 86400000 },
    { id: 'TX-102', amount: 1500, type: 'winning', method: 'Wallet', status: 'completed', date: 'Today', timestamp: Date.now() - 3600000 }
  ]);

  useEffect(() => {
    try {
      const hwid = localStorage.getItem('android_device_id');
      if (!hwid) {
        localStorage.setItem('android_device_id', 'DEV-' + Math.random().toString(36).substring(2, 10).toUpperCase());
      }
    } catch (e) { console.warn(e); }
  }, []);

  const generateAndSendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpInputs(['', '', '', '', '', '']);
    setShowNotification(true);
    setError(null);
    setTimeout(() => setShowNotification(false), 15000);
  };

  const handleAuth = async (type: 'login' | 'signup') => {
    setError(null);
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    if (type === 'signup') {
      if (!name || phone.length < 11 || password.length < 6) {
        setError("Invalid information. Please try again.");
        setIsLoading(false);
        return;
      }
      generateAndSendOtp();
      setView('otp');
    } else {
      if (phone.length < 11) {
        setError("Invalid phone number.");
        setIsLoading(false);
        return;
      }
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  };

  const verifyOtp = () => {
    if (otpInputs.join('') === generatedOtp) {
      setIsLoggedIn(true);
    } else {
      setError("Wrong OTP code.");
      setOtpInputs(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newInputs = [...otpInputs];
    newInputs[index] = value.slice(-1);
    setOtpInputs(newInputs);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  if (!isLoggedIn) {
    if (view === 'otp') {
      return (
        <div className="flex flex-col min-h-screen bg-[#020617] p-8 text-white">
          {showNotification && (
            <div className="fixed top-6 inset-x-6 bg-slate-900 border border-indigo-500 p-5 rounded-2xl shadow-2xl flex items-center gap-4 z-50">
              <MessageSquare className="text-indigo-400" />
              <p className="text-sm font-bold">Your OTP Code is: <span className="text-indigo-400 text-lg font-black">{generatedOtp}</span></p>
            </div>
          )}
          <h2 className="text-3xl font-black mt-20 mb-8 italic">VERIFICATION</h2>
          <div className="flex gap-2 mb-10">
            {otpInputs.map((d, i) => (
              <input key={i} ref={el => otpRefs.current[i] = el} type="tel" maxLength={1} value={d} onChange={e => handleOtpChange(i, e.target.value)} className="w-full h-14 bg-slate-900 border border-slate-800 rounded-xl text-center text-xl font-bold text-indigo-400 focus:border-indigo-500 outline-none" />
            ))}
          </div>
          <button onClick={verifyOtp} className="bg-indigo-600 py-4 rounded-xl font-black shadow-lg">VERIFY & JOIN</button>
        </div>
      );
    }

    return (
      <div className="flex flex-col min-h-screen bg-[#020617] p-10 text-white">
        <div className="mt-20 mb-16 flex flex-col items-center">
          <Zap size={60} className="text-indigo-500 mb-4" />
          <h1 className="text-4xl font-black italic tracking-tighter">TIC TAC WIN</h1>
          <p className="text-indigo-400 text-[10px] tracking-[0.4em] uppercase font-bold mt-2">Elite Arena</p>
        </div>
        {error && <div className="bg-rose-500/10 text-rose-500 p-4 rounded-xl mb-6 text-xs font-bold border border-rose-500/20">{error}</div>}
        <div className="space-y-4">
          {view === 'signup' && <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900 p-5 rounded-2xl border border-slate-800 outline-none focus:border-indigo-600 font-bold" />}
          <input type="tel" placeholder="Mobile Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-900 p-5 rounded-2xl border border-slate-800 outline-none focus:border-indigo-600 font-bold" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900 p-5 rounded-2xl border border-slate-800 outline-none focus:border-indigo-600 font-bold" />
          <button onClick={() => handleAuth(view === 'login' ? 'login' : 'signup')} className="w-full bg-indigo-600 py-5 rounded-2xl font-black text-sm tracking-widest flex justify-center shadow-2xl">
            {isLoading ? <Loader2 className="animate-spin" /> : (view === 'login' ? 'LOGIN ACCESS' : 'CREATE ACCOUNT')}
          </button>
          <button onClick={() => setView(view === 'login' ? 'signup' : 'login')} className="w-full text-slate-500 text-[10px] mt-6 font-black uppercase tracking-widest">
            {view === 'login' ? "NEW PLAYER? SIGN UP" : "HAVE ACCOUNT? LOGIN"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="p-6">
        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-indigo-500/5 p-3 overflow-hidden mb-10 border-y border-indigo-500/10 -mx-6">
              <div className="animate-marquee flex gap-12">
                {WINNERS_LIST.map((w, i) => <span key={i} className="text-[10px] font-black italic text-indigo-400 uppercase tracking-widest">🏆 {w}</span>)}
              </div>
            </div>
            <h2 className="text-2xl font-black italic mb-8 flex items-center gap-3">
               <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
               LIVE TOURNAMENTS
            </h2>
            <div className="space-y-6">
              {MOCK_TOURNAMENTS.map(t => (
                <div key={t.id} className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative group">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="font-black text-xl italic uppercase tracking-tight">{t.title}</h3>
                      <p className="text-[10px] text-slate-500 font-black mt-1">PRIZE POOL: ৳{t.prizePool}</p>
                    </div>
                    <div className="bg-indigo-600 px-5 py-2 rounded-full text-xs font-black italic">৳{t.entryFee}</div>
                  </div>
                  <button onClick={() => {
                    if (depositBalance < t.entryFee) { setActiveTab('wallet'); return; }
                    setDepositBalance(d => d - t.entryFee);
                    setIsMatchmaking(true);
                    setTimeout(() => { setIsMatchmaking(false); setCurrentGame(t); }, 3000);
                  }} className="w-full bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">JOIN MATCH</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="animate-in fade-in duration-500 pb-28">
            <h2 className="text-3xl font-black mb-8 italic">VAULT</h2>
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-10 rounded-[3rem] mb-12 shadow-2xl relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] opacity-10"><Trophy size={150} /></div>
              <span className="text-[10px] font-black opacity-60 uppercase tracking-widest block mb-2">TOTAL BALANCE</span>
              <h3 className="text-5xl font-black italic">৳{(depositBalance + winningBalance).toFixed(2)}</h3>
              <div className="grid grid-cols-2 gap-8 mt-12 border-t border-white/10 pt-6">
                <div><p className="text-[9px] opacity-50 font-black uppercase mb-1">Deposit</p><p className="text-xl font-black">৳{depositBalance.toFixed(2)}</p></div>
                <div><p className="text-[9px] opacity-50 font-black uppercase mb-1 text-indigo-300">Winning</p><p className="text-xl font-black text-indigo-300">৳{winningBalance.toFixed(2)}</p></div>
              </div>
            </div>
            
            <div className="flex gap-3 mb-10">
              {['bKash', 'Nagad'].map(m => (
                <button key={m} onClick={() => setSelectedMethod(m as any)} className={`flex-1 py-5 rounded-2xl border-2 transition-all font-black text-xs ${selectedMethod === m ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>{m}</button>
              ))}
            </div>

            <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CASH-IN FUNDS</p>
              <div className="bg-slate-950 p-5 rounded-2xl flex justify-between items-center border border-white/5">
                <span className="font-mono font-black text-lg">{ADMIN_NUMBERS[selectedMethod]}</span>
                <button onClick={() => { navigator.clipboard.writeText(ADMIN_NUMBERS[selectedMethod]); alert("Number Copied!"); }} className="text-indigo-400"><Copy size={22}/></button>
              </div>
              <input type="tel" placeholder="Your Number" value={senderNumber} onChange={e => setSenderNumber(e.target.value)} className="w-full bg-slate-950 p-5 rounded-2xl border border-slate-800 text-sm font-bold" />
              <input type="text" placeholder="Transaction ID (TrxID)" value={trxId} onChange={e => setTrxId(e.target.value)} className="w-full bg-slate-950 p-5 rounded-2xl border border-slate-800 text-sm font-bold" />
              <button onClick={() => { alert("Request Sent!"); setTrxId(''); setSenderNumber(''); }} className="w-full bg-indigo-600 py-5 rounded-2xl font-black text-xs uppercase shadow-2xl mt-4">CONFIRM DEPOSIT</button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="text-center animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] mx-auto flex items-center justify-center mb-8 shadow-2xl rotate-3"><Users size={45}/></div>
            <h2 className="text-3xl font-black italic uppercase tracking-tight">{name || 'ELITE PLAYER'}</h2>
            <p className="text-indigo-400 text-sm font-black mb-12">{phone}</p>
            <div className="grid grid-cols-2 gap-4 mb-12">
               <div className="bg-slate-900 p-6 rounded-3xl border border-white/5"><p className="text-[10px] font-black text-slate-500">MATCHES</p><p className="text-xl font-black">42</p></div>
               <div className="bg-slate-900 p-6 rounded-3xl border border-white/5"><p className="text-[10px] font-black text-slate-500">WIN RATE</p><p className="text-xl font-black">76%</p></div>
            </div>
            <button onClick={() => setIsLoggedIn(false)} className="w-full bg-rose-500/10 text-rose-500 py-6 rounded-[2rem] font-black flex items-center justify-center gap-3 border border-rose-500/10 active:scale-95 transition-all"><LogOut size={22}/> EXIT SESSION</button>
          </div>
        )}
      </div>

      {isMatchmaking && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[1000] flex flex-col items-center justify-center p-12 text-center">
          <div className="w-24 h-24 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_50px_rgba(79,70,229,0.3)]"></div>
          <h2 className="text-3xl font-black italic mb-2">MATCHMAKING</h2>
          <p className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase">Searching for elite opponent...</p>
        </div>
      )}

      {currentGame && (
        <div className="fixed inset-0 z-[2000] bg-slate-950">
          <GameRoom tournamentTitle={currentGame.title} onBack={() => setCurrentGame(null)} />
        </div>
      )}
    </Layout>
  );
};

export default App;
