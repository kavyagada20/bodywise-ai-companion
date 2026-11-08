'use client';

import React from 'react';
import { 
  Sparkles, 
  CalendarCheck, 
  ShoppingBag, 
  Bot, 
  TrendingUp, 
  User, 
  Settings, 
  Bell, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: any;
  demoMode: boolean;
  onOpenOnboarding: () => void;
}

export default function Navigation({
  currentTab,
  setCurrentTab,
  user,
  demoMode,
  onOpenOnboarding,
}: NavigationProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'routine', label: 'My Routine', icon: CalendarCheck },
    { id: 'products', label: 'Discover Products', icon: ShoppingBag },
    { id: 'companion', label: 'AI Companion', icon: Bot, highlight: true },
    { id: 'progress', label: 'Progress Tracker', icon: TrendingUp },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#ebdff3] px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Tagline */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('overview')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7c469b] to-[#c8a4dc] flex items-center justify-center text-white shadow-soft">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-[#351a42]">Bodywise</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#f3eef8] text-[#7c469b] font-semibold border border-[#dec7ea]">
                AI Companion
              </span>
            </div>
            <p className="text-[11px] text-[#766585] hidden sm:block">
              Your Personal Care Journey, Intelligently Managed.
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 bg-[#fbf9fe] p-1 rounded-2xl border border-[#ebdff3]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-[#7c469b] shadow-soft border border-[#ebdff3]'
                    : 'text-[#766585] hover:text-[#553267] hover:bg-white/60'
                } ${item.highlight && !isActive ? 'text-[#945bb7]' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#7c469b]' : 'text-[#945bb7]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Status & Profile Controls */}
        <div className="flex items-center space-x-2.5">
          {demoMode && (
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#f3eef8] text-[#7c469b] text-xs font-medium border border-[#dec7ea]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7c469b]" />
              <span>Demo Mode</span>
            </div>
          )}

          <button
            onClick={() => setCurrentTab('profile')}
            className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-2xl bg-[#faf7fc] hover:bg-[#f3eef8] border border-[#ebdff3] transition-all"
            title="User Profile"
          >
            <div className="w-7 h-7 rounded-full bg-[#7c469b] text-white flex items-center justify-center text-xs font-semibold">
              {user?.name ? user.name[0] : 'K'}
            </div>
            <span className="text-xs font-medium text-[#553267] hidden lg:inline max-w-[100px] truncate">
              {user?.name || 'Kavya Gada'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navigation */}
      <div className="flex md:hidden overflow-x-auto space-x-1 pt-2.5 mt-2 border-t border-[#f4f0fa] no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-medium transition-all ${
                isActive
                  ? 'bg-[#7c469b] text-white'
                  : 'bg-[#fbf9fe] text-[#766585] border border-[#ebdff3]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}

