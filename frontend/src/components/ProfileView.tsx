'use client';

import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Save, 
  HelpCircle,
  Leaf
} from 'lucide-react';
import { apiSubmitOnboarding } from '@/lib/api';

interface ProfileViewProps {
  user: any;
  profile: any;
  onProfileUpdated: () => void;
  onNavigateOverview: () => void;
}

export default function ProfileView({
  user,
  profile,
  onProfileUpdated,
  onNavigateOverview,
}: ProfileViewProps) {
  const [ageRange, setAgeRange] = useState(profile?.age_range || '25-34');
  const [primaryConcern, setPrimaryConcern] = useState(profile?.primary_concern || 'Hair fall');
  const [secondaryConcerns, setSecondaryConcerns] = useState(profile?.secondary_concerns || 'Body acne, Pigmentation');
  const [currentProducts, setCurrentProducts] = useState(profile?.current_products || 'Mild shampoo, regular soap');
  const [routineFrequency, setRoutineFrequency] = useState(profile?.routine_frequency || 'daily');
  const [reminderTime, setReminderTime] = useState(profile?.reminder_time || '08:30 AM, 09:30 PM');
  const [preferences, setPreferences] = useState(profile?.preferences || 'Sensitive skin, fragrance-light');
  const [routineHabits, setRoutineHabits] = useState(profile?.routine_habits || 'Intermediate');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const concernsList = [
    'Hair fall',
    'Dandruff',
    'Hair growth',
    'Acne',
    'Pigmentation',
    'Dry skin',
    'Body acne',
    'Body care',
    'General maintenance',
  ];

  const ageRanges = ['Under 18', '18-24', '25-34', '35-44', '45+'];
  const habitLevels = ['Beginner (Need reminders)', 'Intermediate', 'Consistent (Habitual)'];
  const frequencies = ['daily', 'alternate days', 'weekdays only'];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await apiSubmitOnboarding({
        age_range: ageRange,
        primary_concern: primaryConcern,
        secondary_concerns: secondaryConcerns,
        current_products: currentProducts,
        routine_frequency: routineFrequency,
        reminder_time: reminderTime,
        preferences: preferences,
        routine_habits: routineHabits,
      });
      setSaveSuccess(true);
      onProfileUpdated();
      setTimeout(() => {
        onNavigateOverview();
      }, 1200);
    } catch (err: any) {
      alert(`Error updating profile: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E3E8E1] p-6 md:p-8 shadow-card">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-[#173F35] text-white flex items-center justify-center font-bold">
            <User className="w-5 h-5 text-[#A8BDA9]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#173F35]">
              {user?.name || 'Kavya Gada'}
            </h1>
            <p className="text-xs text-[#727B74]">{user?.email || 'kavya@bodywise.demo'}</p>
          </div>
        </div>
        <p className="text-xs text-[#727B74] mt-2.5 leading-relaxed">
          Your personal intake profile grounds the Personalisation and Routine Management Agents in tailoring recommendations and active schedules.
        </p>
      </div>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-[#EDF3ED] border border-[#D0DDD0] text-[#173F35] flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#2F855A]" />
          <span className="text-xs font-semibold">
            Profile updated successfully! Regenerating personal-care recommendations...
          </span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-[#E3E8E1] p-6 md:p-8 shadow-card space-y-6">
        {/* Section 1: Target Concerns */}
        <div>
          <div className="flex items-center space-x-2 pb-2 mb-4 border-b border-[#E3E8E1]">
            <Leaf className="w-4 h-4 text-[#173F35]" />
            <h2 className="text-sm font-bold text-[#173F35] uppercase tracking-wider">
              1. Primary &amp; Secondary Concerns
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#252D29] mb-2">
                Primary Personal-Care Concern *
              </label>
              <div className="flex flex-wrap gap-2">
                {concernsList.map((con) => (
                  <button
                    type="button"
                    key={con}
                    onClick={() => setPrimaryConcern(con)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      primaryConcern === con
                        ? 'bg-[#173F35] text-white shadow-sm font-semibold'
                        : 'bg-[#FAF9F5] text-[#727B74] hover:bg-[#EDF3ED] border border-[#E3E8E1]'
                    }`}
                  >
                    {con}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#252D29] mb-1.5">
                Secondary Concerns (Comma separated)
              </label>
              <input
                type="text"
                value={secondaryConcerns}
                onChange={(e) => setSecondaryConcerns(e.target.value)}
                placeholder="e.g. Dandruff, Pigmentation, Dryness"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#E3E8E1] text-xs md:text-sm text-[#252D29] focus:outline-none focus:border-[#173F35] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Demographics & Habits */}
        <div>
          <div className="flex items-center space-x-2 pb-2 mb-4 border-b border-[#E3E8E1]">
            <Calendar className="w-4 h-4 text-[#173F35]" />
            <h2 className="text-sm font-bold text-[#173F35] uppercase tracking-wider">
              2. Profile &amp; Habit Consistency
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#252D29] mb-2">
                Age Range
              </label>
              <div className="flex flex-wrap gap-2">
                {ageRanges.map((ar) => (
                  <button
                    type="button"
                    key={ar}
                    onClick={() => setAgeRange(ar)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      ageRange === ar
                        ? 'bg-[#173F35] text-white font-semibold'
                        : 'bg-[#FAF9F5] text-[#727B74] border border-[#E3E8E1]'
                    }`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#252D29] mb-2">
                Routine Frequency
              </label>
              <div className="flex flex-wrap gap-2">
                {frequencies.map((freq) => (
                  <button
                    type="button"
                    key={freq}
                    onClick={() => setRoutineFrequency(freq)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                      routineFrequency === freq
                        ? 'bg-[#173F35] text-white font-semibold'
                        : 'bg-[#FAF9F5] text-[#727B74] border border-[#E3E8E1]'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-[#252D29] mb-2">
              Habit Consistency Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {habitLevels.map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setRoutineHabits(lvl)}
                  className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
                    routineHabits === lvl
                      ? 'bg-[#173F35] text-white border-[#173F35]'
                      : 'bg-[#FAF9F5] text-[#727B74] border-[#E3E8E1] hover:bg-[#EDF3ED]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Regimen Preferences & Reminders */}
        <div>
          <div className="flex items-center space-x-2 pb-2 mb-4 border-b border-[#E3E8E1]">
            <Clock className="w-4 h-4 text-[#173F35]" />
            <h2 className="text-sm font-bold text-[#173F35] uppercase tracking-wider">
              3. Current Regimen &amp; Reminder Times
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#252D29] mb-1.5">
                Current Products in Use
              </label>
              <input
                type="text"
                value={currentProducts}
                onChange={(e) => setCurrentProducts(e.target.value)}
                placeholder="e.g. Mild shampoo, gentle cleanser, sunscreen"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#E3E8E1] text-xs md:text-sm text-[#252D29] focus:outline-none focus:border-[#173F35] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#252D29] mb-1.5">
                  Scheduled Reminder Times
                </label>
                <input
                  type="text"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  placeholder="08:30 AM, 09:30 PM"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#E3E8E1] text-xs md:text-sm text-[#252D29] focus:outline-none focus:border-[#173F35] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252D29] mb-1.5">
                  Skin &amp; Formulation Preferences
                </label>
                <input
                  type="text"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="e.g. Lightweight, fragrance-free, sensitive skin"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#E3E8E1] text-xs md:text-sm text-[#252D29] focus:outline-none focus:border-[#173F35] focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-[#E3E8E1] flex items-center justify-between">
          <p className="text-[11px] text-[#727B74]">
            Changes trigger active routine recalibration through our Personalisation Agent.
          </p>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg bg-[#173F35] hover:bg-[#1F4F43] disabled:opacity-50 text-white text-xs md:text-sm font-semibold flex items-center space-x-2 transition-all shadow-sm"
          >
            <Save className="w-4 h-4 text-[#A8BDA9]" />
            <span>{isSaving ? 'Saving Profile...' : 'Save & Calibrate Routine'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
