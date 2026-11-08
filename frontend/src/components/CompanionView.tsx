'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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
  CalendarCheck,
  ShieldAlert,
  Ticket,
  Mail,
  AlertCircle
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestedPrompts = [
    'Help me create a hair-care routine',
    'Explain how Salicylic Acid works',
    'Show me today\'s routine',
    'I missed yesterday\'s routine. What should I do?',
    'Summarise my weekly progress',
    'Explain how Redensyl works in the Hair Growth Serum',
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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleApproveProposal = async (msgId: number, proposedAction: any) => {
    setApprovingAction(`${msgId}`);
    try {
      const payload = proposedAction.details || proposedAction.payload;
      const actionType = proposedAction.action_type || proposedAction.type || 'create_routine';
      await apiApproveAction(conversation?.conversation_id || 1, actionType, true, payload);
      
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

  // Helper to extract escalation ticket info if present in content
  const extractTicketDetails = (content: string) => {
    const isEscalation = content.includes('Safety Advisory Notice') || content.includes('Human Support Escalation');
    if (!isEscalation) return null;

    const ticketMatch = content.match(/BW-ESC-[A-Z0-9]+/);
    const ticketId = ticketMatch ? ticketMatch[0] : 'BW-ESC-PENDING';
    const contactMatch = content.match(/[\w.-]+@[\w.-]+\.\w+/);
    const email = contactMatch ? contactMatch[0] : 'support@bebodywise.com';

    return {
      ticketId,
      status: 'Escalated to Human Wellness Specialist',
      severity: 'High (Adverse Reaction Reported)',
      assignedTeam: 'Senior Clinical Support Team',
      email,
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn">
      {/* 1. Header Bar */}
      <div className="bg-white rounded-xl border border-[#E3E8E1] p-4 md:p-5 shadow-card flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#173F35] text-white flex items-center justify-center font-bold shadow-sm">
            <Bot className="w-5 h-5 text-[#A8BDA9]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-[#173F35]">Bodywise AI Companion</h1>
              <span className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EDF3ED] text-[#2F855A] border border-[#D0DDD0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F855A] animate-pulse" />
                <span>Active Agent</span>
              </span>
            </div>
            <p className="text-xs text-[#727B74]">
              Multi-agent personal-care assistant grounded in verified Be Bodywise formulations
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#EDF3ED] border border-[#E3E8E1] text-xs font-semibold text-[#727B74] hover:text-[#173F35] flex items-center space-x-1.5 transition-all shadow-subtle"
          title="Start fresh conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Consultation</span>
        </button>
      </div>

      {/* 2. Suggested Quick Prompts */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold text-[#727B74] uppercase tracking-wider flex-shrink-0">
          Suggested:
        </span>
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            className="text-xs whitespace-nowrap px-3 py-1.5 rounded-lg bg-white hover:bg-[#EDF3ED] text-[#252D29] border border-[#E3E8E1] hover:border-[#A8BDA9] transition-all flex-shrink-0 shadow-subtle hover:text-[#173F35] font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* 3. Conversation Scroll Panel */}
      <div className="bg-white rounded-xl border border-[#E3E8E1] shadow-card flex flex-col h-[580px] overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-12 h-12 rounded-xl bg-[#EDF3ED] flex items-center justify-center text-[#173F35] mb-3">
                <Bot className="w-6 h-6 text-[#173F35]" />
              </div>
              <h3 className="text-base font-bold text-[#173F35]">Welcome to your AI Personal-Care Partner</h3>
              <p className="text-xs text-[#727B74] max-w-md mt-1 mb-6 leading-relaxed">
                Ask about hair fall treatments, formulation safety, ingredient science (Redensyl, Salicylic Acid), or ask the assistant to generate an approved daily regimen.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md w-full">
                {suggestedPrompts.slice(0, 4).map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSendMessage(p)}
                    className="p-3 text-left rounded-lg bg-[#FAF9F5] hover:bg-[#EDF3ED] border border-[#E3E8E1] text-xs text-[#252D29] font-medium transition-all hover:text-[#173F35]"
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
              const ticketDetails = !isUser ? extractTicketDetails(msg.content) : null;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  {/* Sender & Timestamp Header */}
                  <div className="flex items-center space-x-1.5 text-[11px] text-[#727B74] px-1">
                    {isUser ? (
                      <span className="font-medium text-[#252D29]">You</span>
                    ) : (
                      <>
                        <Bot className="w-3.5 h-3.5 text-[#173F35]" />
                        <span className="font-semibold text-[#173F35]">{msg.agent_name || 'AI Companion'}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {/* Message Bubble Container */}
                  <div
                    className={`max-w-[85%] rounded-xl text-xs md:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#173F35] text-white p-4 shadow-sm'
                        : 'bg-[#FAF9F5] text-[#252D29] border border-[#E3E8E1] p-5 shadow-subtle'
                    }`}
                  >
                    {/* A. If message is a Safety Advisory, render structured safety UI */}
                    {ticketDetails ? (
                      <div className="space-y-4">
                        {/* Advisory Header */}
                        <div className="p-3.5 rounded-lg bg-[#FAF0ED] border border-[#F2C5BD] flex items-start space-x-3">
                          <ShieldAlert className="w-5 h-5 text-[#C05656] flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-sm text-[#C05656]">Safety Advisory Notice</h4>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C05656]/15 text-[#C05656]">
                                High Priority
                              </span>
                            </div>
                            <p className="text-xs text-[#252D29] mt-1 font-medium leading-relaxed">
                              Based on the symptoms you reported, <strong>please stop using the suspected product immediately and rinse the affected area gently with cool water</strong>.
                            </p>
                          </div>
                        </div>

                        {/* Medical Disclaimer Section */}
                        <div className="p-3 rounded-lg bg-white border border-[#E3E8E1] text-xs text-[#727B74] space-y-1">
                          <p className="font-bold text-[#173F35] text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-[#B7791F]" />
                            <span>Important Clinical Disclaimer</span>
                          </p>
                          <p className="leading-relaxed">
                            As an agentic AI assistant, I cannot diagnose medical conditions or issue prescriptions. If redness, intense stinging, or swelling persists, please seek immediate consultation with a qualified dermatologist or emergency healthcare provider.
                          </p>
                        </div>

                        {/* Structured Escalation Ticket Component */}
                        <div className="p-4 rounded-lg bg-white border border-[#D0DDD0] shadow-sm space-y-2.5">
                          <div className="flex items-center justify-between pb-2 border-b border-[#E3E8E1]">
                            <div className="flex items-center space-x-2">
                              <Ticket className="w-4 h-4 text-[#173F35]" />
                              <span className="font-bold text-xs text-[#173F35]">Support Escalation Created</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-[#EDF3ED] text-[#2F855A] font-bold text-[10px] border border-[#D0DDD0]">
                              Live Human Queue
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="p-2 rounded bg-[#FAF9F5] border border-[#E3E8E1]">
                              <span className="text-[10px] uppercase font-bold text-[#727B74] block">Ticket Reference</span>
                              <span className="font-mono font-bold text-[#173F35]">{ticketDetails.ticketId}</span>
                            </div>
                            <div className="p-2 rounded bg-[#FAF9F5] border border-[#E3E8E1]">
                              <span className="text-[10px] uppercase font-bold text-[#727B74] block">Severity</span>
                              <span className="font-bold text-[#C05656]">{ticketDetails.severity}</span>
                            </div>
                          </div>

                          <div className="text-xs text-[#727B74] pt-1">
                            <span>Assigned to: <strong>{ticketDetails.assignedTeam}</strong></span>
                            <div className="mt-1 flex items-center space-x-1 text-[#173F35]">
                              <Mail className="w-3.5 h-3.5 text-[#477C68]" />
                              <span>Direct Assistance: </span>
                              <a
                                href={`mailto:${ticketDetails.email}?subject=Safety%20Escalation%20${ticketDetails.ticketId}`}
                                className="font-medium text-[#477C68] hover:underline"
                              >
                                {ticketDetails.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* B. Standard Markdown Response Rendering */
                      <div className="prose prose-sm max-w-none text-[#252D29]">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2.5 last:mb-0 leading-relaxed">{children}</p>,
                            strong: ({ children }) => <strong className="font-bold text-[#173F35]">{children}</strong>,
                            h1: ({ children }) => <h3 className="text-base font-bold text-[#173F35] mt-3 mb-1.5">{children}</h3>,
                            h2: ({ children }) => <h4 className="text-sm font-bold text-[#173F35] mt-2.5 mb-1">{children}</h4>,
                            h3: ({ children }) => <h5 className="text-xs font-bold text-[#173F35] mt-2 mb-1 uppercase tracking-wider">{children}</h5>,
                            ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 my-2 text-xs md:text-sm">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 my-2 text-xs md:text-sm">{children}</ol>,
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            code: ({ children }) => (
                              <code className="px-1.5 py-0.5 rounded bg-[#EDF3ED] text-[#173F35] text-xs font-mono border border-[#D0DDD0]">
                                {children}
                              </code>
                            ),
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#477C68] font-semibold hover:underline inline-flex items-center space-x-1"
                              >
                                <span>{children}</span>
                                <ExternalLink className="w-3 h-3 ml-0.5" />
                              </a>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}

                    {/* C. Human-In-The-Loop Routine Proposal Card */}
                    {msg.proposed_action && (
                      <div className="mt-4 p-4 rounded-xl bg-white border border-[#D0DDD0] text-[#252D29] shadow-sm">
                        <div className="flex items-center space-x-2 text-xs font-bold text-[#173F35] mb-1.5">
                          <CalendarCheck className="w-4 h-4 text-[#477C68]" />
                          <span>AI Proposed Regimen Specification</span>
                        </div>

                        <p className="text-xs text-[#727B74] mb-3 leading-relaxed">
                          {msg.proposed_action.summary || 'A custom regimen has been generated for your review. In accordance with clinical safety guidelines, this regimen is held pending until you approve it.'}
                        </p>

                        {msg.proposed_action.details?.tasks && (
                          <div className="space-y-2 mb-4">
                            {msg.proposed_action.details.tasks.map((t: any, idx: number) => (
                              <div key={idx} className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E3E8E1] text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-[#173F35]">{t.title}</span>
                                  <span className="text-[10px] uppercase font-bold text-[#727B74] px-1.5 py-0.5 rounded bg-white border border-[#E3E8E1]">
                                    {t.time_of_day} • {t.scheduled_time}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#727B74] mt-1">{t.description}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {msg.proposed_action.status === 'approved' ? (
                          <div className="flex items-center space-x-2 text-xs font-bold text-[#2F855A] bg-[#EDF3ED] p-3 rounded-lg border border-[#D0DDD0]">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Regimen Approved &amp; Synchronized to Your Active Routine</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleApproveProposal(msg.id, msg.proposed_action)}
                            disabled={approvingAction === `${msg.id}`}
                            className="w-full py-2.5 px-4 rounded-lg bg-[#173F35] hover:bg-[#1F4F43] text-white text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-sm"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#A8BDA9]" />
                            <span>
                              {approvingAction === `${msg.id}` ? 'Saving to Schedule...' : 'Approve & Save Routine'}
                            </span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* D. Verified Clinical Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#E3E8E1] space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#727B74] flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#2F855A]" />
                          <span>Verified Be Bodywise Formulations Grounded:</span>
                        </p>
                        {msg.citations.map((cite: any, cidx: number) => (
                          <div
                            key={cidx}
                            className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E3E8E1] text-[11px]"
                          >
                            <span className="font-semibold text-[#173F35] truncate max-w-[280px]">
                              {cite.product_name}
                            </span>
                            {cite.source_url && (
                              <a
                                href={cite.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#477C68] hover:underline flex items-center space-x-1 flex-shrink-0 ml-2"
                              >
                                <span>Official Formulation Page</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* E. Multi-Agent Orchestration Vertical Timeline Trace */}
                    {hasTrace && (
                      <div className="mt-4 pt-3 border-t border-[#E3E8E1]">
                        <button
                          onClick={() => setExpandedTraceId(isTraceExpanded ? null : msg.id)}
                          className="text-[11px] text-[#727B74] hover:text-[#173F35] flex items-center space-x-1.5 font-medium transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#477C68]" />
                          <span>Agent Execution Trace ({msg.agent_steps.length} steps)</span>
                          {isTraceExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        {isTraceExpanded && (
                          <div className="mt-3 p-3.5 rounded-lg bg-white border border-[#E3E8E1] space-y-3">
                            <div className="relative pl-5 border-l-2 border-[#D0DDD0] space-y-3.5">
                              {msg.agent_steps.map((step: any, sidx: number) => (
                                <div key={sidx} className="relative">
                                  {/* Node dot on timeline */}
                                  <div className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-[#173F35] border-2 border-white shadow-xs" />
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className="font-bold text-xs text-[#173F35]">{step.agent}</span>
                                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-[#EDF3ED] text-[#2F855A]">
                                        {step.status || 'executed'}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-[#727B74] mt-0.5 leading-relaxed">{step.action}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Loading Indicator */}
          {isSubmitting && (
            <div className="flex flex-col items-start space-y-1.5 animate-fadeIn">
              <div className="flex items-center space-x-1.5 text-[11px] text-[#727B74] px-1">
                <Bot className="w-3.5 h-3.5 text-[#173F35]" />
                <span className="font-semibold text-[#173F35]">Multi-Agent Orchestrator</span>
                <span>synthesizing response...</span>
              </div>
              <div className="bg-[#FAF9F5] border border-[#E3E8E1] rounded-xl p-3.5 flex items-center space-x-2 shadow-subtle">
                <div className="w-2 h-2 rounded-full bg-[#173F35] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#477C68] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#A8BDA9] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 4. Message Composer */}
        <div className="p-3.5 md:p-4 bg-[#FAF9F5] border-t border-[#E3E8E1]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2.5"
          >
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Ask about hair fall treatments, formulation safety, or routine adjustments... (Shift+Enter for new line)"
                value={inputText}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-[#E3E8E1] text-xs md:text-sm text-[#252D29] placeholder-[#727B74] focus:outline-none focus:border-[#173F35] transition-all shadow-subtle resize-none max-h-32"
              />
            </div>
            <button
              type="submit"
              disabled={!inputText.trim() || isSubmitting}
              className="px-4 py-2.5 rounded-lg bg-[#173F35] hover:bg-[#1F4F43] disabled:opacity-40 text-white text-xs md:text-sm font-semibold flex items-center space-x-1.5 transition-all shadow-sm flex-shrink-0 h-[42px]"
            >
              <Send className="w-4 h-4 text-[#A8BDA9]" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-[#727B74] px-1 mt-2">
            <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for line break</span>
            <span>Grounded in verified Be Bodywise formulations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
