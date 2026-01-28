
import React from 'react';
import { Trophy, Wallet, Home, User, History, LayoutGrid, Award, ShieldCheck } from 'lucide-react';
import { Tournament } from './types';

export const COLORS = {
  primary: '#6366F1', // Indigo 500
  secondary: '#10B981', // Emerald 500
  accent: '#F59E0B', // Amber 500
  danger: '#EF4444', // Red 500
  background: '#020617', // Slate 950 (Deeper Dark)
  card: '#0F172A', // Slate 900
};

export const MOCK_TOURNAMENTS: Tournament[] = [
  { id: '1', title: 'Champions Elite Cup', entryFee: 100, prizePool: 1500, slotsTotal: 16, slotsLeft: 4, status: 'upcoming' },
  { id: '2', title: 'Starter Pro Duel', entryFee: 20, prizePool: 300, slotsTotal: 8, slotsLeft: 1, status: 'upcoming' },
  { id: '3', title: 'Grand Master League', entryFee: 500, prizePool: 10000, slotsTotal: 32, slotsLeft: 24, status: 'upcoming' },
  { id: '4', title: 'Night Warriors', entryFee: 50, prizePool: 750, slotsTotal: 20, slotsLeft: 2, status: 'upcoming' },
];

export const WINNERS_LIST = [
  "Rahat just won ৳500!",
  "Sumon earned ৳80 from Rookie Duel",
  "Fahim claimed ৳1200 in Grand Master",
  "Tisha received ৳100 Referral Bonus",
  "Arif won ৳50 in Night Clash"
];

export const NAV_ITEMS = [
  { id: 'home', icon: <LayoutGrid size={22} />, label: 'Arena' },
  { id: 'leaderboard', icon: <Award size={22} />, label: 'Elite' },
  { id: 'wallet', icon: <Wallet size={22} />, label: 'Vault' },
  { id: 'history', icon: <History size={22} />, label: 'Logs' },
  { id: 'profile', icon: <User size={22} />, label: 'Profile' }
];

export const ADMIN_NUMBERS = {
  bKash: '01712345678', // Replace with real admin numbers in Firebase
  Nagad: '01887654321'
};
