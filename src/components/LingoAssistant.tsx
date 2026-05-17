import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Loader2, Sparkles, MessageCircle, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function LingoAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      parts: [{ text: input }]
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages
        })
      });

      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.text }] }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "يا زول حصل خطأ في الاتصال، كدي جرب تاني بروقة." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[70vh] flex flex-col glass-card border-brand-gold/10 overflow-hidden rtl text-right">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-brand-gold/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold flex items-center justify-center text-brand-deep shadow-lg shadow-brand-gold/20">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">لينغو</h2>
            <p className="text-xs font-bold text-brand-gold opacity-80 uppercase tracking-widest">المساعد الشخصي الذكي</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black text-green-500">متصل الآن</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-brand-gold/20"
      >
        <AnimatePresence mode="popLayout">
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 space-y-4"
            >
              <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-brand-gold" />
              </div>
              <h3 className="text-xl font-bold text-white">أبشر يا زول!</h3>
              <p className="text-slate-400 max-w-xs mx-auto">أنا لينغو، بعرف كل تفاصيل المنح وأسعار خدمات لينجوتك. اسألني عن أي حاجة وبظبطك.</p>
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                {['شنو أفضل المنح حالياً؟', 'سعر كتابة الـ SOP كم؟', 'عندي معدل 80%، أقدم وين؟'].map((suggest, i) => (
                  <button 
                    key={i}
                    onClick={() => { setInput(suggest); handleSendMessage(); }}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-brand-gold/10 hover:border-brand-gold/30 transition-all"
                  >
                    {suggest}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === 'user' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-brand-accent text-white' : 'bg-brand-gold text-brand-deep'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl max-w-[80%] ${
                msg.role === 'user' 
                  ? 'bg-brand-accent/10 border border-brand-accent/20 text-white rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
              }`}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-gold text-brand-deep flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
                <span className="text-xs text-slate-400 font-bold">لينغو بيفكر...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <form 
        onSubmit={handleSendMessage}
        className="p-6 border-t border-white/10 bg-brand-deep/50"
      >
        <div className="relative group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اسأل لينغو أي حاجة..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/30 text-white transition-all placeholder:text-slate-500 font-bold"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-gold text-brand-deep rounded-xl flex items-center justify-center hover:bg-yellow-400 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg shadow-brand-gold/20"
          >
            <Send className="w-5 h-5 rtl:-scale-x-100" />
          </button>
        </div>
      </form>
    </div>
  );
}
