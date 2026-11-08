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
  HeartHandshake
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
      }, 1000);
    } catch (err: any) {
      alert(`Error updating profile: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="wellness-card p-6 md:p-8 border-[#ebdff3] bg-gradient-to-br from-[#faf7fc] to-white">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-[#7c469b] text-white flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#351a42]">
              {user?.name || 'Kavya Gada'}
            </h1>
            <p className="text-xs text-[#766585]">{user?.email || 'kavya@bodywise.demo'}</p>
          </div>
        </div>
        <p className="text-xs text-[#766585] mt-3 leading-relaxed">
          Your personal care profile guides the Personalisation and Routine Management Agents in tailoring recommendations and scheduling.
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="wellness-card p-6 md:p-8 border-[#ebdff3] space-y-6">
        <div className="pb-4 border-b border-[#ebdff3] flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#351a42]">Personalisation Settings</h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f3eef8] text-[#7c469b]">
            Interactive Onboarding
          </span>
        </div>

        {/* 1. Primary Concern */}
        <div>
          <label className="text-xs font-bold text-[#351a42] block mb-2">
            1. Primary Personal-Care Concern *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {concernsList.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setPrimaryConcern(c)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left ${
                  primaryConcern === c
                    ? 'bg-[#7c469b] text-white border-[#7c469b] shadow-soft'
                    : 'bg-[#faf7fc] text-[#553267] border-[#ebdff3] hover:bg-[#f3eef8]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Age Range & Routine Frequency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#351a42] block mb-1.5">
              2. Age Range
            </label>
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#faf7fc] border border-[#ebdff3] text-xs text-[#351a42] focus:outline-none focus:border-[#7c469b]"
            >
              <option value="18-24">18 - 24 years</option>
              <option value="25-34">25 - 34 years</option>
              <option value="35-44">35 - 44 years</option>
              <option value="45+">45+ years</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#351a42] block mb-1.5">
              3. Routine Frequency
            </label>
            <select
              value={routineFrequency}
              onChange={(e) => setRoutineFrequency(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#faf7fc] border border-[#ebdff3] text-xs text-[#351a42] focus:outline-none focus:border-[#7c469b]"
            >
              <option value="daily">Daily Morning &amp; Night</option>
              <option value="alternate_days">Alternate Days (Mon / Wed / Fri)</option>
              <option value="flexible">Flexible as needed</option>
            </select>
          </div>
        </div>

        {/* 4. Secondary Concerns */}
        <div>
          <label className="text-xs font-bold text-[#351a42] block mb-1.5">
            4. Secondary Concerns (Optional)
          </label>
          <input
            type="text"
            value={secondaryConcerns}
            onChange={(e) => setSecondaryConcerns(e.target.value)}
            placeholder="e.g. Body acne, Pigmentation, Underarm tone"
            className="w-full p-2.5 rounded-xl bg-[#faf7fc] border border-[#ebdff3] text-xs text-[#351a42] focus:outline-none focus:border-[#7c469b]"
          />
        </div>

        {/* 5. Current Products Used */}
        <div>
          <label className="text-xs font-bold text-[#351a42] block mb-1.5">
            5. Current Products in Use
          </label>
          <input
            type="text"
            value={currentProducts}
            onChange={(e) => setCurrentProducts(e.target.value)}
            placeholder="e.g. Gentle shampoo, hydrating moisturizer, sunscreen"
            className="w-full p-2.5 rounded-xl bg-[#faf7fc] border border-[#ebdff3] text-xs text-[#351a42] focus:outline-none focus:border-[#7c469b]"
          />
        </div>

        {/* 6. Habits & Reminder Times */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#351a42] block mb-1.5">
              6. Routine Habit Consistency
            </label>
            <select
              value={routineHabits}
              onChange={(e) => setRoutineHabits(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#faf7fc] border border-[#ebdff3] text-xs text-[#351a42] focus:outline-none focus:border-[#7c469b]"
            >
              <option value="Beginner">Beginner (Need simple 2-step routine)</option>
              <option value="Intermediate">Intermediate (Comfortable with 3-4 steps)</option>
              <option value="Consistent">Consistent (Experienced personal-care follower)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#351a42] block mb-1.5">
              7. Preferred Reminder Times
            </label>
            <input
              type="text"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              placeholder="e.g. 08:30 AM, 09:30 PM"
              className="w-full p-2.5 rounded-xl bg-[#faf7fc] border border-[#ebdff3] text-xs text-[#351a42] focus:outline-none focus:border-[#7c469b]"
            />
          </div>
        </div>

        {/* 8. Skin/Hair Preferences */}
        <div>
          <label className="text-xs font-bold text-[#351a42] block mb-1.5">
            8. Skin &amp; Hair Preferences
          </label>
          <input
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="e.g. Sensitive skin, fragrance-light, non-greasy textures"
            className="w-full p-2.5 rounded-xl bg-[#faf7fc] border border-[#ebdff3] text-xs text-[#351a42] focus:outline-none focus:border-[#7c469b]"
          />
        </div>

        {/* Transparency Alert */}
        <div className="p-4 rounded-xl bg-[#f1f8f3] border border-[#529b68]/20 flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-[#529b68] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#553267] leading-relaxed">
            Your preferences are strictly stored in your local session and used to personalize routine recommendations and dosage frequencies. We never collect sensitive personal identification.
          </p>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-[#ebdff3] flex items-center justify-between">
          {saveSuccess && (
            <span className="text-xs font-bold text-[#529b68] flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Preferences saved! Updating your personalized routine...</span>
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="ml-auto px-6 py-2.5 rounded-xl bg-[#7c469b] hover:bg-[#673a7f] disabled:opacity-50 text-white text-xs md:text-sm font-bold flex items-center space-x-2 transition-all shadow-soft"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save & Regenerate Routine'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

