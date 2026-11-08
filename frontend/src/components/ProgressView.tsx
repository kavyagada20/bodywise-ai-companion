'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Calendar, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  Plus, 
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';
import { apiSubmitCheckIn } from '@/lib/api';

interface ProgressViewProps {
  stats: any;
  history: any[];
  summaries: any[];
  onCheckInCompleted: () => void;
}

export default function ProgressView({
  stats,
  history,
  summaries,
  onCheckInCompleted,
}: ProgressViewProps) {
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [condition, setCondition] = useState('Improving');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const weeklyAdherence = stats?.weekly_adherence || 81;
  const totalCompleted = stats?.total_completed_this_week || 14;
  const totalMissed = stats?.total_missed_this_week || 3;
  const streak = stats?.current_streak_days || 4;

  const handleSubmitCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      await apiSubmitCheckIn(feedback, condition);
      setShowCheckInModal(false);
      setFeedback('');
      onCheckInCompleted();
    } catch (err: any) {
      alert(`Error submitting check-in: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="wellness-card p-6 md:p-8 border-[#ebdff3] bg-gradient-to-br from-[#faf7fc] to-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-[#f3eef8] text-[#7c469b] text-xs font-bold border border-[#dec7ea] flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Adherence Analytics</span>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#351a42]">
            Routine Progress &amp; Habit Insights
          </h1>
          <p className="text-sm text-[#766585] mt-1 max-w-xl">
            Track consistency, analyze routine adherence patterns, and view weekly AI evaluations of your personal care journey.
          </p>
        </div>

        <button
          onClick={() => setShowCheckInModal(true)}
          className="px-5 py-2.5 rounded-xl bg-[#7c469b] hover:bg-[#673a7f] text-white text-xs md:text-sm font-bold flex items-center space-x-2 transition-all shadow-soft self-start md:self-center"
        >
          <Sparkles className="w-4 h-4" />
          <span>Complete Weekly Check-in</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="wellness-card p-5 border-[#ebdff3]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#766585]">Weekly Adherence</span>
            <TrendingUp className="w-4 h-4 text-[#7c469b]" />
          </div>
          <p className="text-2xl font-black text-[#351a42]">{weeklyAdherence}%</p>
          <p className="text-[11px] text-[#529b68] font-semibold mt-1">↑ +6% from last week</p>
        </div>

        <div className="wellness-card p-5 border-[#ebdff3]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#766585]">Completed Steps</span>
            <CheckCircle2 className="w-4 h-4 text-[#529b68]" />
          </div>
          <p className="text-2xl font-black text-[#351a42]">{totalCompleted}</p>
          <p className="text-[11px] text-[#766585] mt-1">Active weekly applications</p>
        </div>

        <div className="wellness-card p-5 border-[#ebdff3]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#766585]">Missed Steps</span>
            <XCircle className="w-4 h-4 text-[#e07a89]" />
          </div>
          <p className="text-2xl font-black text-[#351a42]">{totalMissed}</p>
          <p className="text-[11px] text-[#766585] mt-1">Primarily morning rush</p>
        </div>

        <div className="wellness-card p-5 border-[#ebdff3]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#766585]">Consistency Streak</span>
            <Flame className="w-4 h-4 text-[#e07a89] fill-[#fdf2f4]" />
          </div>
          <p className="text-2xl font-black text-[#351a42]">{streak} Days</p>
          <p className="text-[11px] text-[#7c469b] font-semibold mt-1">Keep it going!</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Adherence Curve (2 Cols) */}
        <div className="lg:col-span-2 wellness-card p-6 border-[#ebdff3]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[#351a42]">7-Day Adherence Trajectory</h3>
              <p className="text-xs text-[#766585]">Daily routine compliance percentage</p>
            </div>
            <span className="text-xs font-semibold text-[#7c469b] bg-[#f3eef8] px-2.5 py-1 rounded-full">
              Goal: 80%+
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adherenceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c469b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7c469b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebdff3" />
                <XAxis dataKey="day" stroke="#766585" fontSize={12} tickLine={false} />
                <YAxis stroke="#766585" fontSize={12} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #ebdff3',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value}%`, 'Adherence']}
                />
                <Area
                  type="monotone"
                  dataKey="adherence"
                  stroke="#7c469b"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#adherenceGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Completion Bar Chart */}
        <div className="wellness-card p-6 border-[#ebdff3]">
          <h3 className="text-base font-bold text-[#351a42]">Daily Tasks Done</h3>
          <p className="text-xs text-[#766585] mb-6">Steps completed each day</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebdff3" />
                <XAxis dataKey="day" stroke="#766585" fontSize={12} tickLine={false} />
                <YAxis stroke="#766585" fontSize={12} allowDecimals={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #ebdff3',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="completed" fill="#945bb7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Weekly Summaries Section */}
      <div className="wellness-card p-6 border-[#ebdff3] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#ebdff3]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#7c469b]" />
            <h3 className="text-base font-bold text-[#351a42]">Progress Tracking Agent Summaries</h3>
          </div>
          <span className="text-xs text-[#766585]">{summaries.length} Reviews Logged</span>
        </div>

        {summaries.length === 0 ? (
          <p className="text-xs text-[#766585] py-4 text-center">
            No weekly summaries logged yet. Click &quot;Complete Weekly Check-in&quot; above to generate your first AI review.
          </p>
        ) : (
          <div className="space-y-4">
            {summaries.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-2xl bg-[#faf7fc] border border-[#ebdff3] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7c469b] bg-white px-3 py-1 rounded-full border border-[#dec7ea]">
                    {s.week_label}
                  </span>
                  <span className="text-xs font-bold text-[#553267]">
                    Adherence Score: <strong className="text-[#7c469b]">{s.adherence_score}%</strong>
                  </span>
                </div>

                <p className="text-xs md:text-sm text-[#351a42] leading-relaxed">
                  {s.summary_text}
                </p>

                {s.recommendations && (
                  <div className="p-3.5 rounded-xl bg-white border border-[#ebdff3]">
                    <h5 className="text-xs font-bold uppercase text-[#7c469b] tracking-wider mb-1.5">
                      Agent Recommendations
                    </h5>
                    <div className="text-xs text-[#553267] whitespace-pre-line leading-relaxed">
                      {s.recommendations}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Check-In Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="wellness-card max-w-lg w-full p-6 md:p-8 bg-white border-[#ebdff3] shadow-elevated animate-scaleIn">
            <div className="flex items-center justify-between pb-4 border-b border-[#ebdff3]">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#7c469b]" />
                <h3 className="text-lg font-bold text-[#351a42]">Weekly Wellness Check-in</h3>
              </div>
              <button
                onClick={() => setShowCheckInModal(false)}
                className="text-sm font-bold text-[#766585] hover:text-[#351a42]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitCheckIn} className="py-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-[#351a42] block mb-1.5">
                  How is your target concern responding this week?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Improving', 'Stable', 'Needs Attention'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setCondition(opt)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                        condition === opt
                          ? 'bg-[#7c469b] text-white border-[#7c469b]'
                          : 'bg-[#faf7fc] text-[#553267] border-[#ebdff3] hover:bg-[#f3eef8]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#351a42] block mb-1.5">
                  How did your routine feel? (Observations, skips, or texture changes)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g., Felt great, serum absorbed quickly without any greasiness. Noticeably less shedding when combing."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#faf7fc] border border-[#ebdff3] text-xs text-[#351a42] focus:outline-none focus:border-[#7c469b]"
                />
              </div>

              <div className="pt-3 border-t border-[#ebdff3] flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#ebdff3] text-xs font-semibold text-[#766585]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !feedback.trim()}
                  className="px-4 py-2 rounded-xl bg-[#7c469b] hover:bg-[#673a7f] disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-soft"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Evaluating with AI...' : 'Submit & Analyze'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

