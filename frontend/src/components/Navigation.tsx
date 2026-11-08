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
  ShieldCheck,
  Leaf
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E3E8E1] px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Tagline */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={() => setCurrentTab('overview')}
        >
          <div className="w-9 h-9 rounded-lg bg-[#173F35] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Leaf className="w-5 h-5 text-[#A8BDA9]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg tracking-tight text-[#173F35]">Bodywise</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EDF3ED] text-[#173F35] font-semibold border border-[#D0DDD0]">
                AI Companion
              </span>
            </div>
            <p className="text-[11px] text-[#727B74] hidden sm:block">
              Intelligent Personal-Care &amp; Wellness Partner
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center space-x-1 bg-[#F5F5EF] p-1 rounded-xl border border-[#E3E8E1]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs lg:text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#EDF3ED] text-[#173F35] font-semibold border border-[#D0DDD0] shadow-sm'
                    : 'text-[#727B74] hover:text-[#173F35] hover:bg-white/60'
                } ${item.highlight && !isActive ? 'text-[#477C68] font-semibold' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#173F35]' : item.highlight ? 'text-[#477C68]' : 'text-[#727B74]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Status & Profile Controls */}
        <div className="flex items-center space-x-2.5">
          {demoMode && (
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#EDF3ED] text-[#173F35] text-xs font-medium border border-[#D0DDD0]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#477C68]" />
              <span>Demo Mode</span>
            </div>
          )}

          <button
            onClick={() => setCurrentTab('profile')}
            className="flex items-center space-x-2 pl-1.5 pr-3 py-1 rounded-lg bg-[#FAF9F5] hover:bg-[#EDF3ED] border border-[#E3E8E1] transition-all"
            title="User Profile"
          >
            <div className="w-7 h-7 rounded-md bg-[#173F35] text-white flex items-center justify-center text-xs font-semibold">
              {user?.name ? user.name[0] : 'K'}
            </div>
            <span className="text-xs font-medium text-[#252D29] hidden lg:inline max-w-[100px] truncate">
              {user?.name || 'Kavya Gada'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navigation */}
      <div className="flex md:hidden overflow-x-auto space-x-1.5 pt-2.5 mt-2 border-t border-[#E3E8E1] no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-all ${
                isActive
                  ? 'bg-[#173F35] text-white shadow-sm'
                  : 'bg-white text-[#727B74] border border-[#E3E8E1]'
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
