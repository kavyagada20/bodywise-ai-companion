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
  AlertCircle,
  Sun,
  Moon,
  Leaf,
  CheckCircle
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

  const morningTasks = routineTasks.filter((t) => t.time_of_day === 'morning');
  const eveningTasks = routineTasks.filter((t) => t.time_of_day === 'evening' || t.time_of_day === 'night');

  const concern = profile?.primary_concern || 'Hair fall';
  const userName = user?.name ? user.name.split(' ')[0] : 'Kavya';

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      {/* 1. Welcome Hero Section */}
      <div className="bg-white rounded-2xl border border-[#E3E8E1] p-6 md:p-8 shadow-card relative overflow-hidden">
        {/* Soft botanical ambient decoration */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-[#EDF3ED] via-[#EDF3ED]/40 to-transparent rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EDF3ED] text-[#173F35] text-xs font-semibold mb-3 border border-[#D0DDD0]">
              <Leaf className="w-3.5 h-3.5 text-[#477C68]" />
              <span>Targeting: {concern}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#173F35] tracking-tight">
              Good morning, {userName}
            </h1>
            <p className="text-sm md:text-base text-[#727B74] mt-1.5 leading-relaxed">
              Your personalized personal-care journey is on track. You have completed{' '}
              <span className="font-semibold text-[#173F35]">{completedCount} of {totalCount} scheduled steps</span> for today.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-[#FAF9F5] border border-[#E3E8E1] flex items-center space-x-3 min-w-[130px]">
              <div className="w-10 h-10 rounded-lg bg-[#EDF3ED] text-[#173F35] flex items-center justify-center font-bold">
                <Flame className="w-5 h-5 text-[#B7791F]" />
              </div>
              <div>
                <p className="text-[11px] text-[#727B74] font-medium uppercase tracking-wide">Streak</p>
                <p className="text-lg font-bold text-[#173F35]">{streak} Days</p>
              </div>
            </div>

            <div className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-[#FAF9F5] border border-[#E3E8E1] flex items-center space-x-3 min-w-[130px]">
              <div className="w-10 h-10 rounded-lg bg-[#EDF3ED] text-[#477C68] flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5 text-[#2F855A]" />
              </div>
              <div>
                <p className="text-[11px] text-[#727B74] font-medium uppercase tracking-wide">Adherence</p>
                <p className="text-lg font-bold text-[#173F35]">{adherence}%</p>
              </div>
            </div>

            <div className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-[#FAF9F5] border border-[#E3E8E1] flex items-center space-x-3 min-w-[130px]">
              <div className="w-10 h-10 rounded-lg bg-[#EDF3ED] text-[#173F35] flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5 text-[#173F35]" />
              </div>
              <div>
                <p className="text-[11px] text-[#727B74] font-medium uppercase tracking-wide">Weekly Review</p>
                <p className="text-sm font-bold text-[#173F35]">Sunday</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Routine (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-[#E3E8E1] p-6 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#173F35]">Today&apos;s Regimen</h2>
                <p className="text-xs text-[#727B74]">
                  {activeRoutine?.name || 'Personalized Wellness Regimen'}
                </p>
              </div>
              <button
                onClick={() => onNavigate('routine')}
                className="text-xs font-semibold text-[#173F35] hover:text-[#477C68] flex items-center space-x-1 transition-colors"
              >
                <span>Full Schedule</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Daily Adherence Progress Bar */}
            <div className="mb-6 p-4 rounded-xl bg-[#FAF9F5] border border-[#E3E8E1]">
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-[#252D29]">Daily Completion</span>
                <span className="text-[#173F35] font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-[#E3E8E1] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#173F35] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Empty State */}
            {routineTasks.length === 0 ? (
              <div className="text-center py-10 px-4 bg-[#FAF9F5] rounded-xl border border-dashed border-[#D0DDD0]">
                <Calendar className="w-8 h-8 text-[#A8BDA9] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#173F35]">No active regimen found</p>
                <p className="text-xs text-[#727B74] mt-1 mb-4 max-w-sm mx-auto">
                  Our AI Companion can formulate a custom morning and evening routine tailored to your {concern}.
                </p>
                <button
                  onClick={() => onQuickAsk(`Help me create a personalized routine for ${concern}`)}
                  className="px-4 py-2 rounded-lg bg-[#173F35] text-white text-xs font-semibold hover:bg-[#1F4F43] transition-all shadow-sm"
                >
                  Generate Routine with AI
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Morning Tasks */}
                {morningTasks.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Sun className="w-4 h-4 text-[#B7791F]" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#727B74]">
                        Morning Steps ({morningTasks.length})
                      </h3>
                    </div>
                    <div className="space-y-2.5">
                      {morningTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-start justify-between p-3.5 rounded-xl border transition-all ${
                            task.is_completed_today
                              ? 'bg-[#EDF3ED]/50 border-[#D0DDD0]'
                              : 'bg-white border-[#E3E8E1] hover:border-[#A8BDA9]'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <button
                              onClick={() => onToggleTask(task.id, task.is_completed_today)}
                              className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
                              title={task.is_completed_today ? "Mark as pending" : "Mark as completed"}
                            >
                              {task.is_completed_today ? (
                                <CheckCircle2 className="w-5 h-5 text-[#2F855A] fill-[#EDF3ED]" />
                              ) : (
                                <Circle className="w-5 h-5 text-[#D0DDD0] hover:text-[#477C68]" />
                              )}
                            </button>
                            <div>
                              <h4
                                className={`text-sm font-medium ${
                                  task.is_completed_today
                                    ? 'text-[#727B74] line-through'
                                    : 'text-[#252D29]'
                                }`}
                              >
                                {task.title}
                              </h4>
                              <p className="text-xs text-[#727B74] mt-0.5 leading-relaxed">
                                {task.description}
                              </p>
                              {task.product_name && (
                                <span className="inline-block mt-2 text-[11px] font-medium text-[#173F35] bg-[#EDF3ED] px-2 py-0.5 rounded border border-[#D0DDD0]">
                                  {task.product_name}
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="text-xs text-[#727B74] bg-[#FAF9F5] px-2 py-1 rounded-md flex-shrink-0 ml-3 flex items-center space-x-1 border border-[#E3E8E1]">
                            <Clock className="w-3 h-3 text-[#477C68]" />
                            <span>{task.scheduled_time}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evening Tasks */}
                {eveningTasks.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Moon className="w-4 h-4 text-[#477C91]" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#727B74]">
                        Evening Steps ({eveningTasks.length})
                      </h3>
                    </div>
                    <div className="space-y-2.5">
                      {eveningTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-start justify-between p-3.5 rounded-xl border transition-all ${
                            task.is_completed_today
                              ? 'bg-[#EDF3ED]/50 border-[#D0DDD0]'
                              : 'bg-white border-[#E3E8E1] hover:border-[#A8BDA9]'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <button
                              onClick={() => onToggleTask(task.id, task.is_completed_today)}
                              className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
                              title={task.is_completed_today ? "Mark as pending" : "Mark as completed"}
                            >
                              {task.is_completed_today ? (
                                <CheckCircle2 className="w-5 h-5 text-[#2F855A] fill-[#EDF3ED]" />
                              ) : (
                                <Circle className="w-5 h-5 text-[#D0DDD0] hover:text-[#477C68]" />
                              )}
                            </button>
                            <div>
                              <h4
                                className={`text-sm font-medium ${
                                  task.is_completed_today
                                    ? 'text-[#727B74] line-through'
                                    : 'text-[#252D29]'
                                }`}
                              >
                                {task.title}
                              </h4>
                              <p className="text-xs text-[#727B74] mt-0.5 leading-relaxed">
                                {task.description}
                              </p>
                              {task.product_name && (
                                <span className="inline-block mt-2 text-[11px] font-medium text-[#173F35] bg-[#EDF3ED] px-2 py-0.5 rounded border border-[#D0DDD0]">
                                  {task.product_name}
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="text-xs text-[#727B74] bg-[#FAF9F5] px-2 py-1 rounded-md flex-shrink-0 ml-3 flex items-center space-x-1 border border-[#E3E8E1]">
                            <Clock className="w-3 h-3 text-[#477C68]" />
                            <span>{task.scheduled_time}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Companion Card & Quick Actions */}
        <div className="space-y-6">
          {/* AI Companion Card */}
          <div className="bg-[#173F35] rounded-xl text-white p-6 shadow-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center space-x-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#A8BDA9]" />
              </div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#A8BDA9]">
                Agentic Companion
              </span>
            </div>

            <h3 className="text-base font-bold">Your routine is active.</h3>
            <p className="text-xs text-[#EDF3ED] mt-1.5 leading-relaxed">
              &quot;I noticed consistent adherence for your {concern} regimen. Ask me anytime about active ingredients, routine tweaks, or missed steps.&quot;
            </p>

            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => onQuickAsk('Show me today\'s routine steps and tips')}
                className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium transition-all flex items-center justify-between text-[#EDF3ED]"
              >
                <span>&quot;Show today&apos;s steps &amp; tips&quot;</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#A8BDA9]" />
              </button>
              <button
                onClick={() => onQuickAsk('Explain how my active ingredients work')}
                className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium transition-all flex items-center justify-between text-[#EDF3ED]"
              >
                <span>&quot;Explain how my active ingredients work&quot;</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#A8BDA9]" />
              </button>
              <button
                onClick={() => onNavigate('companion')}
                className="w-full mt-3 py-2 rounded-lg bg-white text-[#173F35] text-xs font-bold hover:bg-[#FAF9F5] transition-all flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Bot className="w-4 h-4 text-[#173F35]" />
                <span>Open AI Companion Chat</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[#E3E8E1] p-5 shadow-card">
            <h3 className="text-sm font-bold text-[#173F35] mb-3">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onNavigate('routine')}
                className="p-3 rounded-lg bg-[#FAF9F5] hover:bg-[#EDF3ED] border border-[#E3E8E1] text-left transition-all group"
              >
                <Calendar className="w-4 h-4 text-[#477C68] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#252D29] block">My Routine</span>
                <span className="text-[10px] text-[#727B74]">Weekly schedule</span>
              </button>

              <button
                onClick={() => onNavigate('progress')}
                className="p-3 rounded-lg bg-[#FAF9F5] hover:bg-[#EDF3ED] border border-[#E3E8E1] text-left transition-all group"
              >
                <TrendingUp className="w-4 h-4 text-[#477C68] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#252D29] block">Check-in</span>
                <span className="text-[10px] text-[#727B74]">Log weekly notes</span>
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="p-3 rounded-lg bg-[#FAF9F5] hover:bg-[#EDF3ED] border border-[#E3E8E1] text-left transition-all group"
              >
                <ShoppingBag className="w-4 h-4 text-[#477C68] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#252D29] block">Be Bodywise</span>
                <span className="text-[10px] text-[#727B74]">Verified catalogue</span>
              </button>

              <button
                onClick={() => onQuickAsk('I missed yesterday\'s routine. What should I do?')}
                className="p-3 rounded-lg bg-[#FAF9F5] hover:bg-[#EDF3ED] border border-[#E3E8E1] text-left transition-all group"
              >
                <AlertCircle className="w-4 h-4 text-[#B7791F] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#252D29] block">Missed a Day?</span>
                <span className="text-[10px] text-[#727B74]">Clinical guidance</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Product Recommendations Section */}
      <div className="bg-white rounded-xl border border-[#E3E8E1] p-6 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-[#173F35]">Formulations for Your Concern</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EDF3ED] text-[#2F855A] border border-[#D0DDD0]">
                Verified Actives
              </span>
            </div>
            <p className="text-xs text-[#727B74] mt-0.5">
              Clinically formulated Be Bodywise solutions targeting {concern}.
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-semibold text-[#173F35] hover:text-[#477C68] flex items-center space-x-1 transition-colors"
          >
            <span>View All ({recommendedProducts.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedProducts.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
              className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E3E8E1] hover:border-[#A8BDA9] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-[#173F35] border border-[#E3E8E1]">
                    {prod.category}
                  </span>
                  <span className="text-xs font-bold text-[#173F35]">₹{prod.price}</span>
                </div>
                <h4 className="text-sm font-bold text-[#252D29] line-clamp-1">{prod.name}</h4>
                <p className="text-xs text-[#727B74] mt-1 line-clamp-2 leading-relaxed">{prod.description}</p>
                
                {prod.key_actives && (
                  <div className="mt-2.5 text-[11px] text-[#252D29] bg-white px-2 py-1 rounded-md border border-[#E3E8E1]">
                    <span className="font-semibold text-[#173F35]">Actives:</span> {prod.key_actives}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#E3E8E1] flex items-center justify-between">
                <button
                  onClick={() => onQuickAsk(`Explain how ${prod.name} works and what ingredients it has`)}
                  className="text-xs font-semibold text-[#173F35] hover:text-[#477C68] flex items-center space-x-1"
                >
                  <Bot className="w-3.5 h-3.5 text-[#477C68]" />
                  <span>Ask AI About Product</span>
                </button>
                <button
                  onClick={() => onNavigate('products', { selectedProduct: prod })}
                  className="text-xs font-medium text-[#727B74] hover:text-[#173F35]"
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
