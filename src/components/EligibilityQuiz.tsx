import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Trophy, Sparkles, Download, Printer } from 'lucide-react';
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
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const handleOptionSelect = (optionIndex: number, optionScore: number, optionValue: any) => {
    if (isTransitioning) return;
    
    setSelectedOption(optionIndex);
    setIsTransitioning(true);

    const field = QUESTIONS[currentStep].field;
    const nextAnswers = { 
      ...userAnswers, 
      [field]: optionValue, 
      [`${field}_score`]: optionScore,
      [`${field}_text`]: QUESTIONS[currentStep].options[optionIndex].text
    };
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

  const handleDownloadPDF = () => {
    setShowPrintPreview(true);
  };

  const maxScore = QUESTIONS.reduce((acc, q) => acc + Math.max(...q.options.map(o => o.score)), 0);
  const percentage = Math.round((finalScore / maxScore) * 100);
  const applicantName = user?.displayName || 'مستفيد منصة لينجوتك';
  const applicantEmail = user?.email || '-';
  const formattedDate = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const getAnswerText = (field: string) => {
    if (userAnswers[`${field}_text`]) {
      return userAnswers[`${field}_text`];
    }
    const val = userAnswers[field];
    const question = QUESTIONS.find(q => q.field === field);
    if (!question) return String(val ?? 'غير محدد');
    if (field === 'passport') {
      return val ? 'نعم، ساري' : 'لا / غير متاح';
    }
    const opt = question.options.find(o => o.value === val);
    return opt ? opt.text : String(val ?? 'غير محدد');
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 rtl">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden border-brand-gold/10 no-print">
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
                      className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-brand-gold hover:border-brand-gold/50 transition-all cursor-pointer"
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
                    className={`group flex items-center justify-between p-5 rounded-2xl border transition-all text-right cursor-pointer ${
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

              <div className="pt-8 border-t border-white/10 space-y-6">
                {!user && (
                    <p className="text-slate-400 text-sm mb-2">سجل دخولك لحفظ هذه النتيجة في ملفك الشخصي</p>
                )}
                <p className="text-brand-gold font-bold mb-4">تواصل معنا الآن لتحليل ملفك مجاناً وبدء التقديم</p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a 
                    href={`https://wa.me/249117734901?text=${whatsappMsg}`} 
                    target="_blank"
                    className="btn-gold inline-flex items-center gap-3 w-full sm:w-auto justify-center"
                    rel="noreferrer"
                  >
                    تواصل عبر واتساب الآن
                    <ArrowLeft className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={handleDownloadPDF}
                    className="cursor-pointer inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-transparent border-2 border-brand-gold text-brand-gold font-bold hover:bg-brand-gold/10 transition-colors w-full sm:w-auto"
                  >
                    عرض النتيجة والطباعة (PDF)
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => { setCurrentStep(0); setFinalScore(0); setUserAnswers({}); setShowResult(false); }}
                className="text-slate-500 text-sm hover:text-brand-gold transition-colors cursor-pointer"
              >
                إعادة الاختبار
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Extreme Visual-Quality Academic PDF Report Preview Overlay (Compatible with iOS, Android & Desktop) */}
      {showPrintPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-md flex flex-col items-center p-4 md:p-8 no-print rtl">
          
          {/* Dashboard Control Sticky Panel (Only shown on screen, cleanly removed during print) */}
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between no-print shadow-2xl relative z-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-cyan/15 flex items-center justify-center border border-brand-cyan/25">
                <Printer className="w-6 h-6 text-[#32D6FF] animate-pulse" />
              </div>
              <div className="text-right">
                <h4 className="text-white font-black text-base">معاينة التقرير الأكاديمي الرقمي</h4>
                <p className="text-xs text-slate-400">انقر على زر الطباعة لحفظ التقرير كملف PDF ملون عالي الدقة</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => window.print()}
                className="cursor-pointer flex-1 sm:flex-initial bg-gradient-to-tr from-[#1E90FF] to-[#32D6FF] hover:brightness-110 text-white font-black px-6 py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                <span>حفظ وطباعة كـ PDF</span>
              </button>
              <button
                onClick={() => setShowPrintPreview(false)}
                className="cursor-pointer flex-1 sm:flex-initial bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-bold px-5 py-3 rounded-2xl transition-colors text-center"
              >
                إغلاق
              </button>
            </div>
          </div>

          {/* Golden border luxury document layout (Becomes primary print page with absolute zero layout shifts) */}
          <div className="print-content-wrapper w-full max-w-4xl bg-white text-slate-800 p-8 md:p-14 rounded-3xl shadow-2xl relative border-2 border-slate-200 overflow-visible">
            
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1E90FF] via-[#32D6FF] to-[#FF8A00] rounded-t-3xl print:rounded-none" />

            {/* Document Header block */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-slate-100 pb-6 mb-8 gap-4">
              <div className="text-right">
                <h1 className="text-2xl md:text-3xl font-black text-[#071B34] tracking-tight leading-none mb-1">
                  لينجوتك <span className="text-[#1E90FF]">LingoTek</span>
                </h1>
                <p className="text-[10px] font-black text-[#1E90FF] tracking-wider uppercase">بوابة المنح الأكاديمية والخدمات الشاملة</p>
              </div>
              <div className="bg-slate-100/90 text-slate-600 px-4 py-2.5 rounded-2xl text-xs font-bold border border-slate-200">
                رمز التحقق الدولي: <span className="font-mono font-bold text-slate-800">LT-{Math.floor(118500 + Math.random() * 880000)}</span>
              </div>
            </div>

            {/* Document Core Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-2">تقرير تقييم الأهلية وخارطة الطريق الأكاديمية</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Scholarship Eligibility Assessment & Matching Index</p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#32D6FF] to-[#1E90FF] mx-auto mt-4 rounded-full" />
            </div>

            {/* Student Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/70 border border-slate-100 rounded-2xl p-5 mb-8">
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[10px] font-bold text-slate-400">الاسم الكامل للمستفيد:</span>
                <span className="text-sm font-black text-slate-900">{applicantName}</span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[10px] font-bold text-slate-400">البريد الإلكتروني المعتمد:</span>
                <span className="text-sm font-bold text-slate-800 font-mono">{applicantEmail}</span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[10px] font-bold text-slate-400">تاريخ إصدار الفحص:</span>
                <span className="text-sm font-bold text-slate-900">{formattedDate}</span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[10px] font-bold text-slate-400">حالة الفحص والمصادقة:</span>
                <span className="text-xs font-black text-emerald-600 flex items-center justify-end gap-1">
                  <span>معتمد رقمياً ومصنف للأهلية الدولية</span>
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Beautiful Diagnostic Core Score Widget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-8 bg-gradient-to-b from-[#f0f7ff] to-white border-2 border-[#1E90FF]/25 p-6 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#32D6FF]/10 rounded-full blur-2xl pointer-events-none" />
              
              {/* Score Circular Badge */}
              <div className="flex flex-col items-center justify-center bg-white border border-[#1E90FF]/30 p-5 rounded-2xl md:col-span-1 shadow-md">
                <div className="w-24 h-24 rounded-full border-[6px] border-[#1E90FF] flex flex-col items-center justify-center shadow-inner">
                  <span className="text-3xl font-black text-[#1E90FF] leading-none">%{percentage}</span>
                  <p className="text-[9px] font-bold text-slate-400 mt-1">معدل التوافق</p>
                </div>
              </div>

              {/* Score Assessment review */}
              <div className="flex flex-col justify-center text-right md:col-span-2 space-y-2">
                <span className="text-[11px] font-black text-[#1E90FF] uppercase tracking-wider block bg-[#1E90FF]/10 px-3 py-1 rounded-lg w-max">
                  {result.title}
                </span>
                <h3 className="text-lg font-black text-slate-900">تشخيص المستشار الدراسي الذكي</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {result.desc}
                </p>
              </div>
            </div>

            {/* Core Criteria evaluation table */}
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2 justify-end">
              <span>تفاصيل مراجعة المعايير والمؤشرات الأكاديمية</span>
              <span className="w-1.5 h-6 bg-[#1E90FF] rounded-full inline-block" />
            </h3>
            
            <div className="overflow-hidden border border-slate-100 rounded-2xl mb-8">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 text-xs font-black text-slate-600">المعيار المطلوب للمنح</th>
                    <th className="p-4 text-xs font-black text-slate-600">بيانات ملفك المدخلة</th>
                    <th className="p-4 text-xs font-black text-slate-600 text-left">قوة القبول الممنوحة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr>
                    <td className="p-4 text-xs font-black text-slate-800">المستوى الأكاديمي الحالي</td>
                    <td className="p-4 text-xs text-slate-700 font-bold">{getAnswerText('level')}</td>
                    <td className="p-4 text-xs text-emerald-600 font-black text-left">+{userAnswers.level_score || 10} نقطة توافق</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-xs font-black text-slate-800">المعدل التراكمي (GPA)</td>
                    <td className="p-4 text-xs text-slate-700 font-bold">{getAnswerText('gpa')}</td>
                    <td className="p-4 text-xs text-emerald-600 font-black text-left">+{userAnswers.gpa_score || 0} نقطة توافق</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-xs font-black text-slate-800">جنس المتقدم</td>
                    <td className="p-4 text-xs text-slate-700 font-bold">{getAnswerText('gender')}</td>
                    <td className="p-4 text-xs text-emerald-600 font-black text-left">+{userAnswers.gender_score || 10} نقطة توافق</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-xs font-black text-slate-800">شهادة كفاءة الإنجليزية</td>
                    <td className="p-4 text-xs text-slate-700 font-bold">{getAnswerText('language')}</td>
                    <td className="p-4 text-xs text-emerald-600 font-black text-left">+{userAnswers.language_score || 0} نقطة توافق</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-xs font-black text-slate-800">جواز سفر ساري المفعول</td>
                    <td className="p-4 text-xs text-slate-700 font-bold">{getAnswerText('passport')}</td>
                    <td className="p-4 text-xs text-emerald-600 font-black text-left">+{userAnswers.passport_score || 0} نقطة توافق</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-xs font-black text-slate-800">القدرة المالية والتمويل للرحلة</td>
                    <td className="p-4 text-xs text-slate-700 font-bold">{getAnswerText('budget')}</td>
                    <td className="p-4 text-xs text-emerald-600 font-black text-left">+{userAnswers.budget_score || 0} نقطة توافق</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Targeted Recommended Scholarships Grid list */}
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2 justify-end">
              <span>توصيات المنح الدولية الأعلى توافقاً مع ملفك</span>
              <span className="w-1.5 h-6 bg-[#1E90FF] rounded-full inline-block" />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {result.recommendations.map((rec, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col text-right">
                  <h4 className="text-xs font-black text-slate-900 mb-3">{rec.title}</h4>
                  <div className="flex flex-wrap gap-2 justify-end mt-auto">
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[9px] font-extrabold border border-emerald-100">{rec.coverage}</span>
                    <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg text-[9px] font-extrabold border border-amber-100">{rec.level}</span>
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-[9px] font-extrabold border border-blue-100">{rec.country}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Credential Stamps and Validation Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-100 pt-8 mt-12 gap-6">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400">منصة لينجوتك للخدمات الأكاديمية والاستشارات للمنح العالمية</p>
                <p className="text-xs font-black text-slate-800 mt-1">وثيقة أهلية رقمية تلقائية معتمدة بالكامل بنظام لينجوتك الذكي</p>
              </div>
              <div className="flex items-center gap-4">
                {/* Official Stamp */}
                <div className="border-[3px] border-double border-[#1E90FF] text-[#1E90FF] font-black px-4 py-2.5 rounded-2xl rotate-[-4deg] opacity-90 text-center w-40 select-none">
                  <div className="text-[11px] uppercase tracking-widest font-black">LingoTek Verified</div>
                  <div className="text-[9px] font-black mt-0.5">جاهز للتقديم الدولي</div>
                </div>
              </div>
            </div>

            {/* Print copyright footer */}
            <div className="text-center text-[9px] text-slate-400 pt-8 mt-6 border-t border-slate-50">
              جميع الحقوق محفوظة © 2026 منصة لينجوتك للخدمات الأكاديمية والمنح العالمية.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
