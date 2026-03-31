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
      { text: "نعم، جاهزة (6.5+)", score: 15 },
      { text: "نعم، جاهزة (5.5 - 6.0)", score: 12 },
      { text: "لا، لكن مستواي جيد", score: 8 },
      { text: "لا، وأحتاج لتطوير لغتي", score: 3 },
    ]
  },
  {
    id: 4,
    text: "هل لديك جواز سفر ساري المفعول؟",
    options: [
      { text: "نعم، ساري", score: 10 },
      { text: "جاري الاستخراج", score: 7 },
      { text: "لا، منتهي", score: 3 },
      { text: "لا أملك جواز", score: 0 },
    ]
  },
  {
    id: 5,
    text: "ما هو تخصصك الدراسي المفضل؟",
    options: [
      { text: "علوم طبية وصحية", score: 10 },
      { text: "هندسة وتقنية معلومات", score: 10 },
      { text: "إدارة واقتصاد", score: 8 },
      { text: "علوم إنسانية ولغات", score: 8 },
    ]
  },
  {
    id: 6,
    text: "هل لديك خبرات تطوعية أو أنشطة لاصفية؟",
    options: [
      { text: "نعم، مشاركات دولية ومحلية", score: 15 },
      { text: "نعم، مشاركات محلية بسيطة", score: 10 },
      { text: "لا، أركز على الدراسة فقط", score: 5 },
    ]
  },
  {
    id: 7,
    text: "هل لديك أبحاث منشورة أو مشاريع مميزة؟",
    options: [
      { text: "نعم، بحث منشور دولياً", score: 15 },
      { text: "نعم، مشروع تخرج متميز", score: 10 },
      { text: "لا، ليس بعد", score: 5 },
    ]
  },
  {
    id: 8,
    text: "ما هي وجهتك الدراسية المفضلة؟",
    options: [
      { text: "أوروبا (ألمانيا، رومانيا، هنغاريا)", score: 10 },
      { text: "آسيا (الصين، ماليزيا، الهند)", score: 10 },
      { text: "أمريكا الشمالية / أستراليا", score: 12 },
      { text: "لا يهم، أبحث عن أي فرصة", score: 8 },
    ]
  },
  {
    id: 9,
    text: "هل لديك القدرة على تغطية تكاليف السفر؟",
    options: [
      { text: "نعم، بالكامل", score: 10 },
      { text: "نعم، جزئياً", score: 7 },
      { text: "لا، أبحث عن منحة ممولة بالكامل", score: 5 },
    ]
  },
  {
    id: 10,
    text: "هل أنت مستعد للبدء في تجهيز الأوراق الآن؟",
    options: [
      { text: "نعم، فوراً وبكل جدية", score: 10 },
      { text: "خلال الأسابيع القادمة", score: 8 },
      { text: "ما زلت أستكشف الخيارات", score: 2 },
    ]
  }
];

export default function EligibilityQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleOptionSelect = (optionIndex: number, optionScore: number) => {
    if (isTransitioning) return;
    
    setSelectedOption(optionIndex);
    setIsTransitioning(true);

    // Small delay for visual feedback
    setTimeout(() => {
      const nextAnswers = [...answers];
      nextAnswers[currentStep] = optionScore;
      setAnswers(nextAnswers);
      
      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep(currentStep + 1);
        setSelectedOption(null);
        setIsTransitioning(false);
      } else {
        const finalScore = nextAnswers.reduce((acc, curr) => acc + curr, 0);
        setScore(finalScore);
        setShowResult(true);
        setIsTransitioning(false);
      }
    }, 600);
  };

  const getResult = () => {
    const percentage = (score / 137) * 100; // Max score is around 137
    
    if (percentage >= 80) return {
      title: "أنت نجم ساطع! 🌟",
      desc: "ملفك الأكاديمي والشخصي مذهل. أنت تمتلك كل المقومات للمنافسة على أقوى المنح العالمية الممولة بالكامل. فرص قبولك تتجاوز الـ 90%.",
      color: "text-brand-gold",
      recommendations: ["منحة الحكومة الهندية (ICCR)", "منحة جامعة ترانسلفانيا", "منحة الحكومة الماليزية (MIS)", "منحة الحكومة الهنغارية (Stipendium Hungaricum)"]
    };
    if (percentage >= 60) return {
      title: "فرصة قوية جداً! ✅",
      desc: "لديك ملف جيد جداً وقابل للتطوير. ببعض التعديلات الاحترافية على السيرة الذاتية وخطاب النوايا، ستكون منافساً شرساً. 'ما تشيل هم' نحن بنظبط ليك الورق.",
      color: "text-green-400",
      recommendations: ["منحة جامعة بخاري", "منحة الحكومة الرومانية", "منحة الحكومة الصينية (CSC)"]
    };
    if (percentage >= 40) return {
      title: "بداية جيدة، ونحتاج لعمل! ⏳",
      desc: "لديك الأساسيات، لكن نحتاج للعمل على تقوية بعض الجوانب مثل اللغة أو الأنشطة التطوعية. لا تقلق، لدينا خطط تطويرية مخصصة لك.",
      color: "text-yellow-400",
      recommendations: ["منحة الحكومة الرومانية", "منح الجامعات الخاصة في ماليزيا"]
    };
    return {
      title: "تحتاج لبناء ملفك 🛠️",
      desc: "حالياً ملفك يحتاج للكثير من العمل ليكون مقبولاً في المنح التنافسية. ننصحك بالبدء في دورات لغة وتطوير مهاراتك. تواصل معنا لنضع لك خارطة طريق.",
      color: "text-red-400",
      recommendations: ["كورسات لغة إنجليزية مكثفة", "برامج تدريبية وتطوعية"]
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
                <div className="flex items-center gap-4">
                  {currentStep > 0 && (
                    <button 
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-brand-gold hover:border-brand-gold/50 transition-all"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  <span className="text-brand-gold font-bold text-sm">السؤال {currentStep + 1} من {QUESTIONS.length}</span>
                </div>
                <Sparkles className="text-brand-gold w-5 h-5 animate-pulse" />
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                {QUESTIONS[currentStep].text}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {QUESTIONS[currentStep].options.map((opt, i) => (
                  <motion.button
                    key={i}
                    whileHover={!isTransitioning ? { scale: 1.02 } : {}}
                    whileTap={!isTransitioning ? { scale: 0.98 } : {}}
                    onClick={() => handleOptionSelect(i, opt.score)}
                    disabled={isTransitioning}
                    className={`group flex items-center justify-between p-5 rounded-2xl border transition-all text-right ${
                      selectedOption === i 
                        ? 'border-brand-gold bg-brand-gold/10 shadow-[0_0_15px_rgba(255,215,0,0.2)]' 
                        : 'bg-white/5 border-white/10 hover:border-brand-gold/50 hover:bg-brand-gold/5'
                    } ${isTransitioning && selectedOption !== i ? 'opacity-50 grayscale-[0.5]' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <AnimatePresence>
                        {selectedOption === i && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-brand-gold"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <span className={`text-lg font-bold transition-colors ${
                        selectedOption === i ? 'text-brand-gold' : 'text-slate-200 group-hover:text-brand-gold'
                      }`}>
                        {opt.text}
                      </span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedOption === i ? 'border-brand-gold' : 'border-white/20 group-hover:border-brand-gold'
                    }`}>
                      <div className={`w-2 h-2 rounded-full bg-brand-gold transition-all ${
                        selectedOption === i ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'
                      }`} />
                    </div>
                  </motion.button>
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
                onClick={() => { setCurrentStep(0); setScore(0); setAnswers([]); setShowResult(false); }}
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
