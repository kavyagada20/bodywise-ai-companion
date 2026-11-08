'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import DashboardView from '@/components/DashboardView';
import RoutineView from '@/components/RoutineView';
import ProductsView from '@/components/ProductsView';
import CompanionView from '@/components/CompanionView';
import ProgressView from '@/components/ProgressView';
import ProfileView from '@/components/ProfileView';
import SettingsView from '@/components/SettingsView';

import {
  apiDemoLogin,
  apiGetMe,
  apiGetProfile,
  apiGetActiveRoutine,
  apiGetProducts,
  apiGetProgressStats,
  apiGetProgressHistory,
  apiGetWeeklySummaries,
  apiGetCurrentConversation,
  apiGetReminders,
  apiToggleTask,
  apiToggleReminder,
  apiGetSettingsStatus,
} from '@/lib/api';

export default function Home() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activeRoutine, setActiveRoutine] = useState<any>(null);
  const [routineTasks, setRoutineTasks] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [progressStats, setProgressStats] = useState<any>(null);
  const [progressHistory, setProgressHistory] = useState<any[]>([]);
  const [weeklySummaries, setWeeklySummaries] = useState<any[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const [reminders, setReminders] = useState<any[]>([]);
  const [demoMode, setDemoMode] = useState(true);
  const [companionInitialPrompt, setCompanionInitialPrompt] = useState<string | undefined>(undefined);
  const [selectedProductForModal, setSelectedProductForModal] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    setIsLoading(true);
    try {
      // 1. Ensure user session exists; default to demo user for zero-friction challenge review
      let currentUser = null;
      try {
        currentUser = await apiGetMe();
      } catch {
        const loginRes = await apiDemoLogin();
        currentUser = loginRes.user;
      }
      setUser(currentUser);

      // 2. Load all application state in parallel
      await refreshAllData();
    } catch (err) {
      console.error('Initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAllData = async () => {
    try {
      const [
        profileData,
        routineData,
        productsData,
        statsData,
        historyData,
        summariesData,
        convData,
        remindersData,
        settingsData,
      ] = await Promise.allSettled([
        apiGetProfile(),
        apiGetActiveRoutine(),
        apiGetProducts(),
        apiGetProgressStats(),
        apiGetProgressHistory(),
        apiGetWeeklySummaries(),
        apiGetCurrentConversation(),
        apiGetReminders(),
        apiGetSettingsStatus(),
      ]);

      if (profileData.status === 'fulfilled') setProfile(profileData.value);
      if (routineData.status === 'fulfilled') {
        setActiveRoutine(routineData.value.routine);
        setRoutineTasks(routineData.value.tasks || []);
      }
      if (productsData.status === 'fulfilled') setProducts(productsData.value);
      if (statsData.status === 'fulfilled') setProgressStats(statsData.value);
      if (historyData.status === 'fulfilled') setProgressHistory(historyData.value);
      if (summariesData.status === 'fulfilled') setWeeklySummaries(summariesData.value);
      if (convData.status === 'fulfilled') setConversation(convData.value);
      if (remindersData.status === 'fulfilled') setReminders(remindersData.value);
      if (settingsData.status === 'fulfilled') setDemoMode(settingsData.value.demo_mode);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  const handleToggleTask = async (taskId: number, currentCompleted: boolean) => {
    try {
      // Optimistic update
      setRoutineTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, is_completed_today: !currentCompleted } : t))
      );

      const res = await apiToggleTask(taskId, !currentCompleted);
      // Refresh stats
      const statsRes = await apiGetProgressStats();
      setProgressStats(statsRes);
      const histRes = await apiGetProgressHistory();
      setProgressHistory(histRes);
    } catch (err) {
      console.error('Task toggle failed:', err);
      // Revert on error
      const routineRes = await apiGetActiveRoutine();
      setRoutineTasks(routineRes.tasks || []);
    }
  };

  const handleToggleReminder = async (reminderId: number) => {
    try {
      setReminders((prev) =>
        prev.map((r) => (r.id === reminderId ? { ...r, is_enabled: !r.is_enabled } : r))
      );
      await apiToggleReminder(reminderId);
    } catch (err) {
      console.error('Reminder toggle failed:', err);
    }
  };

  const handleNavigate = (tab: string, meta?: any) => {
    if (meta?.selectedProduct) {
      setSelectedProductForModal(meta.selectedProduct);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAsk = (prompt: string) => {
    setCompanionInitialPrompt(prompt);
    setCurrentTab('companion');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fbf9fe] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7c469b] to-[#c8a4dc] flex items-center justify-center text-white animate-pulse shadow-soft mb-4">
          <span className="font-bold text-lg">BW</span>
        </div>
        <p className="text-sm font-bold text-[#351a42]">Loading Bodywise AI Companion...</p>
        <p className="text-xs text-[#766585] mt-1">Initializing multi-agent orchestrator &amp; verified knowledge base</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9fe] text-[#2d1d3a] flex flex-col selection:bg-[#ebdff3] selection:text-[#553267]">
      {/* Global Navigation */}
      <Navigation
        currentTab={currentTab}
        setCurrentTab={handleNavigate}
        user={user}
        demoMode={demoMode}
        onOpenOnboarding={() => setCurrentTab('profile')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 md:py-8">
        {currentTab === 'overview' && (
          <DashboardView
            user={user}
            profile={profile}
            activeRoutine={activeRoutine}
            routineTasks={routineTasks}
            progressStats={progressStats}
            recommendedProducts={products}
            onToggleTask={handleToggleTask}
            onNavigate={handleNavigate}
            onQuickAsk={handleQuickAsk}
          />
        )}

        {currentTab === 'routine' && (
          <RoutineView
            routine={activeRoutine}
            tasks={routineTasks}
            reminders={reminders}
            onToggleTask={handleToggleTask}
            onToggleReminder={handleToggleReminder}
            onAskAI={handleQuickAsk}
            onRefresh={refreshAllData}
          />
        )}

        {currentTab === 'products' && (
          <ProductsView
            products={products}
            userConcern={profile?.primary_concern}
            onAskAI={handleQuickAsk}
            selectedProductInitial={selectedProductForModal}
          />
        )}

        {currentTab === 'companion' && (
          <CompanionView
            conversation={conversation}
            user={user}
            onRoutineUpdated={refreshAllData}
            initialPrompt={companionInitialPrompt}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressView
            stats={progressStats}
            history={progressHistory}
            summaries={weeklySummaries}
            onCheckInCompleted={refreshAllData}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            user={user}
            profile={profile}
            onProfileUpdated={refreshAllData}
            onNavigateOverview={() => setCurrentTab('overview')}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            demoMode={demoMode}
            onSettingsChanged={refreshAllData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-[#ebdff3] bg-white/60 text-center text-xs text-[#766585] px-4">
        <p>
          Bodywise AI Companion — Agentic Personal-Care Assistant • Mosaic Wellness Fellowship Builder Challenge
        </p>
        <p className="text-[11px] text-[#ae7ecc] mt-1">
          Grounding: Verified Be Bodywise public formulations • LangGraph Multi-Agent Architecture
        </p>
      </footer>
    </div>
  );
}

