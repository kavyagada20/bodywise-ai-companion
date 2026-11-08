'use client';

import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Calendar, 
  Clock, 
  TrendingUp, 
  ShoppingBag, 
  Bot, 
  Flame, 
  ShieldCheck,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface DashboardViewProps {
  user: any;
  profile: any;
  activeRoutine: any;
  routineTasks: any[];
  progressStats: any;
  recommendedProducts: any[];
  onToggleTask: (taskId: number, currentCompleted: boolean) => void;
  onNavigate: (tab: string, meta?: any) => void;
  onQuickAsk: (prompt: string) => void;
}

export default function DashboardView({
  user,
  profile,
  activeRoutine,
  routineTasks,
  progressStats,
  recommendedProducts,
  onToggleTask,
  onNavigate,
  onQuickAsk,
}: DashboardViewProps) {
  const completedCount = routineTasks.filter((t) => t.is_completed_today).length;
  const totalCount = routineTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const adherence = progressStats?.weekly_adherence || 85;
  const streak = progressStats?.current_streak_days || 4;

  const concern = profile?.primary_concern || 'Hair fall';
  const userName = user?.name ? user.name.split(' ')[0] : 'Kavya';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Welcome Section */}
      <div className="wellness-card p-6 md:p-8 bg-gradient-to-br from-[#faf7fc] via-white to-[#f4f0fa] border-[#ebdff3] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-bl from-[#dec7ea]/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#f3eef8] text-[#7c469b] text-xs font-semibold mb-3 border border-[#dec7ea]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Targeting: {concern}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#351a42] tracking-tight">
              Good morning, {userName}! 🌸
            </h1>
            <p className="text-sm md:text-base text-[#766585] mt-1 max-w-xl">
              Let&apos;s make your personal-care routine effortless to follow today. You have completed{' '}
              <span className="font-semibold text-[#7c469b]">{completedCount} of {totalCount}</span> scheduled steps.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="px-4 py-3 rounded-2xl bg-white border border-[#ebdff3] shadow-soft flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#fdf2f4] text-[#e07a89] flex items-center justify-center font-bold">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-xs text-[#766585] font-medium">Daily Streak</p>
                <p className="text-lg font-bold text-[#351a42]">{streak} Days</p>
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-white border border-[#ebdff3] shadow-soft flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#f1f8f3] text-[#529b68] flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#766585] font-medium">Adherence</p>
                <p className="text-lg font-bold text-[#351a42]">{adherence}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Grid: Today's Routine (Left) + AI Companion Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Routine (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="wellness-card p-6 border-[#ebdff3]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#351a42]">Today&apos;s Routine</h2>
                <p className="text-xs text-[#766585]">
                  {activeRoutine?.name || 'Personalized Wellness Regimen'}
                </p>
              </div>
              <button
                onClick={() => onNavigate('routine')}
                className="text-xs font-semibold text-[#7c469b] hover:text-[#553267] flex items-center space-x-1"
              >
                <span>Full Schedule</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-[#553267]">Daily Completion</span>
                <span className="text-[#7c469b]">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#f3eef8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ae7ecc] to-[#7c469b] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Tasks List */}
            {routineTasks.length === 0 ? (
              <div className="text-center py-8 px-4 bg-[#faf7fc] rounded-2xl border border-dashed border-[#dec7ea]">
                <Calendar className="w-8 h-8 text-[#ae7ecc] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#553267]">No active routine found</p>
                <p className="text-xs text-[#766585] mt-1 mb-4">
                  Ask your AI Companion to create a personalized routine for your {concern}.
                </p>
                <button
                  onClick={() => onQuickAsk(`Help me create a personalized routine for ${concern}`)}
                  className="px-4 py-2 rounded-xl bg-[#7c469b] text-white text-xs font-semibold hover:bg-[#673a7f] transition-all"
                >
                  Generate Routine with AI
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {routineTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start justify-between p-4 rounded-2xl border transition-all ${
                      task.is_completed_today
                        ? 'bg-[#f4f0fa]/60 border-[#dec7ea]'
                        : 'bg-white border-[#ebdff3] hover:border-[#c8a4dc] hover:shadow-soft'
                    }`}
                  >
                    <div className="flex items-start space-x-3.5">
                      <button
                        onClick={() => onToggleTask(task.id, task.is_completed_today)}
                        className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
                      >
                        {task.is_completed_today ? (
                          <CheckCircle2 className="w-5 h-5 text-[#7c469b] fill-[#f3eef8]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#dec7ea] hover:text-[#ae7ecc]" />
                        )}
                      </button>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3
                            className={`text-sm font-semibold ${
                              task.is_completed_today
                                ? 'text-[#766585] line-through'
                                : 'text-[#351a42]'
                            }`}
                          >
                            {task.title}
                          </h3>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#f3eef8] text-[#7c469b]">
                            {task.time_of_day}
                          </span>
                        </div>
                        <p className="text-xs text-[#766585] mt-0.5">
                          {task.description}
                        </p>
                        {task.product_name && (
                          <span className="inline-block mt-2 text-[11px] font-medium text-[#7c469b] bg-[#fbf9fe] px-2 py-0.5 rounded border border-[#ebdff3]">
                            Product: {task.product_name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 ml-3">
                      <span className="inline-flex items-center space-x-1 text-xs text-[#766585] bg-[#faf7fc] px-2 py-1 rounded-lg">
                        <Clock className="w-3 h-3 text-[#945bb7]" />
                        <span>{task.scheduled_time}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Companion Card & Quick Actions */}
        <div className="space-y-6">
          {/* AI Companion Card */}
          <div className="wellness-card p-6 bg-gradient-to-br from-[#7c469b] to-[#553267] text-white shadow-elevated relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center space-x-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#dec7ea]">
                Agentic Companion
              </span>
            </div>

            <h3 className="text-lg font-bold">Your routine is ready.</h3>
            <p className="text-xs text-[#ebdff3] mt-1.5 leading-relaxed">
              &quot;I noticed consistent evening adherence for your {concern} goals. Would you like to review today&apos;s progress or adjust reminder times?&quot;
            </p>

            <div className="mt-4 pt-4 border-t border-white/15 space-y-2">
              <button
                onClick={() => onQuickAsk('Show me today\'s routine steps and tips')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium transition-all flex items-center justify-between"
              >
                <span>&quot;Show today&apos;s steps &amp; tips&quot;</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-80" />
              </button>
              <button
                onClick={() => onQuickAsk('Explain how my active ingredients work')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium transition-all flex items-center justify-between"
              >
                <span>&quot;Explain how my active ingredients work&quot;</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-80" />
              </button>
              <button
                onClick={() => onNavigate('companion')}
                className="w-full mt-3 py-2.5 rounded-xl bg-white text-[#7c469b] text-xs font-bold hover:bg-[#faf7fc] transition-all flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Bot className="w-4 h-4" />
                <span>Open AI Companion Chat</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="wellness-card p-5 border-[#ebdff3]">
            <h3 className="text-sm font-bold text-[#351a42] mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onNavigate('routine')}
                className="p-3 rounded-xl bg-[#faf7fc] hover:bg-[#f3eef8] border border-[#ebdff3] text-left transition-all"
              >
                <Calendar className="w-4 h-4 text-[#7c469b] mb-1.5" />
                <span className="text-xs font-bold text-[#351a42] block">View Routine</span>
                <span className="text-[10px] text-[#766585]">Full weekly view</span>
              </button>

              <button
                onClick={() => onNavigate('progress')}
                className="p-3 rounded-xl bg-[#faf7fc] hover:bg-[#f3eef8] border border-[#ebdff3] text-left transition-all"
              >
                <TrendingUp className="w-4 h-4 text-[#7c469b] mb-1.5" />
                <span className="text-xs font-bold text-[#351a42] block">Check-in</span>
                <span className="text-[10px] text-[#766585]">Log weekly notes</span>
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="p-3 rounded-xl bg-[#faf7fc] hover:bg-[#f3eef8] border border-[#ebdff3] text-left transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-[#7c469b] mb-1.5" />
                <span className="text-xs font-bold text-[#351a42] block">Be Bodywise</span>
                <span className="text-[10px] text-[#766585]">Explore catalogue</span>
              </button>

              <button
                onClick={() => onQuickAsk('I missed yesterday\'s routine. What should I do?')}
                className="p-3 rounded-xl bg-[#faf7fc] hover:bg-[#f3eef8] border border-[#ebdff3] text-left transition-all"
              >
                <AlertCircle className="w-4 h-4 text-[#ae7ecc] mb-1.5" />
                <span className="text-xs font-bold text-[#351a42] block">Missed a Day?</span>
                <span className="text-[10px] text-[#766585]">Get recovery advice</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Product Recommendations Section */}
      <div className="wellness-card p-6 border-[#ebdff3]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-[#351a42]">Tailored For Your Goals</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f1f8f3] text-[#529b68] border border-[#529b68]/20">
                Verified Actives
              </span>
            </div>
            <p className="text-xs text-[#766585] mt-0.5">
              Science-backed Be Bodywise formulations targeting {concern}.
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-semibold text-[#7c469b] hover:text-[#553267] flex items-center space-x-1"
          >
            <span>View All ({recommendedProducts.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedProducts.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
              className="p-4 rounded-2xl bg-[#faf7fc] border border-[#ebdff3] hover:border-[#c8a4dc] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-[#7c469b] border border-[#ebdff3]">
                    {prod.category}
                  </span>
                  <span className="text-xs font-bold text-[#351a42]">₹{prod.price}</span>
                </div>
                <h4 className="text-sm font-bold text-[#351a42] line-clamp-1">{prod.name}</h4>
                <p className="text-xs text-[#766585] mt-1 line-clamp-2">{prod.description}</p>
                
                {prod.key_actives && (
                  <div className="mt-2.5 text-[11px] text-[#553267] bg-white px-2 py-1 rounded-lg border border-[#ebdff3]">
                    <span className="font-semibold text-[#7c469b]">Actives:</span> {prod.key_actives}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#ebdff3] flex items-center justify-between">
                <button
                  onClick={() => onQuickAsk(`Explain how ${prod.name} works and what ingredients it has`)}
                  className="text-xs font-semibold text-[#7c469b] hover:text-[#553267] flex items-center space-x-1"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask AI About Product</span>
                </button>
                <button
                  onClick={() => onNavigate('products', { selectedProduct: prod })}
                  className="text-xs font-medium text-[#766585] hover:text-[#351a42]"
                >
                  Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

