import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Globe, Award, Calendar, ExternalLink, ChevronRight, X, CheckCircle, Info, Bookmark, BookmarkCheck, MessageCircle, Star } from 'lucide-react';
import { useAuth } from './AuthContext';
import { saveScholarship, deleteSavedScholarship, db, getScholarships } from '../firebase';
import { doc, onSnapshot, collection, addDoc } from 'firebase/firestore';
import { SCHOLARSHIPS } from '../data/scholarships';

const getIcon = (type: string) => {
  switch (type) {
    case 'globe': return <Globe className="w-5 h-5 text-[#32D6FF]" />;
    case 'award': return <Award className="w-5 h-5 text-[#FF8A00]" />;
    default: return <GraduationCap className="w-5 h-5 text-[#1E90FF]" />;
  }
};

interface Scholarship {
  id: string;
  title: string;
  country: string;
  level: string;
  deadline: string;
  coverage: string;
  type: string;
  description: string;
  requirements: string[];
  link: string;
}

const DYNAMIC_MOCKS: Record<string, Scholarship[]> = {
  'تركيا': [
    {
      id: 'mock-turkey-1',
      title: 'منحة الحكومة التركية (Türkiye Bursları)',
      country: 'تركيا',
      level: 'Bachelor, Master, PhD',
      deadline: '20 February 2027',
      coverage: 'Fully Funded (التمويل الكامل)',
      type: 'award',
      description: 'أقوى منحة حكومية تغطي كافة الرسوم الدراسية، السكن، التأمين الصحي، راتب شهري، وتذكرة الذهاب والإياب مع كورس لغة تركية مجاني لمدة سنة.',
      requirements: ['معدل شهادة ثانوية 70% للبكالوريوس و75% للدراسات العليا', 'عمر المتقدم أقل من 21 للبكالوريوس', 'التقديم إلكتروني بالكامل'],
      link: 'https://www.turkiyeburslari.gov.tr/'
    },
    {
      id: 'mock-turkey-2',
      title: 'منحة جامعة سابانجي الدولية',
      country: 'تركيا',
      level: 'Bachelor, Master, PhD',
      deadline: '30 May 2026',
      coverage: 'Fully/Partially Funded',
      type: 'graduation',
      description: 'منحة دراسية متميزة تقدمها واحدة من أفضل الجامعات الخاصة الرائدة في تركيا للطلاب الدوليين المتميزين أكاديمياً للتميز والابتكار في إسطنبول.',
      requirements: ['سجل أكاديمي ممتاز', 'شهادة لغة إنجليزية معتمدة (TOEFL / IELTS)', 'رسالتي توصية متميزتين'],
      link: 'https://www.sabanciuniv.edu/'
    }
  ],
  'ماليزيا': [
    {
      id: 'mock-malaysian-1',
      title: 'منحة الحكومة الماليزية (MIS)',
      country: 'ماليزيا',
      level: 'Master, PhD',
      deadline: '15 June 2026',
      coverage: 'Fully Funded',
      type: 'globe',
      description: 'منحة مرموقة برعاية الحكومة الماليزية لاستقطاب العقول الأكاديمية النيرة للدراسة في أفضل الجامعات الماليزية الحكومية والخاصة مع سكن وراتب ممتاز.',
      requirements: ['معدل تراكمي لا يقل عن 3.0 في البكالوريوس', 'شهادة إتقان اللغة الإنجليزية', 'مقترح بحثي متكامل للدراسات العليا'],
      link: 'https://biasiswa.mohe.gov.sa/'
    }
  ],
  'كازاخستان': [
    {
      id: 'mock-kazakh-1',
      title: 'منحة الحكومة الكازاخستانية للطلاب الدوليين',
      country: 'كازاخستان',
      level: 'Bachelor, Master, PhD',
      deadline: '30 June 2026',
      coverage: 'Fully Funded',
      type: 'graduation',
      description: 'فرصة رائعة تقدمها وزارة التعليم بكازاخستان للدراسة في الجامعات الكازاخستانية الكبرى مثل جامعة الفارابي الوطنية، شاملة الرسوم الدراسية وراتباً شهرياً.',
      requirements: ['شهادة أكاديمية معتمدة ومترجمة للروسية أو الإنجليزية', 'اجتياز الفحص الطبي بنجاح', 'مقابلة قبول أساسية عبر الإنترنت'],
      link: 'https://enic-kazakhstan.edu.kz/en/'
    }
  ],
  'رومانيا': [
    {
      id: 'mock-romania-1',
      title: 'منحة وزارة الخارجية الرومانية (MFA)',
      country: 'رومانيا',
      level: 'Bachelor, Master, PhD',
      deadline: '15 March 2027',
      coverage: 'Fully Funded',
      type: 'award',
      description: 'تقدم الحكومة الرومانية منحة سنوية شاملة للطلاب غير الأوروبيين للدراسة باللغة الرومانية (مع سنة تحضيرية مجانية لتعلم اللغة)، وتغطي الرسوم والسكن وراتباً.',
      requirements: ['سجل دراسي ممتاز ومصدق', 'لا يشترط شهادة لغة مسبقة', 'التقديم مفتوح لكافة الأعمار والتخصصات ما عدا الطب'],
      link: 'https://www.mae.ro/en/node/10251'
    }
  ],
  'العراق': [
    {
      id: 'mock-iraq-1',
      title: 'برنامج "ادرس في العراق" الحكومي العام',
      country: 'العراق',
      level: 'Bachelor, Master, PhD',
      deadline: '15 August 2026',
      coverage: 'Fully Funded (منحة كاملة)',
      type: 'globe',
      description: 'منحة متكاملة برعاية وزارة التعليم العالي والبحث العلمي العراقية تتيح للطلاب السودانيين الدراسة مجاناً في جامعات بغداد وبابل مع سكن مجاني وتسهيلات متميزة.',
      requirements: ['جواز سفر ساري المفعول', 'شهادات ثانوية أو بكالوريوس مصدقة من الخارجية والملحقية', 'تقرير طبي معتمد'],
      link: 'https://studyiniraq.scrd-gate.gov.iq/'
    }
  ],
  'السعودية': [
    {
      id: 'mock-saudi-general',
      title: 'منحة ادرس في السعودية (بوابة وزارة التعليم)',
      country: 'المملكة العربية السعودية',
      level: 'Bachelor, Master, PhD',
      deadline: '30 October 2026',
      coverage: 'Fully Funded',
      type: 'award',
      description: 'التقديم الموحد لولوج أرقى الجامعات السعودية الحكومية كجامعة الملك سعود وجامعة الملك عبد العزيز بتمويل كامل يشمل راتب شهري، سكن، تذاكر سنوية، ورعاية صحية شاملة.',
      requirements: ['العمر من 17 إلى 25 سنة للبكالوريوس', 'شهادة خلو من السوابق الجنائية وفحص طبي كامل', 'عدم الحصول على منحة من جهة أخرى بالمملكة'],
      link: 'https://studyinsaudi.moe.gov.sa/'
    }
  ]
};

