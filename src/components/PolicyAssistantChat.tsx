import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  Loader2,
  Building2,
  HelpCircle,
  TrendingUp,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { HotspotCluster, DistrictIndicator } from '../types';

interface PolicyAssistantChatProps {
  isOpen: boolean;
  onClose: () => void;
  hotspots: HotspotCluster[];
  districts: DistrictIndicator[];
}

export const PolicyAssistantChat: React.FC<PolicyAssistantChatProps> = ({
  isOpen,
  onClose,
  hotspots,
  districts,
}) => {
  const [messages, setMessages] = useState<
    { sender: 'user' | 'assistant'; text: string; timestamp: string }[]
  >([
    {
      sender: 'assistant',
      text: `Greetings. I am the AI Policy & Strategic Infrastructure Advisor for **CivicPulse AI (Universal Citizen Infrastructure DPG)**.\n\nI can analyze cross-sectoral citizen demands, correlate with regional deprivation indicators, evaluate unallocated capital budgets, and assist in drafting executive cabinet dossiers.\n\nHow may I assist your infrastructure review today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendMessage = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMessage = {
      sender: 'user' as const,
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const hotspotsSummary = hotspots.map((h) => ({
        district: h.district,
        state: h.state,
        sector: h.sector,
        disparityGapIndex: h.disparityGapIndex,
        requestCount: h.requestCount,
        primaryDeficit: h.primaryDeficit,
        recommendedMission: h.recommendedMission,
      }));

      const res = await fetch('/api/policy-assistant-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          hotspotsSummary,
        }),
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: data.answer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Apologies, unable to contact strategic policy backend. Please verify network connectivity.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl">
        {/* Chat Drawer Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-sm bg-indigo-900 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-indigo-900 uppercase tracking-widest">NITI Strategic Policy Copilot</h3>
              <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider block">
                Ground-Truth AI Infrastructure Advisory
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-slate-50/80 p-3 border-b border-slate-200 flex items-center space-x-2 overflow-x-auto text-[11px]">
          <button
            onClick={() =>
              handleSendMessage(
                'Which Aspirational districts have the largest gap between citizen water distress and Jal Jeevan coverage?'
              )
            }
            className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-sm whitespace-nowrap cursor-pointer shadow-xs font-medium"
          >
            💧 Water Crisis in Aspirational Districts
          </button>
          <button
            onClick={() =>
              handleSendMessage(
                'Recommend high-priority flood and road connectivity projects for North-East and Gangetic basin.'
              )
            }
            className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-sm whitespace-nowrap cursor-pointer shadow-xs font-medium"
          >
            🛣️ Flood Road Connectivity
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-50/40">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 ${
                m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-orange-600 text-white'
                    : 'bg-indigo-900 text-white'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-sm max-w-[85%] leading-relaxed whitespace-pre-wrap font-medium ${
                  m.sender === 'user'
                    ? 'bg-orange-50 text-slate-900 border border-orange-200 border-l-4 border-l-orange-500 shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 border-l-4 border-l-indigo-600 shadow-xs'
                }`}
              >
                {m.text}
                <div className="text-[9px] text-slate-400 mt-2 text-right font-mono">{m.timestamp}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 bg-white border border-slate-200 p-3 rounded-sm text-slate-600 max-w-[75%] shadow-xs font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
              <span>Analyzing national database &amp; formulating strategic briefing...</span>
            </div>
          )}
        </div>

        {/* Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
        >
          <input
            id="policy-assistant-input"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask strategic policy question (e.g. budget reallocations, tribal deficits)..."
            className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-sm px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="bg-indigo-900 hover:bg-indigo-800 text-white p-2.5 rounded-sm disabled:opacity-40 cursor-pointer font-bold transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
