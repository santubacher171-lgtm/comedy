
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, User as UserIcon, ShieldAlert, Cpu, Timer, ShieldCheck } from 'lucide-react';
import { getGameCommentary } from '../services/geminiService';

interface GameRoomProps {
  onBack: () => void;
  tournamentTitle: string;
}

const GameRoom: React.FC<GameRoomProps> = ({ onBack, tournamentTitle }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15);
  const [commentary, setCommentary] = useState("Establishing secure P2P multiplayer handshake...");
  const [winner, setWinner] = useState<string | null>(null);
  const [isCheatingDetected, setIsCheatingDetected] = useState(false);
  const [isOpponentDisconnected, setIsOpponentDisconnected] = useState(false);

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleMove = async (index: number) => {
    if (board[index] || winner || isCheatingDetected || isOpponentDisconnected) return;
    
    // ANTI-CHEAT: Server-side Move Validation Simulation
    const currentPlayer = isXNext ? 'X' : 'O';
    const isLocalUser = isXNext; // Assuming local user is always 'X' in this room

    if (!isLocalUser) return; // Discard client-side move attempts for opponent

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setIsXNext(!isXNext);
    setTimeLeft(15);

    const win = calculateWinner(newBoard);
    if (win) {
      setWinner(win);
      setCommentary(`CRITICAL VICTORY! Transaction processing for ${win}...`);
    } else if (newBoard.every(sq => sq)) {
      setWinner('draw');
      setCommentary("STALEMATE. Match result recorded as Draw.");
    } else {
      // Syncing move via Gemini Commentary
      const comm = await getGameCommentary(newBoard, index, currentPlayer);
      setCommentary(comm);

      // Simulate Real-time Multiplayer Opponent (AI/Remote Player)
      setTimeout(() => {
        if (winner || isOpponentDisconnected) return;
        const available = newBoard.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
        if (available.length > 0) {
          const remoteMoveIdx = available[Math.floor(Math.random() * available.length)];
          const syncedBoard = [...newBoard];
          syncedBoard[remoteMoveIdx] = 'O';
          setBoard(syncedBoard);
          setIsXNext(true);
          setTimeLeft(15);
          
          const remoteWin = calculateWinner(syncedBoard);
          if (remoteWin) {
            setWinner(remoteWin);
            setCommentary("OPPONENT SECURED THE WIN. Tournament credit updated.");
          }
        }
      }, 1800);
    }
  };

  // Anti-Cheat: Connection drops award auto-wins
  useEffect(() => {
    const checkConn = setTimeout(() => {
      if (!winner && Math.random() < 0.015) { // 1.5% chance to simulate opponent quitting
        setIsOpponentDisconnected(true);
        setWinner('X'); 
        setCommentary("OPPONENT DISCONNECTED. Automatic victory awarded by Anti-Cheat system.");
      }
    }, 12000);
    return () => clearTimeout(checkConn);
  }, [winner]);

  useEffect(() => {
    if (winner || isCheatingDetected || isOpponentDisconnected) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const autoWinner = isXNext ? 'O' : 'X';
          setWinner(autoWinner);
          setCommentary(`TIMER EXPIRED. Victory awarded to ${autoWinner}.`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isXNext, winner, isCheatingDetected, isOpponentDisconnected]);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white p-6 relative">
      <div className="flex items-center gap-5 mb-12">
        <button onClick={onBack} className="p-3 bg-slate-900 border border-white/5 rounded-[1.25rem] shadow-2xl active:scale-90 transition-all">
          <ArrowLeft size={22} />
        </button>
        <div>
          <h2 className="font-black text-xl tracking-tight italic uppercase">{tournamentTitle}</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(99,102,241,0.8)]"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Encrypted Room Link</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-16">
        <div className={`p-6 rounded-[2.5rem] flex flex-col items-center gap-4 border-2 transition-all duration-500 ${isXNext ? 'border-indigo-600 bg-indigo-600/10 shadow-[0_0_30px_rgba(79,70,229,0.15)] scale-105' : 'border-slate-900 bg-slate-900/50 grayscale opacity-60'}`}>
          <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center border-4 border-slate-950 shadow-2xl">
            <UserIcon size={32} />
          </div>
          <div className="text-center">
            <span className="font-black text-[10px] uppercase tracking-widest text-white">Mustafa (X)</span>
            <div className="flex items-center gap-1 justify-center mt-1">
              <ShieldCheck size={10} className="text-indigo-400" />
              <span className="text-[8px] font-bold text-indigo-400 uppercase">Verified</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center relative">
          <div className={`w-20 h-20 rounded-full border-[8px] transition-all duration-300 ${timeLeft < 5 ? 'border-rose-600 animate-pulse' : 'border-indigo-600'} flex items-center justify-center bg-slate-900 shadow-2xl ring-1 ring-white/10`}>
            <span className={`text-3xl font-black italic ${timeLeft < 5 ? 'text-rose-500' : 'text-white'}`}>{timeLeft}</span>
          </div>
          <Timer size={16} className="absolute -bottom-8 text-slate-700 animate-bounce" />
        </div>

        <div className={`p-6 rounded-[2.5rem] flex flex-col items-center gap-4 border-2 transition-all duration-500 ${!isXNext ? 'border-indigo-600 bg-indigo-600/10 shadow-[0_0_30px_rgba(79,70,229,0.15)] scale-105' : 'border-slate-900 bg-slate-900/50 grayscale opacity-60'}`}>
          <div className="w-16 h-16 bg-slate-800 rounded-[1.5rem] flex items-center justify-center border-4 border-slate-950 shadow-2xl relative">
            {isOpponentDisconnected && (
              <div className="absolute inset-0 bg-rose-600/80 rounded-[1.5rem] flex items-center justify-center animate-in zoom-in">
                <ShieldAlert size={28} className="text-white" />
              </div>
            )}
            <Cpu size={32} className="text-slate-500" />
          </div>
          <div className="text-center">
            <span className="font-black text-[10px] uppercase tracking-widest text-slate-300">Player_92 (O)</span>
            <div className="flex items-center gap-1 justify-center mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isOpponentDisconnected ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></div>
              <span className="text-[8px] font-bold text-slate-500 uppercase">{isOpponentDisconnected ? 'Disconnected' : 'Online'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 aspect-square w-full mb-12">
        {board.map((val, idx) => (
          <button
            key={idx}
            onClick={() => handleMove(idx)}
            disabled={!!val || !!winner || !isXNext}
            className={`h-full rounded-[2.25rem] bg-slate-900 flex items-center justify-center text-6xl font-black transition-all active:scale-90 shadow-2xl border-2 border-white/5 relative group ${
              val === 'X' ? 'text-indigo-500 animate-in zoom-in duration-300' : 
              val === 'O' ? 'text-emerald-500 animate-in zoom-in duration-300' : ''
            } ${!val && !winner && isXNext ? 'hover:bg-slate-800 active:bg-indigo-900/40 cursor-pointer' : 'cursor-default'}`}
          >
            {val}
            {!val && !winner && isXNext && (
              <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 rounded-[2.25rem] transition-colors border-2 border-transparent group-hover:border-indigo-600/20"></div>
            )}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/95 p-8 rounded-[3rem] border border-white/5 min-h-[120px] flex items-center justify-center text-center italic text-slate-400 text-sm shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
         <div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.8)]"></div>
        {commentary}
      </div>

      {(winner || isOpponentDisconnected) && (
        <div className="mt-10 animate-in zoom-in slide-in-from-bottom-10 duration-500">
          <button
            onClick={onBack}
            className="w-full py-6 bg-white text-black rounded-[2.5rem] font-black text-lg hover:bg-slate-100 transition-all shadow-[0_0_60px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4 active:scale-95"
          >
            ARENA COMPLETE <ArrowRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default GameRoom;
