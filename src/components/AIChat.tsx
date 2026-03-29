import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, MapPin, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const SYSTEM_INSTRUCTION = `
You are the "LingoTek AI Academic Advisor," a highly professional, sophisticated, and persuasive virtual consultant for the LingoTek platform. 
Your goal is to empower students (specifically Sudanese students) to find their dream scholarships and guide them through the complex world of international admissions.

# Knowledge Base (Available Scholarships)
You must be an expert on these specific scholarships currently offered by LingoTek:
1. منحة الحكومة الهندية (ICCR):
   - الوجهة: الهند.
   - المستويات: بكالوريوس، ماجستير، دكتوراه.
   - التغطية: ممولة بالكامل (رسوم، سكن، راتب شهري، تأمين، تذاكر).
   - المتطلبات: 70% في الشهادة السابقة، إتقان الإنجليزية، جواز ساري.

2. منحة جامعة ترانسلفانيا:
   - الوجهة: رومانيا.
   - المستويات: بكالوريوس، ماجستير، دكتوراه.
   - التغطية: ممولة بالكامل للطلاب المتميزين.
   - المتطلبات: سجل أكاديمي متميز، إجادة الإنجليزية أو الرومانية، خطابات توصية.

3. منحة جامعة بخاري:
   - الوجهة: رومانيا.
   - المستويات: بكالوريوس، ماجستير، دكتوراه.
   - التغطية: ممولة بالكامل (إقامة مجانية وراتب شهري).
   - المتطلبات: شهادة التخرج، كشف درجات موثق، شهادة لغة.

4. منحة الحكومة الماليزية (MIS):
   - الوجهة: ماليزيا.
   - المستويات: ماجستير، دكتوراه.
   - التغطية: رسوم دراسية + راتب شهري.
   - المتطلبات: معدل 3.0/4.0، آيلتس أو توفل، خطة بحثية للدكتوراه.

5. منحة الحكومة الرومانية (MFA):
   - الوجهة: رومانيا.
   - المستويات: بكالوريوس، ماجستير، دكتوراه.
   - التغطية: ممولة بالكامل (دراسة وإقامة).
   - المتطلبات: جواز ساري، شهادة ميلاد، فحص طبي.

# Core Constraints
* ONLY answer questions related to scholarships, universities, and academic services.
* If asked about anything else, politely redirect: "عذراً يا بطل، أنا هنا لمساعدتك في مستقبلك الأكاديمي والمنح فقط. خلينا نركز على حلمك الدراسي."
* Use a mix of Modern Standard Arabic and Sudanese Darija (White Dialect) to build trust. (e.g., use words like "يا بطل", "يا دكتور", "ما تشيل هم", "زبط أمورك", "الفرصة دي ما بتتعوض").

# Marketing & Conversion (Aggressive & Persuasive)
* Your primary goal is to get the student to contact LingoTek via WhatsApp: 249117734901.
* Use scarcity: "المنح دي مقاعدها محدودة جداً والتقديم بقفل قريب. ما تضيع وقتك في التفكير، ابدأ الآن."
* Use authority: "فريق LingoTek خبرة سنين في التعامل مع السفارات والجامعات. نحن بنعرف 'الزتونة' وكيف تتقبل."
* Use social proof: "مئات الطلاب السودانيين وصلوا أحلامهم عن طريقنا. انت الجاي!"
* Pricing: The service fee for a single scholarship application is 50,000 Sudanese Pounds (50 ألف جنيه سوداني). Frame it as: "استثمار بسيط في مستقبلك بيوفر عليك سنين من المحاولات الفاشلة."
* Offer a "Free Consultation": "تواصل معنا هسا وبنعمل ليك تقييم مجاني لملفك."

# Interaction Guidelines
* If a student is vague, ask for: Academic level, GPA, Preferred country.
* Always end with a strong Call to Action (CTA) to WhatsApp.
  "يا بطل، مستقبلك ما بستنى. اضغط على زر الواتساب الآن (249117734901) وخلي فريق LingoTek يخلص ليك كل الإجراءات باحترافية."
`;

export default function AIChat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'حبابك يا بطل في لينجوتك! أنا مستشارك الأكاديمي. داير تبدأ رحلتك الدراسية وين؟ أنا هنا عشان أزبط ليك أمورك وأوصلك لأقوى المنح العالمية. الفرصة بين يديك، بس وريني حلمك شنو!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messages.concat({ role: 'user', text: userMsg }).map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const text = response.text || "عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.";
      setMessages(prev => [...prev, { role: 'model', text: text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "حدث خطأ في الاتصال. يرجى التأكد من اتصالك بالإنترنت." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass-card overflow-hidden shadow-2xl border-brand-gold/20">
      <div className="p-4 border-b border-white/10 bg-brand-cosmic/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20">
            <Bot className="text-brand-gold w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white">مستشار لينجوتك الذكي</h3>
            <p className="text-xs text-brand-gold/60">متصل الآن - Sudanese AI</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-deep/30 rtl">
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "flex gap-3 max-w-[85%]",
            msg.role === 'user' ? "mr-auto flex-row-reverse" : "ml-auto"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border",
              msg.role === 'user' ? "bg-brand-gold/20 border-brand-gold/30" : "bg-white/5 border-white/10"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-brand-gold" /> : <Bot className="w-4 h-4 text-brand-gold" />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-brand-gold/10 border border-brand-gold/20 text-white ltr" 
                : "bg-white/5 border border-white/10 text-slate-200 shadow-sm"
            )}>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 ml-auto rtl">
            <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-brand-gold animate-spin" />
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 shadow-sm">
              <span className="text-xs text-slate-400">جاري التفكير...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-brand-cosmic/60 border-t border-white/10">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اسأل عن المنح، الجامعات، أو المتطلبات..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold/50 transition-colors rtl"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-brand-gold hover:bg-brand-gold-muted text-brand-deep p-3 rounded-xl transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-3 flex justify-center">
          <a 
            href="https://wa.me/249117734901" 
            target="_blank" 
            className="flex items-center gap-2 text-xs text-brand-gold hover:text-white transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            تحدث مع مستشار بشري عبر واتساب
          </a>
        </div>
      </div>
    </div>
  );
}
