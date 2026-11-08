'use client';

import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Bell, 
  Sparkles, 
  Sun, 
  Moon, 
  Calendar,
  AlertCircle,
  HelpCircle,
  Check,
  X
} from 'lucide-react';

interface RoutineViewProps {
  routine: any;
  tasks: any[];
  reminders: any[];
  onToggleTask: (taskId: number, currentCompleted: boolean) => void;
  onToggleReminder: (reminderId: number) => void;
  onAskAI: (prompt: string) => void;
  onRefresh: () => void;
}

export default function RoutineView({
  routine,
  tasks,
  reminders,
  onToggleTask,
  onToggleReminder,
  onAskAI,
  onRefresh,
}: RoutineViewProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(6); // Today (Sunday)
  const [showReminderModal, setShowReminderModal] = useState(false);

  const daysOfWeek = [
    { label: 'Mon', date: '2', active: true },
    { label: 'Tue', date: '3', active: true },
    { label: 'Wed', date: '4', active: true },
    { label: 'Thu', date: '5', active: true },
    { label: 'Fri', date: '6', active: true },
    { label: 'Sat', date: '7', active: true },
    { label: 'Sun', date: '8', active: true, isToday: true },
  ];

  const morningTasks = tasks.filter((t) => t.time_of_day === 'morning');
  const eveningTasks = tasks.filter((t) => t.time_of_day === 'evening' || t.time_of_day === 'night');
  const completedCount = tasks.filter((t) => t.is_completed_today).length;
  const adherence = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl border border-[#E3E8E1] p-6 md:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="px-3 py-1 rounded-full bg-[#EDF3ED] text-[#173F35] text-xs font-bold border border-[#D0DDD0]">
              Active Regimen
            </span>
            <span className="text-xs text-[#727B74]">Synchronized with Profile</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#173F35]">
            {routine?.name || 'Personalized Personal-Care Regimen'}
          </h1>
          <p className="text-sm text-[#727B74] mt-1 max-w-2xl leading-relaxed">
            {routine?.goal || 'Consistent step-by-step guidance for long-term skin and hair health.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowReminderModal(true)}
            className="px-4 py-2 rounded-lg bg-white hover:bg-[#FAF9F5] text-[#252D29] text-xs font-semibold border border-[#E3E8E1] flex items-center space-x-2 transition-all shadow-sm"
          >
            <Bell className="w-4 h-4 text-[#477C68]" />
            <span>Reminders</span>
          </button>

          <button
            onClick={() => onAskAI('Can we optimize or modify my current routine?')}
            className="px-4 py-2 rounded-lg bg-[#173F35] hover:bg-[#1F4F43] text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#A8BDA9]" />
            <span>AI Routine Assistant</span>
          </button>
        </div>
      </div>

      {/* Weekly Calendar Ribbon */}
      <div className="bg-white rounded-xl border border-[#E3E8E1] p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#173F35]" />
            <span className="text-xs font-bold text-[#173F35] uppercase tracking-wider">Weekly Schedule</span>
          </div>
          <span className="text-xs font-semibold text-[#727B74]">
            Today&apos;s Adherence: <span className="text-[#173F35] font-bold">{adherence}%</span>
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={day.label}
                onClick={() => setSelectedDayIndex(idx)}
                className={`py-3 px-2 rounded-lg text-center transition-all ${
                  isSelected
                    ? 'bg-[#173F35] text-white shadow-sm font-semibold'
                    : 'bg-[#FAF9F5] text-[#727B74] hover:bg-[#EDF3ED] border border-[#E3E8E1]'
                }`}
              >
                <p className="text-[11px] font-medium opacity-90">{day.label}</p>
                <p className="text-base font-bold mt-0.5">{day.date}</p>
                <div className="mt-1 flex justify-center">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-[#477C68]'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Regimen Tasks: Morning and Evening Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Morning Column */}
        <div className="bg-white rounded-xl border border-[#E3E8E1] p-6 shadow-card">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E3E8E1]">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FAF9F5] border border-[#E3E8E1] flex items-center justify-center">
                <Sun className="w-4 h-4 text-[#B7791F]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#173F35]">Morning Routine</h3>
                <p className="text-[11px] text-[#727B74]">Cleanse, Nourish &amp; Protect</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EDF3ED] text-[#173F35]">
              {morningTasks.filter((t) => t.is_completed_today).length}/{morningTasks.length} Done
            </span>
          </div>

          {morningTasks.length === 0 ? (
            <p className="text-xs text-[#727B74] py-8 text-center">No morning steps scheduled.</p>
          ) : (
            <div className="space-y-3">
              {morningTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    task.is_completed_today
                      ? 'bg-[#EDF3ED]/40 border-[#D0DDD0]'
                      : 'bg-[#FAF9F5] border-[#E3E8E1] hover:border-[#A8BDA9]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => onToggleTask(task.id, task.is_completed_today)}
                        className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
                      >
                        {task.is_completed_today ? (
                          <CheckCircle2 className="w-5 h-5 text-[#2F855A] fill-[#EDF3ED]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#D0DDD0] hover:text-[#477C68]" />
                        )}
                      </button>
                      <div>
                        <h4
                          className={`text-sm font-semibold ${
                            task.is_completed_today ? 'text-[#727B74] line-through' : 'text-[#252D29]'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <p className="text-xs text-[#727B74] mt-1 leading-relaxed">
                          {task.description}
                        </p>
                        {task.product_name && (
                          <span className="inline-block mt-2 text-[11px] font-medium text-[#173F35] bg-white px-2 py-0.5 rounded border border-[#E3E8E1]">
                            {task.product_name}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-[#727B74] bg-white px-2 py-1 rounded-md border border-[#E3E8E1] flex-shrink-0">
                      {task.scheduled_time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Evening Column */}
        <div className="bg-white rounded-xl border border-[#E3E8E1] p-6 shadow-card">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E3E8E1]">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FAF9F5] border border-[#E3E8E1] flex items-center justify-center">
                <Moon className="w-4 h-4 text-[#477C91]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#173F35]">Evening Routine</h3>
                <p className="text-[11px] text-[#727B74]">Repair &amp; Cellular Activation</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EDF3ED] text-[#173F35]">
              {eveningTasks.filter((t) => t.is_completed_today).length}/{eveningTasks.length} Done
            </span>
          </div>

          {eveningTasks.length === 0 ? (
            <p className="text-xs text-[#727B74] py-8 text-center">No evening steps scheduled.</p>
          ) : (
            <div className="space-y-3">
              {eveningTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    task.is_completed_today
                      ? 'bg-[#EDF3ED]/40 border-[#D0DDD0]'
                      : 'bg-[#FAF9F5] border-[#E3E8E1] hover:border-[#A8BDA9]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => onToggleTask(task.id, task.is_completed_today)}
                        className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
                      >
                        {task.is_completed_today ? (
                          <CheckCircle2 className="w-5 h-5 text-[#2F855A] fill-[#EDF3ED]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#D0DDD0] hover:text-[#477C68]" />
                        )}
                      </button>
                      <div>
                        <h4
                          className={`text-sm font-semibold ${
                            task.is_completed_today ? 'text-[#727B74] line-through' : 'text-[#252D29]'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <p className="text-xs text-[#727B74] mt-1 leading-relaxed">
                          {task.description}
                        </p>
                        {task.product_name && (
                          <span className="inline-block mt-2 text-[11px] font-medium text-[#173F35] bg-white px-2 py-0.5 rounded border border-[#E3E8E1]">
                            {task.product_name}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-[#727B74] bg-white px-2 py-1 rounded-md border border-[#E3E8E1] flex-shrink-0">
                      {task.scheduled_time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Missed Routine & Advice Card */}
      <div className="bg-[#FAF9F5] rounded-xl border border-[#E3E8E1] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-[#B7791F] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-[#173F35] uppercase tracking-wide">Missed a Scheduled Step?</h4>
            <p className="text-xs text-[#727B74] mt-0.5">
              Never double up on concentrated actives. Our clinical agent advises continuing normally with your next scheduled application.
            </p>
          </div>
        </div>
        <button
          onClick={() => onAskAI('What should I do if I forgot my routine step yesterday?')}
          className="text-xs font-semibold text-[#173F35] hover:text-[#477C68] whitespace-nowrap self-end sm:self-auto"
        >
          Ask Companion For Guidance →
        </button>
      </div>

      {/* Reminders Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E3E8E1] shadow-card max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E3E8E1]">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-[#173F35]" />
                <h3 className="text-base font-bold text-[#173F35]">Routine Notifications</h3>
              </div>
              <button
                onClick={() => setShowReminderModal(false)}
                className="text-[#727B74] hover:text-[#173F35]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#727B74] mb-4">
              Toggle morning and evening notification triggers to sustain your daily routine consistency.
            </p>

            <div className="space-y-3">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-[#FAF9F5] border border-[#E3E8E1]"
                >
                  <div>
                    <h5 className="text-xs font-bold text-[#252D29]">{rem.title}</h5>
                    <p className="text-[11px] text-[#727B74]">{rem.scheduled_time} ({rem.time_of_day})</p>
                  </div>
                  <button
                    onClick={() => onToggleReminder(rem.id)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      rem.is_enabled ? 'bg-[#173F35]' : 'bg-[#E3E8E1]'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        rem.is_enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E3E8E1] flex justify-end">
              <button
                onClick={() => setShowReminderModal(false)}
                className="px-4 py-2 rounded-lg bg-[#173F35] text-white text-xs font-semibold hover:bg-[#1F4F43]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
