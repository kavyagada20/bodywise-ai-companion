'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Key, 
  ShieldCheck, 
  Database, 
  Bot, 
  Server, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { apiGetSettingsStatus, apiUpdateSettings, apiGetEscalations } from '@/lib/api';

interface SettingsViewProps {
  demoMode: boolean;
  onSettingsChanged: () => void;
}

export default function SettingsView({
  demoMode,
  onSettingsChanged,
}: SettingsViewProps) {
  const [statusData, setStatusData] = useState<any>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(demoMode);
  const [escalations, setEscalations] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadStatus();
    loadEscalations();
  }, []);

  const loadStatus = async () => {
    try {
      const data = await apiGetSettingsStatus();
      setStatusData(data);
      setIsDemoMode(data.demo_mode);
    } catch (err) {
      console.error(err);
    }
  };

  const loadEscalations = async () => {
    try {
      const data = await apiGetEscalations();
      setEscalations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      await apiUpdateSettings({
        gemini_api_key: apiKeyInput ? apiKeyInput.trim() : undefined,
        demo_mode: isDemoMode,
      });
      setSaveMessage('Settings saved successfully!');
      onSettingsChanged();
      await loadStatus();
    } catch (err: any) {
      alert(`Error saving settings: ${err.message}`);
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
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#351a42]">System &amp; AI Configuration</h1>
            <p className="text-xs text-[#766585]">
              Configure Gemini LLM provider, Demo Mode fallback, and inspect agent architecture.
            </p>
          </div>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="wellness-card p-5 border-[#ebdff3]">
          <span className="text-xs font-semibold text-[#766585] flex items-center space-x-1.5">
            <Bot className="w-4 h-4 text-[#7c469b]" />
            <span>AI Provider</span>
          </span>
          <p className="text-sm font-bold text-[#351a42] mt-2">
            {statusData?.active_llm_provider || 'Deterministic Verified AI'}
          </p>
          <span className="inline-block mt-1 text-[10px] font-semibold text-[#529b68]">
            ● Operational
          </span>
        </div>

        <div className="wellness-card p-5 border-[#ebdff3]">
          <span className="text-xs font-semibold text-[#766585] flex items-center space-x-1.5">
            <Database className="w-4 h-4 text-[#7c469b]" />
            <span>Persistent Database</span>
          </span>
          <p className="text-sm font-bold text-[#351a42] mt-2">
            {statusData?.database || 'SQLite (Local)'}
          </p>
          <span className="inline-block mt-1 text-[10px] font-semibold text-[#766585]">
            PostgreSQL Compatible
          </span>
        </div>

        <div className="wellness-card p-5 border-[#ebdff3]">
          <span className="text-xs font-semibold text-[#766585] flex items-center space-x-1.5">
            <Server className="w-4 h-4 text-[#7c469b]" />
            <span>Product Knowledge Base</span>
          </span>
          <p className="text-sm font-bold text-[#351a42] mt-2">
            {statusData?.product_count || 10} Formulations
          </p>
          <span className="inline-block mt-1 text-[10px] font-semibold text-[#529b68]">
            RAG Vector Indexed
          </span>
        </div>
      </div>

      {/* AI & Environment Settings Form */}
      <form onSubmit={handleSaveSettings} className="wellness-card p-6 md:p-8 border-[#ebdff3] space-y-6">
        <div className="pb-4 border-b border-[#ebdff3]">
          <h2 className="text-lg font-bold text-[#351a42]">AI Model &amp; Execution Mode</h2>
          <p className="text-xs text-[#766585] mt-0.5">
            The application functions completely deterministically in Demo Mode without requiring any external keys.
          </p>
        </div>

        {/* Demo Mode Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#faf7fc] border border-[#ebdff3]">
          <div>
            <h4 className="text-sm font-bold text-[#351a42]">Demonstration Mode</h4>
            <p className="text-xs text-[#766585] mt-0.5">
              When enabled, all multi-agent workflows use verified deterministic responses and RAG vectors with zero external API dependencies.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors ${
              isDemoMode ? 'bg-[#7c469b]' : 'bg-[#dec7ea]'
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                isDemoMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Gemini API Key */}
        <div>
          <label className="text-xs font-bold text-[#351a42] block mb-1.5">
            Gemini API Key (Optional)
          </label>
          <div className="relative">
            <Key className="w-4 h-4 text-[#766585] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder={statusData?.has_api_key ? '••••••••••••••••••••••••' : 'Enter AI Studio Gemini API Key...'}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#faf7fc] border border-[#ebdff3] text-xs md:text-sm text-[#351a42] focus:outline-none focus:border-[#7c469b]"
            />
          </div>
          <p className="text-[11px] text-[#766585] mt-1.5">
            Provide a Google Gemini API key to enable live LLM grounded synthesis. Leave blank to run entirely in reliable demo mode.
          </p>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-[#ebdff3] flex items-center justify-between">
          {saveMessage && (
            <span className="text-xs font-bold text-[#529b68] flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveMessage}</span>
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="ml-auto px-6 py-2.5 rounded-xl bg-[#7c469b] hover:bg-[#673a7f] disabled:opacity-50 text-white text-xs md:text-sm font-bold flex items-center space-x-2 transition-all shadow-soft"
          >
            <span>{isSaving ? 'Updating...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>

      {/* Safety Escalation History */}
      <div className="wellness-card p-6 md:p-8 border-[#ebdff3] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#ebdff3]">
          <div>
            <h3 className="text-base font-bold text-[#351a42]">Safety Escalation Ticket Log</h3>
            <p className="text-xs text-[#766585]">
              Tickets created automatically by the Customer Support and Escalation Agent
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#fdf2f4] text-[#e07a89] border border-[#e07a89]/20">
            {escalations.length} Escalations Logged
          </span>
        </div>

        {escalations.length === 0 ? (
          <p className="text-xs text-[#766585] py-4 text-center">
            No safety incidents logged. If a customer reports adverse burning or allergic symptoms, the safety agent automatically creates an escalation ticket.
          </p>
        ) : (
          <div className="space-y-3">
            {escalations.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 rounded-xl bg-[#faf7fc] border border-[#ebdff3] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#7c469b] bg-white px-2 py-0.5 rounded border border-[#ebdff3]">
                      #{ticket.ticket_id}
                    </span>
                    <span className="text-xs font-bold text-[#e07a89]">
                      {ticket.reason}
                    </span>
                  </div>
                  <p className="text-xs text-[#553267] line-clamp-2">{ticket.summary}</p>
                </div>
                <span className="text-[11px] font-semibold text-[#529b68] bg-[#f1f8f3] px-2.5 py-1 rounded-full border border-[#529b68]/20 whitespace-nowrap self-start sm:self-center">
                  Assigned to Human Expert
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

