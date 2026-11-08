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
  Trash2,
  Check
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
  const [selectedDay, setSelectedDay] = useState('Today');
  const [showReminderModal, setShowReminderModal] = useState(false);

  const daysOfWeek = [
    { label: 'Mon', active: true },
    { label: 'Tue', active: true },
    { label: 'Wed', active: true },
    { label: 'Thu', active: true },
    { label: 'Fri', active: true },
    { label: 'Sat', active: true },
    { label: 'Sun', active: true },
  ];

  const morningTasks = tasks.filter((t) => t.time_of_day === 'morning');
  const eveningTasks = tasks.filter((t) => t.time_of_day === 'evening' || t.time_of_day === 'night');
  const otherTasks = tasks.filter((t) => t.time_of_day !== 'morning' && t.time_of_day !== 'evening' && t.time_of_day !== 'night');

  const completedCount = tasks.filter((t) => t.is_completed_today).length;
  const adherence = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Controls */}
      <div className="wellness-card p-6 md:p-8 border-[#ebdff3] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="px-3 py-1 rounded-full bg-[#f3eef8] text-[#7c469b] text-xs font-bold border border-[#dec7ea]">
              Active Regimen
            </span>
            <span className="text-xs text-[#766585]">Updated Today</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#351a42]">
            {routine?.name || 'Personalized Personal-Care Regimen'}
          </h1>
          <p className="text-sm text-[#766585] mt-1 max-w-2xl">
            {routine?.goal || 'Consistent step-by-step guidance for long-term skin and hair health.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowReminderModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#faf7fc] text-[#553267] text-xs font-semibold border border-[#ebdff3] flex items-center space-x-2 transition-all shadow-sm"
          >
            <Bell className="w-4 h-4 text-[#7c469b]" />
            <span>Reminders</span>
          </button>

          <button
            onClick={() => onAskAI('Can we optimize or modify my current routine?')}
            className="px-4 py-2.5 rounded-xl bg-[#7c469b] hover:bg-[#673a7f] text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-soft"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Routine Assistant</span>
          </button>
        </div>
      </div>

      {/* Weekly Calendar Ribbon */}
      <div className="wellness-card p-5 border-[#ebdff3]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#7c469b]" />
            <h3 className="text-sm font-bold text-[#351a42]">Weekly Calendar Schedule</h3>
          </div>
          <span className="text-xs font-medium text-[#766585]">
            Today&apos;s Adherence: <strong className="text-[#7c469b]">{adherence}%</strong>
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day, idx) => {
            const isToday = idx === 6; // current day in demo
            return (
              <div
                key={day.label}
                className={`p-3 rounded-2xl text-center border transition-all ${
                  isToday
                    ? 'bg-[#7c469b] text-white border-[#7c469b] shadow-soft'
                    : 'bg-[#faf7fc] text-[#553267] border-[#ebdff3]'
                }`}
              >
                <p className="text-[11px] font-medium opacity-80">{day.label}</p>
                <p className="text-base font-bold my-0.5">{2 + idx}</p>
                <div className="flex justify-center mt-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isToday ? 'bg-white' : 'bg-[#529b68]'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedules: Morning & Evening */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Morning Routine */}
        <div className="wellness-card p-6 border-[#ebdff3] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ebdff3]">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#faf7fc] text-[#945bb7] flex items-center justify-center border border-[#dec7ea]">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#351a42]">Morning Routine</h3>
                <p className="text-xs text-[#766585]">Cleanse, Nourish &amp; Protect</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f3eef8] text-[#7c469b]">
              {morningTasks.filter((t) => t.is_completed_today).length}/{morningTasks.length} Done
            </span>
          </div>

          {morningTasks.length === 0 ? (
            <p className="text-xs text-[#766585] py-4 text-center">No morning steps scheduled.</p>
          ) : (
            <div className="space-y-3">
              {morningTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    task.is_completed_today
                      ? 'bg-[#faf7fc] border-[#dec7ea]'
                      : 'bg-white border-[#ebdff3] hover:border-[#c8a4dc]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => onToggleTask(task.id, task.is_completed_today)}
                        className="mt-0.5 flex-shrink-0"
                      >
                        {task.is_completed_today ? (
                          <CheckCircle2 className="w-5 h-5 text-[#7c469b] fill-[#f3eef8]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#dec7ea] hover:text-[#ae7ecc]" />
                        )}
                      </button>
                      <div>
                        <h4
                          className={`text-sm font-semibold ${
                            task.is_completed_today
                              ? 'text-[#766585] line-through'
                              : 'text-[#351a42]'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <p className="text-xs text-[#766585] mt-1 leading-relaxed">
                          {task.description}
                        </p>
                        {task.product_name && (
                          <div className="mt-2 inline-flex items-center space-x-1 text-[11px] font-medium text-[#7c469b] bg-[#f3eef8] px-2 py-0.5 rounded border border-[#dec7ea]">
                            <span>{task.product_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[#766585] bg-[#fbf9fe] px-2 py-1 rounded-lg flex items-center space-x-1 flex-shrink-0">
                      <Clock className="w-3 h-3 text-[#7c469b]" />
                      <span>{task.scheduled_time}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Evening Routine */}
        <div className="wellness-card p-6 border-[#ebdff3] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ebdff3]">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#351a42] text-white flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#351a42]">Evening Routine</h3>
                <p className="text-xs text-[#766585]">Repair &amp; Cellular Activation</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f3eef8] text-[#7c469b]">
              {eveningTasks.filter((t) => t.is_completed_today).length}/{eveningTasks.length} Done
            </span>
          </div>

          {eveningTasks.length === 0 ? (
            <p className="text-xs text-[#766585] py-4 text-center">No evening steps scheduled.</p>
          ) : (
            <div className="space-y-3">
              {eveningTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    task.is_completed_today
                      ? 'bg-[#faf7fc] border-[#dec7ea]'
                      : 'bg-white border-[#ebdff3] hover:border-[#c8a4dc]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => onToggleTask(task.id, task.is_completed_today)}
                        className="mt-0.5 flex-shrink-0"
                      >
                        {task.is_completed_today ? (
                          <CheckCircle2 className="w-5 h-5 text-[#7c469b] fill-[#f3eef8]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#dec7ea] hover:text-[#ae7ecc]" />
                        )}
                      </button>
                      <div>
                        <h4
                          className={`text-sm font-semibold ${
                            task.is_completed_today
                              ? 'text-[#766585] line-through'
                              : 'text-[#351a42]'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <p className="text-xs text-[#766585] mt-1 leading-relaxed">
                          {task.description}
                        </p>
                        {task.product_name && (
                          <div className="mt-2 inline-flex items-center space-x-1 text-[11px] font-medium text-[#7c469b] bg-[#f3eef8] px-2 py-0.5 rounded border border-[#dec7ea]">
                            <span>{task.product_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[#766585] bg-[#fbf9fe] px-2 py-1 rounded-lg flex items-center space-x-1 flex-shrink-0">
                      <Clock className="w-3 h-3 text-[#7c469b]" />
                      <span>{task.scheduled_time}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Missed Routine Recovery Guidance */}
      <div className="wellness-card p-5 bg-[#faf7fc] border-[#dec7ea] flex items-start space-x-3.5">
        <AlertCircle className="w-5 h-5 text-[#7c469b] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-bold text-[#351a42]">What should I do if I missed a routine session?</h4>
          <p className="text-xs text-[#766585] mt-1 leading-relaxed">
            Never double up on active serums or exfoliating cleansers. Simply resume your next scheduled step normally.
            Consistent regular application over 8-12 weeks matters far more than a single missed session.
          </p>
        </div>
        <button
          onClick={() => onAskAI('What should I do if I missed my hair serum last night?')}
          className="text-xs font-semibold text-[#7c469b] hover:underline flex-shrink-0"
        >
          Ask Companion →
        </button>
      </div>

      {/* Reminder Settings Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="wellness-card max-w-md w-full p-6 bg-white border-[#ebdff3] shadow-elevated animate-scaleIn">
            <div className="flex items-center justify-between pb-4 border-b border-[#ebdff3]">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-[#7c469b]" />
                <h3 className="text-base font-bold text-[#351a42]">Routine Reminders</h3>
              </div>
              <button
                onClick={() => setShowReminderModal(false)}
                className="text-xs font-bold text-[#766585] hover:text-[#351a42] p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#faf7fc] border border-[#ebdff3]"
                >
                  <div>
                    <h5 className="text-sm font-semibold text-[#351a42]">{rem.title}</h5>
                    <p className="text-xs text-[#766585] flex items-center space-x-1 mt-0.5">
                      <Clock className="w-3 h-3 text-[#945bb7]" />
                      <span>{rem.scheduled_time} ({rem.time_of_day})</span>
                    </p>
                  </div>
                  <button
                    onClick={() => onToggleReminder(rem.id)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      rem.is_enabled ? 'bg-[#7c469b]' : 'bg-[#dec7ea]'
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

            <div className="pt-3 border-t border-[#ebdff3] flex justify-end">
              <button
                onClick={() => setShowReminderModal(false)}
                className="px-4 py-2 rounded-xl bg-[#7c469b] text-white text-xs font-semibold hover:bg-[#673a7f]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

