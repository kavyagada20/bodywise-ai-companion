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
  ThumbsUp,
  Info
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
          content: `⚠️ Error processing request: ${err.message || 'Please check backend connection.'}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveAction = async (msgIndex: number, proposedAction: any, approved: boolean) => {
    setApprovingAction(approved ? 'approve' : 'reject');
    try {
      const res = await apiApproveAction(
        conversation?.conversation_id || 1,
        proposedAction.action_type,
        approved,
        proposedAction
      );

      // Update message state
      setMessages((prev) => {
        const copy = [...prev];
        if (copy[msgIndex]?.proposed_action) {
          copy[msgIndex].proposed_action.status = approved ? 'approved' : 'rejected';
        }
        return copy;
      });

      if (approved) {
        onRoutineUpdated();
      }
    } catch (err: any) {
      alert(`Action could not be executed: ${err.message}`);
    } finally {
      setApprovingAction(null);
    }
  };

  const handleReset = async () => {
    if (!confirm('Start a fresh personal-care consultation session?')) return;
    try {
      await apiResetConversation();
      setMessages([
        {
          id: Date.now(),
          role: 'assistant',
          agent_name: 'Personalisation Agent',
          content: `Hello ${user?.name || 'there'}! A fresh consultation session has started. What personal care goals or concerns shall we focus on today?`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="wellness-card border-[#ebdff3] overflow-hidden flex flex-col h-[calc(100vh-140px)] min-h-[580px] animate-fadeIn">
      {/* Header */}
      <div className="p-4 md:px-6 py-3.5 bg-gradient-to-r from-[#faf7fc] to-white border-b border-[#ebdff3] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#7c469b] to-[#ae7ecc] text-white flex items-center justify-center shadow-soft">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm md:text-base font-bold text-[#351a42]">Bodywise AI Companion</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f1f8f3] text-[#529b68] font-bold border border-[#529b68]/20">
                Multi-Agent Orchestrator
              </span>
            </div>
            <p className="text-[11px] text-[#766585]">
              Coordinating Personalisation, Product Knowledge (RAG), Routine &amp; Safety Agents
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-xs font-semibold text-[#766585] hover:text-[#351a42] px-2.5 py-1.5 rounded-xl hover:bg-[#faf7fc] border border-transparent hover:border-[#ebdff3] flex items-center space-x-1 transition-all"
          title="Reset conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Consultation</span>
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 bg-[#fbf9fe]">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          const hasTrace = msg.agent_steps && msg.agent_steps.length > 0;
          const isTraceExpanded = expandedTraceId === msg.id;

          return (
            <div
              key={msg.id || index}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              {/* Agent / User badge */}
              <div className="flex items-center space-x-1.5 text-[11px] text-[#766585] px-1">
                {isUser ? (
                  <>
                    <span className="font-semibold text-[#553267]">You</span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </>
                ) : (
                  <>
                    <span className="font-bold text-[#7c469b]">{msg.agent_name || 'AI Companion'}</span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-2xl rounded-2xl p-4 md:p-5 text-xs md:text-sm leading-relaxed shadow-soft ${
                  isUser
                    ? 'bg-[#7c469b] text-white rounded-tr-none'
                    : 'bg-white text-[#2d1d3a] border border-[#ebdff3] rounded-tl-none'
                }`}
              >
                {/* Agent Activity Trace Dropdown */}
                {!isUser && hasTrace && (
                  <div className="mb-3.5 pb-2.5 border-b border-[#f3eef8]">
                    <button
                      onClick={() => setExpandedTraceId(isTraceExpanded ? null : msg.id)}
                      className="w-full flex items-center justify-between text-[11px] font-semibold text-[#7c469b] bg-[#faf7fc] px-2.5 py-1.5 rounded-lg border border-[#ebdff3] hover:bg-[#f3eef8] transition-all"
                    >
                      <div className="flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#945bb7]" />
                        <span>View Multi-Agent Workflow Trace ({msg.agent_steps.length} steps)</span>
                      </div>
                      {isTraceExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isTraceExpanded && (
                      <div className="mt-2 space-y-1.5 pl-2 border-l-2 border-[#ae7ecc]">
                        {msg.agent_steps.map((step: any, sIdx: number) => (
                          <div key={sIdx} className="text-[11px] text-[#553267]">
                            <span className="font-bold text-[#7c469b]">{step.agent}:</span> {step.action}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Main Content */}
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Grounded Citations */}
                {!isUser && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#ebdff3] space-y-2">
                    <p className="text-[11px] font-bold uppercase text-[#766585] tracking-wider flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#529b68]" />
                      <span>Verified Knowledge Sources</span>
                    </p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {msg.citations.map((cite: any, cIdx: number) => (
                        <div
                          key={cIdx}
                          className="p-2.5 rounded-xl bg-[#faf7fc] border border-[#ebdff3] text-[11px]"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[#351a42]">{cite.product_name}</span>
                            <span className="text-[10px] text-[#529b68] font-semibold">Verified</span>
                          </div>
                          <p className="text-[#766585] line-clamp-2">{cite.snippet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ROUTINE ACTION PROPOSAL CARD (Human-in-the-Loop) */}
                {!isUser && msg.proposed_action && (
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#faf7fc] to-[#f4f0fa] border border-[#dec7ea]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-[#7c469b]" />
                        <h4 className="text-xs font-bold text-[#351a42]">
                          Agent Action Proposal: {msg.proposed_action.summary}
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        Approval Required
                      </span>
                    </div>

                    <p className="text-xs text-[#766585] mb-3">
                      This action will update your active schedule in the database. Review the steps below and click approve to persist.
                    </p>

                    {msg.proposed_action.status === 'pending' ? (
                      <div className="flex items-center space-x-2 pt-2 border-t border-[#ebdff3]">
                        <button
                          disabled={approvingAction !== null}
                          onClick={() => handleApproveAction(index, msg.proposed_action, true)}
                          className="px-4 py-2 rounded-xl bg-[#7c469b] hover:bg-[#673a7f] text-white text-xs font-bold transition-all shadow-soft flex items-center space-x-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve &amp; Save Routine</span>
                        </button>
                        <button
                          disabled={approvingAction !== null}
                          onClick={() => handleApproveAction(index, msg.proposed_action, false)}
                          className="px-3 py-2 rounded-xl bg-white hover:bg-[#faf7fc] text-[#766585] text-xs font-semibold border border-[#ebdff3] transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-[#529b68] flex items-center space-x-1.5 pt-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Action Approved &amp; Saved to Active Regimen!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isSubmitting && (
          <div className="flex items-start space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#7c469b] text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#ebdff3] text-xs text-[#766585] shadow-soft flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-[#7c469b] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#945bb7] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#c8a4dc] animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="font-medium text-[#553267]">Orchestrating AI agents &amp; retrieving verified knowledge...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2.5 bg-white border-t border-[#f4f0fa] overflow-x-auto flex items-center space-x-2 no-scrollbar">
        <span className="text-[11px] font-semibold text-[#766585] whitespace-nowrap">Suggested:</span>
        {suggestedPrompts.map((prompt, pIdx) => (
          <button
            key={pIdx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isSubmitting}
            className="text-xs whitespace-nowrap px-3 py-1 rounded-full bg-[#faf7fc] hover:bg-[#f3eef8] text-[#553267] border border-[#ebdff3] hover:border-[#dec7ea] transition-all flex items-center space-x-1"
          >
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 md:p-4 bg-white border-t border-[#ebdff3]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask anything (e.g. 'Create a simple evening routine', 'Explain Salicylic Acid', 'I missed yesterday')..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#faf7fc] border border-[#ebdff3] text-xs md:text-sm text-[#351a42] placeholder-[#766585] focus:outline-none focus:border-[#7c469b] transition-all"
          />
          <button
            type="submit"
            disabled={isSubmitting || !inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#7c469b] hover:bg-[#673a7f] disabled:opacity-50 text-white text-xs md:text-sm font-semibold flex items-center space-x-1.5 transition-all shadow-soft"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

