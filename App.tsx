
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
    { id: 'TX-882', amount: 500, type: 'deposit', method: 'bKash', status: 'completed', date: 'Oct 24, 2024', timestamp: Date.now() - 86400000 },
    { id: 'TX-884', amount: 1500, type: 'winning', method: 'Wallet', status: 'completed', date: 'Today', timestamp: Date.now() - 3600000 }
  ]);

  useEffect(() => {
    try {
      const hwid = localStorage.getItem('android_device_hwid');
      if (!hwid) {
        localStorage.setItem('android_device_hwid', 'SECURE-HWID-' + Math.random().toString(36).substring(7).toUpperCase());
      }
    } catch (e) {
      console.warn("Local storage not accessible");
    }
  }, []);

  const generateAndSendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpInputs(['', '', '', '', '', '']);
    setShowNotification(true);
    setError(null);
    setTimeout(() => setShowNotification(false), 12000);
  };

  const handleAuth = async (type: 'login' | 'signup') => {
    setError(null);
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    if (type === 'signup') {
      if (!name || phone.length < 11 || password.length < 6) {
        setError("Please fill all fields correctly.");
        setIsLoading(false);
        return;
      }
      const deviceLock = localStorage.getItem('device_account_lock');
      if (deviceLock && deviceLock !== phone) {
        setView('device-lock');
        setIsLoading(false);
        return;
      }
      generateAndSendOtp();
      setView('otp');
    } else {
      if (phone.length < 11) {
        setError("Invalid mobile number.");
        setIsLoading(false);
        return;
      }
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  };

  const verifyOtp = () => {
    if (otpInputs.join('') === generatedOtp) {
      localStorage.setItem('device_account_lock', phone);
      setIsLoggedIn(true);
    } else {
      setError("Wrong OTP. Please check the notification.");
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

  const handleDeposit = () => {
    if (!/^\d{11}$/.test(senderNumber) || trxId.length < 8) return setError("Invalid details.");
    alert("Deposit request submitted!");
    setSenderNumber(''); setTrxId('');
  };

  if (!isLoggedIn) {
    if (view === 'device-lock') {
      return (
        <div className="flex flex-col h-screen bg-[#020617] items-center justify-center p-10 text-center">
          <ShieldCheck size={60} className="text-rose-500 mb-6" />
          <h2 className="text-2xl font-black mb-4 uppercase italic">Device Locked</h2>
          <p className="text-slate-400 mb-8">Multiple account usage detected. Only one account per device allowed.</p>
          <button onClick={() => setView('login')} className="bg-indigo-600 px-8 py-4 rounded-2xl font-black">BACK</button>
        </div>
      );
    }

    if (view === 'otp') {
      return (
        <div className="flex flex-col min-h-screen bg-[#020617] p-8 text-white">
          {showNotification && (
            <div className="fixed top-6 inset-x-4 bg-slate-900 border border-indigo-500/50 p-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50">
              <MessageSquare className="text-indigo-500" />
              <p className="text-sm font-bold">Your Win Code: <span className="text-indigo-400 text-lg">{generatedOtp}</span></p>
            </div>
          )}
          <h2 className="text-3xl font-black mt-20 mb-10 italic">VERIFY OTP</h2>
          {error && <div className="bg-rose-500/10 text-rose-500 p-4 rounded-xl mb-6 text-xs">{error}</div>}
          <div className="flex gap-2 mb-10">
            {otpInputs.map((d, i) => (
              <input key={i} ref={el => otpRefs.current[i] = el} type="tel" maxLength={1} value={d} onChange={e => handleOtpChange(i, e.target.value)} className="w-full h-14 bg-slate-900 border border-slate-800 rounded-xl text-center text-xl font-bold text-indigo-400 focus:border-indigo-600 outline-none" />
            ))}
          </div>
          <button onClick={verifyOtp} className="bg-indigo-600 py-4 rounded-2xl font-black shadow-lg">VALIDATE</button>
        </div>
      );
    }

    return (
      <div className="flex flex-col min-h-screen bg-[#020617] p-10 text-white">
        <div className="mt-12 mb-16 flex flex-col items-center">
          <Zap size={50} className="text-indigo-500 mb-6" />
          <h1 className="text-3xl font-black italic">TIC TAC WIN</h1>
          <p className="text-indigo-400 text-[10px] tracking-widest mt-1">TOURNAMENT HUB</p>
        </div>
        {error && <div className="bg-rose-500/10 text-rose-500 p-4 rounded-xl mb-6 text-sm">{error}</div>}
        <div className="space-y-4">
          {view === 'signup' && <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900 p-4 rounded-xl border border-slate-800 outline-none focus:border-indigo-600" />}
          <input type="tel" placeholder="Mobile Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-900 p-4 rounded-xl border border-slate-800 outline-none focus:border-indigo-600" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900 p-4 rounded-xl border border-slate-800 outline-none focus:border-indigo-600" />
          <button onClick={() => handleAuth(view === 'login' ? 'login' : 'signup')} className="w-full bg-indigo-600 py-4 rounded-xl font-black flex justify-center mt-4">
            {isLoading ? <Loader2 className="animate-spin" /> : (view === 'login' ? 'LOGIN' : 'SIGN UP')}
          </button>
          <button onClick={() => setView(view === 'login' ? 'signup' : 'login')} className="w-full text-slate-500 text-[10px] mt-4 font-bold">
            {view === 'login' ? "NEW PLAYER? JOIN NOW" : "ALREADY REGISTERED? LOGIN"}
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
            <div className="bg-indigo-500/10 p-2 overflow-hidden mb-8 border-y border-indigo-500/20">
              <div className="animate-marquee gap-8">
                {WINNERS_LIST.map((w, i) => <span key={i} className="text-[10px] font-black italic text-indigo-400 uppercase tracking-wider">🏆 {w}</span>)}
              </div>
            </div>
            <h2 className="text-xl font-black italic mb-6">ACTIVE ARENAS</h2>
            <div className="space-y-4">
              {MOCK_TOURNAMENTS.map(t => (
                <div key={t.id} className="bg-slate-900 p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-black text-lg italic uppercase">{t.title}</h3>
                      <p className="text-[10px] text-slate-500">PRIZE: ৳{t.prizePool}</p>
                    </div>
                    <div className="bg-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black italic">৳{t.entryFee}</div>
                  </div>
                  <button onClick={() => {
                    if (depositBalance < t.entryFee) { setActiveTab('wallet'); return; }
                    setDepositBalance(d => d - t.entryFee);
                    setIsMatchmaking(true);
                    setTimeout(() => { setIsMatchmaking(false); setCurrentGame(t); }, 3000);
                  }} className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">JOIN NOW</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="animate-in fade-in duration-500 pb-20">
            <h2 className="text-2xl font-black mb-8 italic">VAULT</h2>
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-8 rounded-[2rem] mb-10 shadow-2xl">
              <span className="text-[10px] font-black opacity-60 uppercase tracking-widest block mb-1">BALANCE</span>
              <h3 className="text-4xl font-black italic">৳{(depositBalance + winningBalance).toFixed(2)}</h3>
              <div className="grid grid-cols-2 gap-4 mt-8 border-t border-white/10 pt-4">
                <div><p className="text-[8px] opacity-60 font-black">DEPOSIT</p><p className="font-bold">৳{depositBalance.toFixed(2)}</p></div>
                <div><p className="text-[8px] opacity-60 font-black">WINNINGS</p><p className="font-bold text-indigo-200">৳{winningBalance.toFixed(2)}</p></div>
              </div>
            </div>
            
            <div className="flex gap-2 mb-8">
              {['bKash', 'Nagad'].map(m => (
                <button key={m} onClick={() => setSelectedMethod(m as any)} className={`flex-1 py-4 rounded-2xl border-2 transition-all font-black text-xs ${selectedMethod === m ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>{m}</button>
              ))}
            </div>

            <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 space-y-4">
              <p className="text-[9px] font-black text-slate-500 uppercase mb-2">ADD MONEY</p>
              <div className="bg-slate-950 p-4 rounded-xl flex justify-between items-center border border-white/5">
                <span className="font-mono font-bold text-sm">{ADMIN_NUMBERS[selectedMethod]}</span>
                <button onClick={() => { navigator.clipboard.writeText(ADMIN_NUMBERS[selectedMethod]); alert("Copied!"); }}><Copy size={16}/></button>
              </div>
              <input type="tel" placeholder="Sender Number" value={senderNumber} onChange={e => setSenderNumber(e.target.value)} className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm" />
              <input type="text" placeholder="TrxID" value={trxId} onChange={e => setTrxId(e.target.value)} className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm" />
              <button onClick={handleDeposit} className="w-full bg-indigo-600 py-4 rounded-xl font-black text-xs uppercase shadow-xl">SUBMIT</button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="text-center animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-2xl rotate-3"><Users size={32}/></div>
            <h2 className="text-2xl font-black italic uppercase">{name || 'Player'}</h2>
            <p className="text-indigo-400 text-xs font-bold mb-10">{phone}</p>
            <button onClick={() => setIsLoggedIn(false)} className="w-full bg-rose-500/10 text-rose-500 py-4 rounded-2xl font-black flex items-center justify-center gap-2 border border-rose-500/10"><LogOut size={18}/> LOGOUT</button>
          </div>
        )}
      </div>

      {isMatchmaking && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[1000] flex flex-col items-center justify-center p-10 text-center">
          <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-black italic">SEARCHING...</h2>
          <p className="text-slate-500 text-[10px] tracking-widest mt-2">FINDING ELITE COMPETITOR</p>
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