export default function ScholarshipGrid() {
  const { user } = useAuth();
  const [dbScholarships, setDbScholarships] = useState<any[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<any | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('الكل');

  const categories = ['الكل', 'السعودية', 'تركيا', 'ماليزيا', 'كازاخستان', 'العراق', 'رومانيا'];

  useEffect(() => {
    const fetchAndSeed = async () => {
      try {
        let data = await getScholarships();
        if (data.length === 0) {
          data = SCHOLARSHIPS.map((s, idx) => ({ id: `seed-${idx}`, ...s }));
        }
        setDbScholarships(data);
      } catch (error) {
        console.error("Error in fetchAndSeed:", error);
        setDbScholarships(SCHOLARSHIPS.map((s, idx) => ({ id: `seed-${idx}`, ...s })));
      } finally {
        setLoading(false);
      }
    };

    fetchAndSeed();
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedIds(new Set());
      return;
    }

    const subUnsubscribe = onSnapshot(
      collection(db, 'users', user.uid, 'savedScholarships'),
      (snapshot) => {
        setSavedIds(new Set(snapshot.docs.map(doc => doc.id)));
      }
    );

    return () => subUnsubscribe();
  }, [user]);

  const toggleSave = async (e: React.MouseEvent, scholarship: any) => {
    e.stopPropagation();
    if (!user) {
      alert('الرجاء تسجيل الدخول أولاً لحفظ المنحة في مفضلتك الشخصية.');
      return;
    }

    if (savedIds.has(scholarship.id)) {
      await deleteSavedScholarship(user.uid, scholarship.id);
    } else {
      await saveScholarship(user.uid, scholarship);
    }
  };

  // Filter & Template Matching
  const getFilteredScholarships = () => {
    if (activeCategory === 'الكل') {
      return dbScholarships;
    }

    // Match based on category string
    const categoryLower = activeCategory.toLowerCase();
    const filtered = dbScholarships.filter(s => 
      s.country.toLowerCase().includes(categoryLower) || 
      (categoryLower === 'السعودية' && s.country.includes('سعودي'))
    );

    // If empty, return matching dynamic templates! This feels premium and always populated!
    if (filtered.length === 0 && DYNAMIC_MOCKS[activeCategory]) {
      return DYNAMIC_MOCKS[activeCategory];
    }

    return filtered;
  };

  const displayedScholarships = getFilteredScholarships();

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Categories Skeleton */}
        <div className="flex flex-wrap gap-3 justify-center">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-24 h-10 rounded-full bg-white/5 animate-pulse" />
          ))}
        </div>
        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card p-8 h-80 animate-pulse bg-white/5 border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Interactive Category Selector Badge Bar */}
      <div className="flex flex-wrap justify-center gap-3 rtl">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all duration-300 relative border ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-[#1E90FF] to-[#32D6FF] text-white border-transparent cyber-glow-cyan'
                : 'bg-[#071B34]/60 text-slate-400 border-[#1E90FF]/20 hover:text-white hover:border-[#32D6FF]/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {displayedScholarships.length === 0 ? (
        <div className="text-center py-16 glass-card max-w-lg mx-auto p-8 border-[#1E90FF]/15">
          <Info className="w-12 h-12 text-[#FF8A00] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">جاري العمل على تحديث فرص هذا القسم</h3>
          <p className="text-slate-400 text-sm">سيقوم فريق لينجوتك برفع أحدث المنح لهذه الوجهة قريباً جداً، تابعنا طوال الأسبوع.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 rtl text-right">
          {displayedScholarships.map((s, idx) => (
            <motion.div 
              key={s.id || `sch-${idx}`} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -8 }}
              className="glass-card p-6 md:p-8 hover:border-[#32D6FF]/50 transition-all group flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#32D6FF]/10 to-transparent pointer-events-none rounded-bl-3xl" />
              
              <button 
                onClick={(e) => toggleSave(e, s)}
                className="absolute top-6 left-6 z-20 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-[#32D6FF] hover:border-[#32D6FF]/50 transition-all"
                title="حفظ في المفضلة"
              >
                {savedIds.has(s.id) ? <BookmarkCheck className="w-5 h-5 text-[#32D6FF]" /> : <Bookmark className="w-5 h-5" />}
              </button>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#1E90FF]/10 flex items-center justify-center text-[#1E90FF] mb-6 group-hover:scale-110 group-hover:bg-[#1E90FF] group-hover:text-white transition-all duration-500 shadow-lg shadow-[#1E90FF]/5">
                  {getIcon(s.type)}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase text-[#32D6FF] tracking-wider px-2 py-0.5 rounded-md bg-[#32D6FF]/10 border border-[#32D6FF]/25">
                    {s.country}
                  </span>
                  <span className="text-[10px] font-black uppercase text-[#FF8A00] tracking-wider px-2 py-0.5 rounded-md bg-[#FF8A00]/10 border border-[#FF8A00]/25">
                    متاح التقديم
                  </span>
                </div>

                <h3 className="text-xl font-black text-white mb-4 leading-tight group-hover:text-[#32D6FF] transition-colors">{s.title}</h3>
                
                <div className="space-y-3.5 text-xs text-slate-400 font-bold">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#32D6FF]" />
                    </div>
                    <span>المستوى: {s.level}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                      <Calendar className="w-3.5 h-3.5 text-[#32D6FF]" />
                    </div>
                    <span>الموعد النهائي: {s.deadline}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-5 border-t border-white/5 flex flex-col gap-3.5 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-white bg-[#071B34] border border-[#1E90FF]/30 px-3 py-1.5 rounded-xl">
                    {s.coverage}
                  </span>
                  <button 
                    onClick={() => setSelectedScholarship(s)}
                    className="text-[#32D6FF] hover:text-white text-xs font-black flex items-center gap-1 transition-all group/btn"
                  >
                    عرض التفاصيل
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform rotate-180" />
                  </button>
                </div>

                <a 
                  href={`https://wa.me/249117734901?text=${encodeURIComponent(`السلام عليكم فريق لينجوتك، أرغب في التقديم السريع لمنحة: ${s.title} في ${s.country} عبر باقة التقديم الكاملة بمبلغ 50 ألف جنيه.`)}`}
                  target="_blank"
                  className="w-full py-2.5 rounded-xl bg-[#1E90FF]/15 border border-[#1E90FF]/30 text-[#32D6FF] text-xs font-black flex items-center justify-center gap-2 hover:bg-[#1E90FF] hover:text-white hover:border-[#1E90FF] transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  تقديم سريع عبر الواتساب (٥٠ ألف)
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Details Dialog / Modal */}
      <AnimatePresence>
        {selectedScholarship && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScholarship(null)}
              className="absolute inset-0 bg-[#030F1F]/95 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass-card p-6 sm:p-10 overflow-y-auto max-h-[85vh] border-[#1E90FF]/30 text-right rtl"
            >
              <button 
                onClick={() => setSelectedScholarship(null)}
                className="absolute top-6 left-6 text-slate-400 hover:text-[#32D6FF] transition-colors p-2 rounded-full bg-white/5 border border-white/5"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#1E90FF]/10 flex items-center justify-center text-[#1E90FF] border border-[#1E90FF]/20">
                    {getIcon(selectedScholarship.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">{selectedScholarship.title}</h2>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#32D6FF]/10 text-[#32D6FF] text-[10px] font-black border border-[#32D6FF]/20">
                        {selectedScholarship.country}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-white/5 text-slate-300 text-[10px] font-bold border border-white/5">
                        {selectedScholarship.coverage}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#32D6FF]">
                    <Info className="w-5 h-5" />
                    <h3 className="text-lg font-black">عن المنحة</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm font-medium">
                    {selectedScholarship.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#32D6FF]">
                    <CheckCircle className="w-5 h-5" />
                    <h3 className="text-lg font-black">المتطلبات الأساسية</h3>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedScholarship.requirements.map((req: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#071B34]/40 border border-[#1E90FF]/15">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] mt-1.5 flex-shrink-0" />
                        <span className="text-slate-300 text-xs font-semibold">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Calendar className="w-5 h-5 text-[#32D6FF]" />
                    <span className="text-xs font-bold">الموعد النهائي: {selectedScholarship.deadline}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {selectedScholarship.link && (
                      <a 
                        href={selectedScholarship.link} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs transition-all"
                      >
                        الموقع الرسمي
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <a 
                      href={`https://wa.me/249117734901?text=${encodeURIComponent(`السلام عليكم فريق لينجوتك، أرغب في التقديم لمنحة: ${selectedScholarship.title} في ${selectedScholarship.country} عبر باقة التقديم الكاملة بمبلغ 50 ألف جنيه.`)}`} 
                      target="_blank"
                      className="w-full sm:w-auto btn-gold flex items-center justify-center gap-2 text-xs"
                    >
                      قدم عبر لينجوتك (٥٠ ألف فقط)
                      <CheckCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
