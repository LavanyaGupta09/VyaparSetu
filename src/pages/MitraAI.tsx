import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Loader2, RefreshCcw, AlertCircle, Mic, Volume2, MicOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useTranslation } from 'react-i18next';
import { aiService } from '../services/aiService';

// Mock context that would normally come from the user's profile state
const userContext = {
  industry: "Food Processing",
  location: "Pune, Maharashtra",
  investment: "₹4.2 Cr",
  employees: 35,
  currentApplications: ["Pollution Consent (In Progress)", "Factory Approval (Not Started)"],
  pendingDocuments: ["Site Plan", "Environmental Report"],
  complianceTasks: ["License Renewal due in 28 days"]
};

const AiResponseRenderer = ({ content }: { content: string }) => {
  try {
    const parsed = JSON.parse(content);
    return (
      <div className="space-y-4 w-full">
        <p className="whitespace-pre-wrap">{parsed.message}</p>
        {parsed.cards && parsed.cards.length > 0 && (
          <div className="grid gap-4 mt-4 w-full">
            {parsed.cards.map((card: any, idx: number) => (
              <div key={idx} className="approval-card bg-white border border-slate-200 rounded-xl p-4 shadow-sm w-full">
                <h4 className="font-bold text-primary-900 mb-2">{card.title}</h4>
                <div className="text-sm text-slate-600 mb-3 flex flex-wrap gap-x-4 gap-y-1">
                  <span><strong className="text-slate-800">Status:</strong> {card.status}</span>
                  <span><strong className="text-slate-800">Authority:</strong> {card.authority}</span>
                </div>
                <details className="mb-2 text-sm group">
                  <summary className="font-medium cursor-pointer text-slate-700 hover:text-accent outline-none">Why is this required?</summary>
                  <p className="mt-1 text-slate-600 pl-4 border-l-2 border-slate-100">{card.whyRequired}</p>
                </details>
                {card.documents && card.documents.length > 0 && (
                  <details className="mb-4 text-sm group">
                    <summary className="font-medium cursor-pointer text-slate-700 hover:text-accent outline-none">Required documents</summary>
                    <ul className="mt-2 text-slate-600 pl-4 list-disc list-outside ml-2 space-y-1">
                      {card.documents.map((doc: string, j: number) => <li key={j}>{doc}</li>)}
                    </ul>
                  </details>
                )}
                <button className="action-btn w-full bg-slate-50 hover:bg-blue-50 text-accent font-semibold py-2.5 rounded-lg border border-slate-200 hover:border-accent transition-colors mt-2">
                  {card.actionLabel || 'Start Application'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (e) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }
};

const MitraAI = () => {
  const [messages, setMessages] = useState<{role: string, content: string, error?: boolean}[]>([
    { role: 'ai', content: 'Hello Rohit! I am Mitra AI, your Industrial Approval Copilot. I see you are setting up a Food Processing Unit in Pune. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleChatClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('action-btn')) {
      const card = target.closest('.approval-card');
      if (card) {
        const titleEl = card.querySelector('h4');
        if (titleEl) {
          const approvalName = titleEl.innerText || titleEl.textContent;
          navigate(`/application?name=${encodeURIComponent(approvalName || 'Application')}`);
        }
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    
    const userMsg = messageText.trim();
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    
    try {
      // Create an AbortController for timeout handling (15 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const apiMessages = newMessages.filter(m => !m.error).map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content
      }));

      // We'll wrap the service call in a Promise.race for timeout.
      const fetchPromise = aiService.chat(apiMessages, { ...userContext, locale: i18n.language });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out after 15 seconds')), 15000)
      );
      
      const data = await Promise.race([fetchPromise, timeoutPromise]) as any;
      clearTimeout(timeoutId);

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages([...newMessages, { role: 'ai', content: data.reply }]);
    } catch (error: any) {
      console.error(`Mitra AI API Error: 500 - ${error.message}`);
      
      // Developer safe error in console, user-friendly in UI
      setMessages([...newMessages, { 
        role: 'ai', 
        content: 'I apologize, but I am having trouble connecting to the AI service right now. Please try again.',
        error: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(t('Voice recognition not supported in this browser.'));
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = i18n.language === 'hi' ? 'hi-IN' : (i18n.language === 'mr' ? 'mr-IN' : 'en-IN');
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + ' ' + transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const readAloud = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/[*#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = i18n.language === 'hi' ? 'hi-IN' : (i18n.language === 'mr' ? 'mr-IN' : 'en-IN');
    window.speechSynthesis.speak(utterance);
  };

  const retryLastMessage = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      // Remove the error message
      setMessages(prev => prev.filter(m => !m.error));
      handleSend(lastUserMsg.content);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
        <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-primary-900 leading-tight">Mitra AI</h2>
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 block animate-pulse"></span> Connected via Secure Backend
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6" onClick={handleChatClick}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary-100 text-primary-900' : (msg.error ? 'bg-red-100 text-red-500' : 'bg-accent text-white')}`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : (msg.error ? <AlertCircle className="w-5 h-5" /> : <Bot className="w-5 h-5" />)}
            </div>
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-4 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-primary-900 text-white rounded-tr-sm' 
                  : (msg.error ? 'bg-red-50 border border-red-100 text-red-700 rounded-tl-sm' : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm w-full markdown-content')
              }`}>
                {msg.role === 'user' || msg.error ? (
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                ) : (
                  <AiResponseRenderer content={msg.content} />
                )}
                
                {msg.role === 'ai' && !msg.error && (
                  <button onClick={() => readAloud(msg.content)} className="mt-3 text-xs text-slate-500 hover:text-accent flex items-center gap-1 transition-colors">
                    <Volume2 className="w-3.5 h-3.5" /> {t('Read aloud')}
                  </button>
                )}
                {msg.error && (
                  <button 
                    onClick={retryLastMessage}
                    className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" /> Retry Request
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-slate-50 border border-slate-100 text-slate-700 rounded-2xl rounded-tl-sm shadow-sm p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              <span className="text-sm font-medium">Processing securely...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex gap-2 items-center">
          <button
            type="button"
            onClick={toggleVoice}
            className={`p-3 rounded-full flex items-center justify-center transition-colors shadow-sm flex-shrink-0 h-12 w-12 border ${
              isListening ? 'bg-red-50 text-red-500 border-red-200 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={t('Voice input')}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={t("Ask Mitra AI...")}
            className="flex-1 border border-slate-200 rounded-full px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm bg-slate-50 disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-accent hover:bg-accent-hover disabled:bg-slate-300 text-white rounded-full p-3 transition-colors shadow-md flex items-center justify-center h-12 w-12 flex-shrink-0"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 hide-scrollbar">
          {["What approvals do I need?", "What should I do next?", "Why is my pollution consent required?", "Check my application process."].map((suggestion, i) => (
            <button 
              key={i}
              type="button"
              disabled={isLoading}
              onClick={() => handleSend(suggestion)}
              className="whitespace-nowrap text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors font-medium border border-slate-200 disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MitraAI;
