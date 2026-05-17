import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { useAuth } from './AuthContext';
import { saveQuizResult } from '../firebase';

import { SCHOLARSHIPS } from '../data/scholarships';

interface Question {
  id: number;
  text: string;
  field: string;
  options: { text: string; score: number; value: any }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "ما هو مستواك الأكاديمي الحالي؟",
    field: "level",
    options: [
      { text: "خريج ثانوي", score: 10, value: "Bachelor" },
      { text: "طالب جامعي", score: 8, value: "Bachelor" },
      { text: "خريج بكالوريوس", score: 10, value: "Master" },
      { text: "خريج ماجستير", score: 10, value: "PhD" },
    ]
  },
  {
    id: 2,
    text: "كم هو معدلك التراكمي (GPA) أو نسبتك المئوية؟",
    field: "gpa",
    options: [
      { text: "أكثر من 90% (ممتاز)", score: 25, value: 3.7 },
      { text: "80% - 90% (جيد جداً)", score: 15, value: 3.0 },
      { text: "70% - 80% (جيد)", score: 10, value: 2.5 },
      { text: "أقل من 70%", score: 5, value: 2.0 },
    ]
  },
  {
    id: 3,
    text: "ما هو جنسك؟ (بعض المنح مخصصة لفئات معينة)",
    field: "gender",
    options: [
      { text: "ذكر", score: 10, value: "male" },
      { text: "أنثى", score: 10, value: "female" },
    ]
  },
  {
    id: 4,
    text: "هل تمتلك شهادة لغة إنجليزية (IELTS/TOEFL)؟",
    field: "language",
    options: [
      { text: "نعم، جاهزة (6.5+)", score: 20, value: "expert" },
      { text: "نعم، جاهزة (5.5 - 6.0)", score: 15, value: "intermediate" },
      { text: "لا، لكن مستواي جيد", score: 10, value: "basic" },
      { text: "لا، وأحتاج لتطوير لغتي", score: 5, value: "none" },
    ]
  },
  {
    id: 5,
    text: "هل لديك جواز سفر ساري المفعول؟",
    field: "passport",
    options: [
      { text: "نعم، ساري", score: 10, value: true },
      { text: "جاري الاستخراج", score: 7, value: false },
      { text: "لا، منتهي", score: 3, value: false },
      { text: "لا أملك جواز", score: 0, value: false },
    ]
  },
  {
    id: 6,
    text: "هل لديك القدرة على تغطية تكاليف السفر؟",
    field: "budget",
    options: [
      { text: "نعم، بالكامل", score: 10, value: "full" },
      { text: "نعم، جزئياً", score: 7, value: "partial" },
      { text: "لا، أبحث عن منحة ممولة بالكامل", score: 5, value: "none" },
    ]
  }
];

export default function EligibilityQuiz() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleOptionSelect = (optionIndex: number, optionScore: number, optionValue: any) => {
    if (isTransitioning) return;
    
    setSelectedOption(optionIndex);
    setIsTransitioning(true);

    const field = QUESTIONS[currentStep].field;
    const nextAnswers = { ...userAnswers, [field]: optionValue, [`${field}_score`]: optionScore };
    setUserAnswers(nextAnswers);

    setTimeout(async () => {
      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep(currentStep + 1);
        setSelectedOption(null);
        setIsTransitioning(false);
      } else {
        const totalScore = Object.keys(nextAnswers)
          .filter(key => key.endsWith('_score'))
          .reduce((sum, key) => sum + nextAnswers[key], 0);
        
        setFinalScore(totalScore);
        setShowResult(true);
        setIsTransitioning(false);

        if (user) {
          setIsSaving(true);
          try {
            await saveQuizResult(user.uid, {
              score: totalScore,
              answers: nextAnswers,
              recommendations: getResult(totalScore).recommendations.map(r => r.title)
            });
          } catch (error) {
            console.error("Failed to save quiz result:", error);
          } finally {
            setIsSaving(false);
          }
        }
      }
    }, 600);
  };

  const getResult = (scoreValue?: number) => {
    const currentScore = scoreValue !== undefined ? scoreValue : finalScore;
    const maxScore = QUESTIONS.reduce((acc, q) => acc + Math.max(...q.options.map(o => o.score)), 0);
    const percentage = (currentScore / maxScore) * 100;
    
    // Logic for recommendation
    const recommended = SCHOLARSHIPS.filter(scholarship => {
      // Basic matching logic
      if (userAnswers.gender !== 'female' && scholarship.title.includes('خزر')) return false;
      if (userAnswers.gpa < 3.7 && scholarship.title.includes('خزر')) return false;
      if (userAnswers.level === 'Bachelor' && scholarship.level.includes('Master') && !scholarship.level.includes('Bachelor')) return false;
      return true;
    }).slice(0, 3);

    if (percentage >= 80) return {
      title: "أنت نجم ساطع! 🌟",
      desc: "ملفك الأكاديمي والشخصي مذهل. أنت تمتلك كل المقومات للمنافسة على أقوى المنح العالمية الممولة بالكامل.",
      color: "text-brand-gold",
      recommendations: recommended.length > 0 ? recommended : SCHOLARSHIPS.slice(0, 3)
    };
    if (percentage >= 60) return {
      title: "فرصة قوية جداً! ✅",
      desc: "لديك ملف جيد جداً وقابل للتطوير. ببعض التعديلات الاحترافية، ستكون منافساً شرساً.",
      color: "text-green-400",
      recommendations: recommended.length > 0 ? recommended : SCHOLARSHIPS.slice(0, 2)
    };
    return {
      title: "نحتاج للعمل على ملفك ⏳",
      desc: "ملفك يحتاج لبعض التطوير في جوانب اللغة أو المعدل أو الأنشطة. تواصل معنا لنضع لك خارطة طريق.",
      color: "text-yellow-400",
      recommendations: SCHOLARSHIPS.filter(s => s.country === 'ماليزيا' || s.country === 'العراق')
    };
  };

  const result = getResult();
  const whatsappMsg = encodeURIComponent(`السلام عليكم، لقد أكملت اختبار الأهلية في موقع لينجوتك وحصلت على نتيجة ${Math.round((finalScore / 85) * 100)}%.
أريد مناقشة المنح المرشحة لي وهي: ${result.recommendations.map(r => r.title).join('، ')}.
هل يمكنكم مساعدتي في بدء التجهيز؟`);

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
                    onClick={() => handleOptionSelect(i, opt.score, opt.value)}
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
                <h2 className={`text-3xl md:text-4xl font-black ${result.color}`}>
                  {result.title}
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
                  {result.desc}
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-white font-bold">المنح المرشحة لك:</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {result.recommendations.map((rec, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-sm font-bold">
                      {rec.title}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                {!user && (
                  <p className="text-slate-400 text-sm mb-4">سجل دخولك لحفظ هذه النتيجة في ملفك الشخصي</p>
                )}
                <p className="text-brand-gold font-bold mb-6">تواصل معنا الآن لتحليل ملفك مجاناً وبدء التقديم</p>
                <a 
                  href={`https://wa.me/249117734901?text=${whatsappMsg}`} 
                  target="_blank"
                  className="btn-gold inline-flex items-center gap-3"
                >
                  تواصل عبر واتساب الآن
                  <ArrowLeft className="w-5 h-5" />
                </a>
              </div>
              
              <button 
                onClick={() => { setCurrentStep(0); setFinalScore(0); setUserAnswers({}); setShowResult(false); }}
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
