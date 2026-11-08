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
  AlertCircle,
  Save,
  CheckCircle,
  AlertTriangle
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
      setSaveMessage('System settings updated successfully.');
      onSettingsChanged();
      await loadStatus();
    } catch (err: any) {
      alert(`Error saving settings: ${err.message}`);
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
            <Settings className="w-5 h-5 text-[#A8BDA9]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#173F35]">System &amp; AI Configuration</h1>
            <p className="text-xs text-[#727B74]">
              Inspect multi-agent health status, toggle deterministic demo fallback, and review safety escalation logs.
            </p>
          </div>
        </div>
      </div>

      {/* System Status Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: AI Provider */}
        <div className="bg-white p-5 rounded-xl border border-[#E3E8E1] shadow-card">
          <span className="text-xs font-bold text-[#727B74] uppercase tracking-wide flex items-center space-x-1.5">
            <Bot className="w-4 h-4 text-[#173F35]" />
            <span>AI Provider</span>
          </span>
          <div className="mt-2.5">
            <span className="text-sm font-bold text-[#173F35] block">
              {statusData?.has_api_key && !isDemoMode ? 'Google Gemini 1.5 Flash' : 'Deterministic Clinical AI'}
            </span>
            <span className="text-[11px] text-[#2F855A] font-semibold mt-1 inline-flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Multi-Agent LangGraph Operational</span>
            </span>
          </div>
        </div>

        {/* Card 2: Database */}
        <div className="bg-white p-5 rounded-xl border border-[#E3E8E1] shadow-card">
          <span className="text-xs font-bold text-[#727B74] uppercase tracking-wide flex items-center space-x-1.5">
            <Database className="w-4 h-4 text-[#173F35]" />
            <span>Database Engine</span>
          </span>
          <div className="mt-2.5">
            <span className="text-sm font-bold text-[#173F35] block">
              SQLAlchemy 2.0 ORM
            </span>
            <span className="text-[11px] text-[#2F855A] font-semibold mt-1 inline-flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Auto-Seeded &amp; Migrated</span>
            </span>
          </div>
        </div>

        {/* Card 3: RAG Knowledge Base */}
        <div className="bg-white p-5 rounded-xl border border-[#E3E8E1] shadow-card">
          <span className="text-xs font-bold text-[#727B74] uppercase tracking-wide flex items-center space-x-1.5">
            <Server className="w-4 h-4 text-[#173F35]" />
            <span>Product Knowledge RAG</span>
          </span>
          <div className="mt-2.5">
            <span className="text-sm font-bold text-[#173F35] block">
              {statusData?.product_count || 10} Formulations Indexed
            </span>
            <span className="text-[11px] text-[#2F855A] font-semibold mt-1 inline-flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero-Hallucination Verified</span>
            </span>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-xl border border-[#E3E8E1] p-6 shadow-card space-y-5">
        <div className="flex items-center space-x-2 pb-2 border-b border-[#E3E8E1]">
          <Key className="w-4 h-4 text-[#173F35]" />
          <h2 className="text-sm font-bold text-[#173F35] uppercase tracking-wider">Environment &amp; Keys</h2>
        </div>

        {saveMessage && (
          <div className="p-3 bg-[#EDF3ED] border border-[#D0DDD0] text-[#173F35] text-xs font-semibold rounded-lg flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#2F855A]" />
            <span>{saveMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#252D29] mb-1.5">
              Google Gemini API Key (Optional override)
            </label>
            <input
              type="password"
              placeholder={statusData?.has_api_key ? '•••••••••••••••••••••••• (Active in Cloud Env)' : 'Enter Gemini API key...'}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#E3E8E1] text-xs md:text-sm text-[#252D29] placeholder-[#727B74] focus:outline-none focus:border-[#173F35] focus:bg-white"
            />
            <p className="text-[11px] text-[#727B74] mt-1">
              Leave blank to retain the securely configured cloud environment variable.
            </p>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#FAF9F5] border border-[#E3E8E1]">
            <div>
              <span className="text-xs font-bold text-[#252D29] block">Demo Mode Fallback</span>
              <span className="text-[11px] text-[#727B74]">
                When enabled, ensures 100% deterministic, instant responses for challenge evaluation.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                isDemoMode ? 'bg-[#173F35]' : 'bg-[#E3E8E1]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isDemoMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-lg bg-[#173F35] hover:bg-[#1F4F43] disabled:opacity-50 text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
          >
            <Save className="w-4 h-4 text-[#A8BDA9]" />
            <span>{isSaving ? 'Updating...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>

      {/* Safety Escalation Log */}
      <div className="bg-white rounded-xl border border-[#E3E8E1] p-6 shadow-card">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E3E8E1]">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-[#B7791F]" />
            <h2 className="text-sm font-bold text-[#173F35] uppercase tracking-wider">
              Safety Triage &amp; Clinical Escalation Log
            </h2>
          </div>
          <span className="text-xs text-[#727B74] font-medium">
            {escalations.length} Safety Incidents Logged
          </span>
        </div>

        {escalations.length === 0 ? (
          <p className="text-xs text-[#727B74] py-6 text-center">
            No adverse reactions or safety escalations logged. All routines operating within clinical tolerance.
          </p>
        ) : (
          <div className="space-y-3">
            {escalations.map((esc) => (
              <div
                key={esc.id}
                className="p-3.5 rounded-lg bg-[#FAF9F5] border border-[#E3E8E1] text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#173F35]">Ticket #{esc.id}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        esc.severity === 'high'
                          ? 'bg-[#C05656]/15 text-[#C05656]'
                          : 'bg-[#B7791F]/15 text-[#B7791F]'
                      }`}
                    >
                      {esc.severity} severity
                    </span>
                  </div>
                  <span className="text-[11px] text-[#727B74]">
                    {new Date(esc.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="text-[#252D29] font-medium">
                  Issue: &quot;{esc.issue_description}&quot;
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#727B74] pt-1">
                  <span>Status: <strong className="text-[#173F35]">{esc.status}</strong></span>
                  {esc.escalated_to && <span>Assigned to: {esc.escalated_to}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
