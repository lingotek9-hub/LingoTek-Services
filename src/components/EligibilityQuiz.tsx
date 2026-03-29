import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Trophy, Sparkles } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: { text: string; score: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "ما هو مستواك الأكاديمي الحالي؟",
    options: [
      { text: "خريج ثانوي", score: 10 },
      { text: "طالب جامعي", score: 8 },
      { text: "خريج بكالوريوس", score: 10 },
      { text: "خريج ماجستير", score: 10 },
    ]
  },
  {
    id: 2,
    text: "كم هو معدلك التراكمي (GPA) أو نسبتك المئوية؟",
    options: [
      { text: "أكثر من 90% (ممتاز)", score: 20 },
      { text: "80% - 90% (جيد جداً)", score: 15 },
      { text: "70% - 80% (جيد)", score: 10 },
      { text: "أقل من 70%", score: 5 },
    ]
  },
  {
    id: 3,
    text: "هل تمتلك شهادة لغة إنجليزية (IELTS/TOEFL)؟",
    options: [
      { text: "نعم، جاهزة", score: 15 },
      { text: "لا، لكن مستواي جيد", score: 10 },
      { text: "لا، وأحتاج لتطوير لغتي", score: 5 },
    ]
  },
  {
    id: 4,
    text: "هل لديك جواز سفر ساري المفعول؟",
    options: [
      { text: "نعم", score: 10 },
      { text: "جاري الاستخراج", score: 7 },
      { text: "لا", score: 0 },
    ]
  },
  {
    id: 5,
    text: "هل أنت مستعد للتقديم الآن؟",
    options: [
      { text: "نعم، فوراً", score: 10 },
      { text: "خلال شهر", score: 8 },
      { text: "أفكر فقط", score: 2 },
    ]
  }
];

export default function EligibilityQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (optionScore: number) => {
    const nextScore = score + optionScore;
    setScore(nextScore);
    
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const getResult = () => {
    if (score >= 55) return {
      title: "فرصتك ذهبية يا بطل! 🌟",
      desc: "أنت مرشح مثالي للمنح الدراسية. ملفك قوي جداً و'زابط'. ننصحك بالتقديم فوراً لضمان مقعدك قبل ما يطير.",
      color: "text-brand-gold",
      recommendations: ["منحة الحكومة الهندية (ICCR)", "منحة جامعة ترانسلفانيا", "منحة الحكومة الماليزية (MIS)"]
    };
    if (score >= 40) return {
      title: "فرصة قوية جداً! ✅",
      desc: "لديك فرصة كبيرة للقبول. نحتاج فقط لتجهيز ملفاتك باحترافية لرفع نسبة قبولك. 'ما تشيل هم' الإجراءات علينا.",
      color: "text-green-400",
      recommendations: ["منحة جامعة بخاري", "منحة الحكومة الرومانية"]
    };
    return {
      title: "تحتاج لبعض التجهيز ⏳",
      desc: "فرصتك موجودة، لكن نحتاج للعمل على تقوية ملفك الأكاديمي واللغوي قبل التقديم. 'زبط أمورك' معنا وبنوريك الطريق.",
      color: "text-yellow-400",
      recommendations: ["منحة الحكومة الرومانية"]
    };
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 rtl">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden border-brand-gold/10">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
          <motion.div 
            className="h-full bg-gradient-to-r from-brand-gold to-yellow-200 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
        
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-gold/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-accent/5 blur-3xl rounded-full pointer-events-none" />

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <span className="text-brand-gold font-bold text-sm">السؤال {currentStep + 1} من {QUESTIONS.length}</span>
                <Sparkles className="text-brand-gold w-5 h-5 animate-pulse" />
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                {QUESTIONS[currentStep].text}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {QUESTIONS[currentStep].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(opt.score)}
                    className="group flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-all text-right"
                  >
                    <span className="text-lg font-bold text-slate-200 group-hover:text-brand-gold">{opt.text}</span>
                    <div className="w-6 h-6 rounded-full border-2 border-white/20 group-hover:border-brand-gold flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-brand-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-10 h-10 text-brand-gold" />
              </div>

              <div className="space-y-4">
                <h2 className={`text-3xl md:text-4xl font-black ${getResult().color}`}>
                  {getResult().title}
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
                  {getResult().desc}
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-white font-bold">المنح المرشحة لك:</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {getResult().recommendations.map((rec, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-sm font-bold">
                      {rec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                <p className="text-brand-gold font-bold mb-6">تواصل معنا الآن لتحليل ملفك مجاناً وبدء التقديم</p>
                <a 
                  href="https://wa.me/249117734901" 
                  target="_blank"
                  className="btn-gold inline-flex items-center gap-3"
                >
                  تواصل عبر واتساب الآن
                  <ArrowLeft className="w-5 h-5" />
                </a>
              </div>
              
              <button 
                onClick={() => { setCurrentStep(0); setScore(0); setShowResult(false); }}
                className="text-slate-500 text-sm hover:text-brand-gold transition-colors"
              >
                إعادة الاختبار
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
