
export interface User {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  depositBalance: number;
  winnings: number;
  matchesPlayed: number;
  won: number;
  lost: number;
  referralCode: string;
  isVerified: boolean;
  deviceId: string;
  avatar?: string;
}

export interface Tournament {
  id: string;
  title: string;
  entryFee: number;
  prizePool: number;
  slotsTotal: number;
  slotsLeft: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface GameState {
  board: (string | null)[];
  currentPlayer: 'X' | 'O';
  winner: string | null;
  isDraw: boolean;
  timeLeft: number;
  opponentName: string;
  mySymbol: 'X' | 'O';
  lastMoveTimestamp: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'winning' | 'entry_fee';
  method: 'bKash' | 'Nagad' | 'Wallet';
  trxId?: string;
  senderNumber?: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  timestamp: number;
}
