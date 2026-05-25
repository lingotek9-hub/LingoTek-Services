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

    const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>تقرير تقييم الأهلية للمنح الدراسية - LingoTek</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Cairo', 'Inter', sans-serif;
      direction: rtl;
      background-color: #ffffff;
      color: #1e293b;
      margin: 0;
      padding: 30px;
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      padding: 35px;
      position: relative;
      background: #fafcff;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
    }
    .header-border {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 8px;
      background: linear-gradient(90deg, #1E90FF, #32D6FF, #FFD700);
      border-top-left-radius: 14px;
      border-top-right-radius: 14px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }
    .logo-text {
      display: flex;
      flex-direction: column;
    }
    .logo-title {
      font-size: 20px;
      font-weight: 900;
      color: #0F2B48;
      line-height: 1;
      margin: 0 0 4px 0;
    }
    .logo-subtitle {
      font-size: 10px;
      font-weight: 700;
      color: #1E90FF;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0;
    }
    .report-badge {
      background-color: #f1f5f9;
      color: #334155;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: bold;
      border: 1px solid #e2e8f0;
    }
    .title-area {
      text-align: center;
      margin-bottom: 30px;
    }
    .title-area h1 {
      margin: 0 0 6px 0;
      font-size: 24px;
      font-weight: 900;
      color: #0f172a;
    }
    .title-area p {
      margin: 0;
      font-size: 13px;
      color: #64748b;
      font-weight: 600;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 25px;
      background: #ffffff;
      padding: 14px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .meta-label {
      font-size: 11px;
      color: #64748b;
      font-weight: bold;
    }
    .meta-value {
      font-size: 13px;
      color: #0f172a;
      font-weight: 700;
    }
    .score-section {
      display: flex;
      align-items: center;
      gap: 24px;
      background: linear-gradient(135deg, #f0f7ff, #e0f2fe);
      border: 1px solid #bae6fd;
      padding: 20px;
      border-radius: 14px;
      margin-bottom: 30px;
    }
    .score-circle {
      width: 85px;
      height: 85px;
      border-radius: 50%;
      background: #ffffff;
      border: 6px solid #1E90FF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(30,144,255,0.15);
      flex-shrink: 0;
    }
    .score-number {
      font-size: 22px;
      font-weight: 955;
      color: #1E90FF;
      line-height: 1;
    }
    .score-lbl {
      font-size: 9px;
      color: #64748b;
      font-weight: bold;
      margin-top: 2px;
    }
    .score-desc {
      flex: 1;
    }
    .score-title {
      font-size: 17px;
      font-weight: 900;
      color: #0c4a6e;
      margin: 0 0 4px 0;
    }
    .score-text {
      font-size: 12px;
      color: #334155;
      margin: 0;
      line-height: 1.5;
    }
    .section-title {
      font-size: 15px;
      font-weight: 900;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
      margin: 0 0 14px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 16px;
      background-color: #1E90FF;
      border-radius: 2px;
    }
    .table-container {
      margin-bottom: 30px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    th {
      background-color: #f8fafc;
      text-align: right;
      padding: 10px 14px;
      font-size: 11px;
      font-weight: bold;
      color: #475569;
      border-bottom: 2px solid #edf2f7;
    }
    td {
      padding: 10px 14px;
      font-size: 12px;
      color: #334155;
      border-bottom: 1px solid #f1f5f9;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .bold-value {
      font-weight: 700;
      color: #0f172a;
    }
    .badge-score {
      background-color: #f0fdf4;
      color: #16a34a;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: bold;
    }
    .scholarships-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 30px;
    }
    .scholarship-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 14px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.01);
    }
    .scholarship-title {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 6px 0;
    }
    .scholarship-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .scholarship-badge {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 6px;
      font-weight: bold;
    }
    .badge-blue { background-color: #eff6ff; color: #2563eb; }
    .badge-gold { background-color: #fffbeb; color: #d97706; }
    .badge-green { background-color: #f0fdf4; color: #16a34a; }
    
    .footer {
      border-top: 2px solid #f1f5f9;
      padding-top: 15px;
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
      margin-top: 30px;
    }
    .stamp-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }
    .stamp {
      border: 3px double #1E90FF;
      color: #1E90FF;
      font-size: 10px;
      font-weight: 900;
      padding: 4px 10px;
      border-radius: 6px;
      transform: rotate(-3deg);
      opacity: 0.8;
      text-align: center;
      width: 130px;
    }
    
    @media print {
      body {
        padding: 0;
        background-color: #fff;
      }
      .container {
        border: none;
        padding: 0;
        background: none;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-border"></div>
    <div class="header">
      <div class="logo-section">
        <div class="logo-text">
          <span class="logo-title">LingoTek - لينجوتك</span>
          <span class="logo-subtitle">Services Platform</span>
        </div>
      </div>
      <div class="report-badge">رمز التحقق: LT-${Math.floor(100000 + Math.random() * 900000)}</div>
    </div>

    <div class="title-area">
      <h1>تقرير تقييم الأهلية للمنح الدراسية العالمية</h1>
      <p>Scholarship Eligibility Assessment Report</p>
    </div>

    <div class="meta-grid">
      <div class="meta-item">
        <span class="meta-label">الاسم الكامل:</span>
        <span class="meta-value">${applicantName}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">البريد الإلكتروني:</span>
        <span class="meta-value" style="font-family: 'Inter', sans-serif;">${applicantEmail}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">تاريخ التقييم:</span>
        <span class="meta-value">${formattedDate}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">مزود التقديم:</span>
        <span class="meta-value">منصة لينجوتك للخدمات الأكاديمية</span>
      </div>
    </div>

    <div class="score-section">
      <div class="score-circle">
        <span class="score-number">%${percentage}</span>
        <span class="score-lbl">معدل الأهلية</span>
      </div>
      <div class="score-desc">
        <h3 class="score-title">${result.title}</h3>
        <p class="score-text">${result.desc}</p>
      </div>
    </div>

    <h2 class="section-title">بيانات الملف الشخصي والأكاديمي</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>المعيار الأكاديمي لشريكنا</th>
            <th>الجواب المختار</th>
            <th>نقاط القوة</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>المستوى الأكاديمي الحالي</td>
            <td class="bold-value">${getAnswerText('level')}</td>
            <td><span class="badge-score">+ ${userAnswers.level_score || 10} نقاط</span></td>
          </tr>
          <tr>
            <td>المعدل التراكمي (GPA)</td>
            <td class="bold-value">${getAnswerText('gpa')}</td>
            <td><span class="badge-score">+ ${userAnswers.gpa_score || 0} نقطة</span></td>
          </tr>
          <tr>
            <td>الجنس</td>
            <td class="bold-value">${getAnswerText('gender')}</td>
            <td><span class="badge-score">+ ${userAnswers.gender_score || 10} نقاط</span></td>
          </tr>
          <tr>
            <td>شهادة اللغة الإنجليزية (IELTS/TOEFL)</td>
            <td class="bold-value">${getAnswerText('language')}</td>
            <td><span class="badge-score">+ ${userAnswers.language_score || 0} نقطة</span></td>
          </tr>
          <tr>
            <td>جواز سفر ساري المفعول</td>
            <td class="bold-value">${getAnswerText('passport')}</td>
            <td><span class="badge-score">+ ${userAnswers.passport_score || 0} نقطة</span></td>
          </tr>
          <tr>
            <td>القدرة المالية وتغطية التكاليف</td>
            <td class="bold-value">${getAnswerText('budget')}</td>
            <td><span class="badge-score">+ ${userAnswers.budget_score || 0} نقطة</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 class="section-title">أقوى المنح الدراسية المرشحة لملفك</h2>
    <div class="scholarships-grid">
      ${result.recommendations.map(rec => `
        <div class="scholarship-card">
          <h3 class="scholarship-title">${rec.title}</h3>
          <div class="scholarship-meta">
            <span class="scholarship-badge badge-blue">${rec.country}</span>
            <span class="scholarship-badge badge-gold">${rec.level}</span>
            <span class="scholarship-badge badge-green">${rec.coverage}</span>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="stamp-container">
      <div>
        <p style="font-size: 11px; color: #64748b; margin: 0;">منصة لينجوتك الذكية للتقييم الأكاديمي</p>
        <p style="font-size: 12px; font-weight: bold; color: #0f172a; margin: 4px 0 0 0;">معتمد بالكامل رقمياً</p>
      </div>
      <div class="stamp">
        LingoTek Verified<br>جاهز للتقديم الدولي
      </div>
    </div>

    <div class="footer">
      <p>© 2026 منصة لينجوتك للخدمات الأكاديمية والمنح العالمية. جميع الحقوق محفوظة.</p>
    </div>
  </div>
</body>
</html>
    `;

    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'fixed';
    printIframe.style.right = '0';
    printIframe.style.bottom = '0';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = '0';
    document.body.appendChild(printIframe);

    const iframeDoc = printIframe.contentWindow?.document || printIframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      setTimeout(() => {
        printIframe.contentWindow?.focus();
        printIframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(printIframe);
        }, 1000);
      }, 1000);
    }
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
                  >
                    تواصل عبر واتساب الآن
                    <ArrowLeft className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={handleDownloadPDF}
                    className="cursor-pointer inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-transparent border-2 border-brand-gold text-brand-gold font-bold hover:bg-brand-gold/10 transition-colors w-full sm:w-auto"
                  >
                    تحميل النتيجة (PDF)
                    <Download className="w-5 h-5" />
                  </button>
                </div>
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
