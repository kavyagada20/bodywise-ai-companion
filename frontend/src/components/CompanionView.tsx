'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Clock, 
  RefreshCw, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  User,
  ArrowRight,
  Info,
  CalendarCheck
} from 'lucide-react';
import { apiChatWithCompanion, apiApproveAction, apiResetConversation } from '@/lib/api';

interface CompanionViewProps {
  conversation: any;
  user: any;
  onRoutineUpdated: () => void;
  initialPrompt?: string;
}

export default function CompanionView({
  conversation,
  user,
  onRoutineUpdated,
  initialPrompt,
}: CompanionViewProps) {
  const [messages, setMessages] = useState<any[]>(conversation?.messages || []);
  const [inputText, setInputText] = useState(initialPrompt || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedTraceId, setExpandedTraceId] = useState<number | null>(null);
  const [approvingAction, setApprovingAction] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Help me create a hair-care routine',
    'Explain how Salicylic Acid works',
    'Show me today\'s routine',
    'I missed yesterday\'s routine. What should I do?',
    'Summarise my weekly progress',
    'Help me understand the ingredients in Redensyl serum',
  ];

  useEffect(() => {
    if (conversation?.messages) {
      setMessages(conversation.messages);
    }
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSubmitting]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSubmitting) return;

    setInputText('');
    const tempUserMsg = {
      id: Date.now(),
      role: 'user',
      agent_name: user?.name || 'You',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsSubmitting(true);

    try {
      const res = await apiChatWithCompanion(text, conversation?.conversation_id);
      setMessages((prev) => [
        ...prev,
        {
          id: res.message_id || Date.now() + 1,
          role: 'assistant',
          agent_name: res.agent_name,
          content: res.content,
          agent_steps: res.agent_steps || [],
          proposed_action: res.proposed_action,
          citations: res.citations || [],
          suggested_actions: res.suggested_actions || [],
          is_demo: res.is_demo,
          timestamp: res.timestamp || new Date().toISOString(),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'assistant',
          agent_name: 'System Error',
          content: `Unable to complete request: ${err.message}. Please verify your connection or Gemini API key.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveProposal = async (msgId: number, proposedAction: any) => {
    setApprovingAction(`${msgId}`);
    try {
      const payload = proposedAction.details || proposedAction.payload;
      const actionType = proposedAction.action_type || proposedAction.type || 'create_routine';
      await apiApproveAction(conversation?.conversation_id || 1, actionType, true, payload);
      
      // Update UI state to show approved
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? {
                ...m,
                proposed_action: {
                  ...m.proposed_action,
                  status: 'approved',
                },
              }
            : m
        )
      );
      onRoutineUpdated();
    } catch (err: any) {
      alert(`Approval error: ${err.message}`);
    } finally {
      setApprovingAction(null);
    }
  };

  const handleReset = async () => {
    if (confirm('Start a fresh consultation with your AI Companion?')) {
      await apiResetConversation();
      setMessages([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-[#E3E8E1] p-4 md:p-5 shadow-card flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#173F35] text-white flex items-center justify-center font-bold">
            <Bot className="w-5 h-5 text-[#A8BDA9]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-[#173F35]">Bodywise AI Companion</h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EDF3ED] text-[#2F855A] border border-[#D0DDD0]">
                Active Agent
              </span>
            </div>
            <p className="text-xs text-[#727B74]">
              Multi-agent LangGraph orchestrator grounded in verified Be Bodywise formulations
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#EDF3ED] border border-[#E3E8E1] text-xs font-semibold text-[#727B74] hover:text-[#173F35] flex items-center space-x-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Consultation</span>
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold text-[#727B74] uppercase tracking-wider flex-shrink-0">
          Suggested:
        </span>
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            className="text-xs whitespace-nowrap px-3 py-1 rounded-full bg-white hover:bg-[#EDF3ED] text-[#252D29] border border-[#E3E8E1] hover:border-[#A8BDA9] transition-all flex-shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-xl border border-[#E3E8E1] p-4 md:p-6 shadow-card min-h-[460px] max-h-[600px] overflow-y-auto space-y-5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="w-12 h-12 rounded-xl bg-[#EDF3ED] flex items-center justify-center text-[#173F35] mb-3">
              <Bot className="w-6 h-6 text-[#173F35]" />
            </div>
            <h3 className="text-base font-bold text-[#173F35]">Welcome to your AI Personal-Care Companion</h3>
            <p className="text-xs text-[#727B74] max-w-md mt-1 mb-6 leading-relaxed">
              Ask about hair fall treatments, formulation safety, daily habits, or let our agents construct an optimized regimen for your concerns.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md w-full">
              {suggestedPrompts.slice(0, 4).map((p) => (
                <button
                  key={p}
                  onClick={() => handleSendMessage(p)}
                  className="p-3 text-left rounded-lg bg-[#FAF9F5] hover:bg-[#EDF3ED] border border-[#E3E8E1] text-xs text-[#252D29] font-medium transition-all"
                >
                  &quot;{p}&quot;
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            const hasTrace = msg.agent_steps && msg.agent_steps.length > 0;
            const isTraceExpanded = expandedTraceId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                {/* Sender badge */}
                <div className="flex items-center space-x-1.5 text-[11px] text-[#727B74] px-1">
                  {isUser ? (
                    <span>You</span>
                  ) : (
                    <>
                      <Bot className="w-3.5 h-3.5 text-[#173F35]" />
                      <span className="font-semibold text-[#173F35]">{msg.agent_name || 'AI Companion'}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-xl p-4 text-xs md:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#173F35] text-white shadow-sm'
                      : 'bg-[#FAF9F5] text-[#252D29] border border-[#E3E8E1]'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>

                  {/* Human-In-The-Loop Routine Proposal Card */}
                  {msg.proposed_action && (
                    <div className="mt-4 p-4 rounded-lg bg-white border border-[#D0DDD0] text-[#252D29]">
                      <div className="flex items-center space-x-2 text-xs font-bold text-[#173F35] mb-2">
                        <CalendarCheck className="w-4 h-4 text-[#477C68]" />
                        <span>Proposed Routine Regimen</span>
                      </div>

                      <p className="text-xs text-[#727B74] mb-3">
                        {msg.proposed_action.summary || 'A custom regimen has been generated for your review. No changes are saved until approved.'}
                      </p>

                      {msg.proposed_action.details?.tasks && (
                        <div className="space-y-2 mb-4">
                          {msg.proposed_action.details.tasks.map((t: any, idx: number) => (
                            <div key={idx} className="p-2.5 rounded-md bg-[#FAF9F5] border border-[#E3E8E1] text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-[#173F35]">{t.title}</span>
                                <span className="text-[10px] uppercase font-bold text-[#727B74]">{t.time_of_day} • {t.scheduled_time}</span>
                              </div>
                              <p className="text-[11px] text-[#727B74] mt-0.5">{t.description}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.proposed_action.status === 'approved' ? (
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-[#2F855A] bg-[#EDF3ED] p-2.5 rounded-md border border-[#D0DDD0]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approved &amp; Saved to Your Active Regimen</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApproveProposal(msg.id, msg.proposed_action)}
                          disabled={approvingAction === `${msg.id}`}
                          className="w-full py-2 px-3 rounded-lg bg-[#173F35] hover:bg-[#1F4F43] text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#A8BDA9]" />
                          <span>
                            {approvingAction === `${msg.id}` ? 'Saving to Schedule...' : 'Approve & Save Routine'}
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Verified Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#E3E8E1] space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#727B74]">
                        Verified Formulations Cited:
                      </p>
                      {msg.citations.map((cite: any, cidx: number) => (
                        <div
                          key={cidx}
                          className="flex items-center justify-between p-2 rounded bg-white border border-[#E3E8E1] text-[11px]"
                        >
                          <span className="font-medium text-[#173F35] truncate max-w-[280px]">
                            {cite.product_name}
                          </span>
                          {cite.source_url && (
                            <a
                              href={cite.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#477C68] hover:underline flex items-center space-x-1 flex-shrink-0 ml-2"
                            >
                              <span>Official Spec</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Multi-Agent Trace Details */}
                  {hasTrace && (
                    <div className="mt-3 pt-2">
                      <button
                        onClick={() => setExpandedTraceId(isTraceExpanded ? null : msg.id)}
                        className="text-[11px] text-[#727B74] hover:text-[#173F35] flex items-center space-x-1 font-medium"
                      >
                        <span>Agent Orchestration Trace ({msg.agent_steps.length} steps)</span>
                        {isTraceExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {isTraceExpanded && (
                        <div className="mt-2 p-2.5 rounded-lg bg-white border border-[#E3E8E1] space-y-1.5 text-[11px]">
                          {msg.agent_steps.map((step: any, sidx: number) => (
                            <div key={sidx} className="flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#173F35] mt-1.5 flex-shrink-0" />
                              <div>
                                <span className="font-bold text-[#173F35]">{step.agent}:</span>{' '}
                                <span className="text-[#727B74]">{step.action}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Loading Bubble */}
        {isSubmitting && (
          <div className="flex flex-col items-start space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[11px] text-[#727B74] px-1">
              <Bot className="w-3.5 h-3.5 text-[#173F35]" />
              <span className="font-semibold text-[#173F35]">Multi-Agent Orchestrator</span>
              <span>thinking...</span>
            </div>
            <div className="bg-[#FAF9F5] border border-[#E3E8E1] rounded-xl p-3.5 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#173F35] animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-[#477C68] animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-[#A8BDA9] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask your AI companion about products, routines, ingredients, or symptoms..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isSubmitting}
          className="flex-1 px-4 py-3 rounded-lg bg-white border border-[#E3E8E1] text-xs md:text-sm text-[#252D29] placeholder-[#727B74] focus:outline-none focus:border-[#173F35] transition-all shadow-sm"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSubmitting}
          className="px-5 py-3 rounded-lg bg-[#173F35] hover:bg-[#1F4F43] disabled:opacity-50 text-white text-xs md:text-sm font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
        >
          <Send className="w-4 h-4 text-[#A8BDA9]" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
