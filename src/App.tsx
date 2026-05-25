import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, MessageCircle, ArrowRight, ShieldCheck, Info, MapPin, Phone, Mail, 
  Users, Menu, X, Sparkles, Facebook, Send, MessageSquare, LogIn, 
  User as UserIcon, Award, Laptop, Key, RefreshCw, SendHorizontal, 
  ExternalLink, Building, CheckCircle, Compass, CheckCircle2, ChevronLeft, Star 
} from 'lucide-react';
import ScholarshipGrid from './components/ScholarshipGrid';
import EligibilityQuiz from './components/EligibilityQuiz';
import ServicesSection from './components/ServicesSection';
import { AuthProvider, useAuth } from './components/AuthContext';
import { loginWithGoogle } from './firebase';
import UserProfile from './components/UserProfile';

type View = 'home' | 'scholarships' | 'services' | 'universities' | 'about' | 'contact' | 'quiz';

function UserNav() {
  const { user, loading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (loading) return <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse border border-[#1E90FF]/30" />;

  if (!user) {
    return (
      <button 
        onClick={loginWithGoogle}
        className="flex items-center gap-2 py-2 px-4 text-xs font-black text-white hover:text-[#32D6FF] transition-all border border-[#1E90FF]/20 rounded-xl bg-brand-cosmic/30 hover:border-[#32D6FF]/50 hover:scale-105 active:scale-95 shadow-md shadow-[#1E90FF]/5"
      >
        <LogIn className="w-3.5 h-3.5 text-[#32D6FF]" />
        <span>دخول الطلاب</span>
      </button>
    );
  }

  return (
    <>
      <button 
        onClick={() => setIsProfileOpen(true)}
        className="relative group transition-transform hover:scale-105"
      >
        <div className="w-10 h-10 rounded-full border-2 border-[#32D6FF]/40 group-hover:border-[#32D6FF] transition-all overflow-hidden bg-[#071B34]">
          <img 
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
            alt={user.displayName || ''} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-brand-deep rounded-full shadow-lg" />
      </button>
      <UserProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [activePartnerIndex, setActivePartnerIndex] = useState(0);

  const partners = [
    { name: 'Kuala Lumpur University', country: 'ماليزيا', logo: 'UKM' },
    { name: 'King Saud University', country: 'السعودية', logo: 'KSU' },
    { name: 'Istanbul University', country: 'تركيا', logo: 'IU' },
    { name: 'Bucharest University', country: 'رومانيا', logo: 'BU' },
    { name: 'Al-Farabi University', country: 'كازاخستان', logo: 'KazNU' },
    { name: 'Baghdad University', country: 'العراق', logo: 'UOB' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePartnerIndex((prev) => (prev + 1) % partners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'scholarships', label: 'المنح الدراسية' },
    { id: 'services', label: 'الخدمات الأكاديمية' },
    { id: 'universities', label: 'الجامعات الشريكة' },
    { id: 'about', label: 'من نحن' },
    { id: 'contact', label: 'تواصل معنا' },
  ];

  const handleStartNow = () => {
    setCurrentView('quiz');
  };

  return (
    <div className="min-h-screen flex flex-col cosmic-gradient font-cairo text-slate-100 selection:bg-[#32D6FF] selection:text-brand-deep overflow-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            
            {/* Logo on Right side in Arabic context */}
            <div className="flex items-center gap-3 order-1 lg:order-2">
              <button 
                onClick={() => setCurrentView('home')}
                className="flex items-center gap-3 text-right group cursor-pointer"
              >
                <div className="w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform overflow-visible relative">
                  <div className="absolute inset-1.5 bg-gradient-to-tr from-[#1E90FF]/30 to-[#32D6FF]/30 rounded-full blur-md" />
                  <img 
                    src="/src/assets/images/lingo_mascot_1779702808746.png" 
                    alt="LingoTek Mascot Logo" 
                    className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_8px_rgba(50,214,255,0.6)] animate-float"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col rtl text-right">
                  <span className="text-xl md:text-2.5xl font-black text-white group-hover:text-[#32D6FF] transition-colors leading-none mb-1">لينجوتك</span>
                  <span className="text-[8px] sm:text-[9px] font-black text-slate-400 tracking-wider">LingoTek Services Platform</span>
                </div>
              </button>
            </div>
            
            {/* Desktop Navigation links in Center */}
            <div className="hidden lg:flex items-center gap-6 text-sm font-black order-2 lg:order-1 rtl text-slate-300">
              {navLinks.map(link => (
                <button 
                  key={link.id}
                  onClick={() => setCurrentView(link.id as View)}
                  className={`py-1.5 px-3 rounded-lg hover:text-[#32D6FF] hover:bg-white/5 transition-all text-xs font-black relative ${
                    currentView === link.id 
                    ? 'text-[#32D6FF] bg-[#1E90FF]/10 border-b-2 border-[#32D6FF]' 
                    : ''
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Profile + CTA Actions Left Side */}
            <div className="flex items-center gap-3 order-3">
              <UserNav />
              <button 
                onClick={handleStartNow}
                className="hidden sm:inline-flex px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8A00] to-[#FFA500] text-xs font-black text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#FF8A00]/20 gap-1.5 items-center"
              >
                <Sparkles className="w-4 h-4" />
                <span>اختبر أهليتك مجاناً</span>
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-white p-2 hover:bg-white/5 rounded-xl transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden absolute top-full left-0 w-full bg-[#030F1F] border-b border-[#1E90FF]/25 p-6 space-y-4 shadow-2xl text-right rtl"
            >
              {navLinks.map(link => (
                <button 
                  key={link.id}
                  onClick={() => { setCurrentView(link.id as View); setIsMenuOpen(false); }}
                  className={`block w-full py-3 px-4 rounded-xl text-sm font-black text-right ${
                    currentView === link.id 
                      ? 'bg-[#1E90FF]/15 text-[#32D6FF] border-r-4 border-[#32D6FF]' 
                      : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={() => { setCurrentView('quiz'); setIsMenuOpen(false); }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF8A00] to-[#FFA500] text-xs font-black text-white text-center block shadow-lg"
                >
                  اختبار الأهلية الفوري
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MAIN LAYOUT */}
      <main className="flex-1 mt-20 md:mt-24">
        <AnimatePresence mode="wait">
          
          {/* HOME TAB */}
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16 py-8"
            >
              {/* HERO SECTION */}
              <section className="relative pt-6 pb-16 md:py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-right rtl">
                    
                    {/* Hero Left: Text Content */}
                    <div className="lg:col-span-7 space-y-6 md:space-y-8 z-10 text-center lg:text-right">
                      
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E90FF]/10 border border-[#1E90FF]/25 text-xs font-black text-[#32D6FF] tracking-wide"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#FF8A00]" />
                        <span>بوابتك نحو المنح العالمية</span>
                      </motion.div>

                      <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.2] tracking-tight">
                        ابدأ رحلتك الدراسية <br />
                        <span className="gold-gradient text-glow-cyan">مع LingoTek</span>
                      </h1>

                      <p className="text-sm md:text-lg text-slate-300 font-bold max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        منصة متكاملة للمنح الدراسية والخدمات الأكاديمية حول العالم. نجهز ملفك الأكاديمي، نصيغ مستنداتك باحترافية تامة، ونساعدك خطوة بخطوة للقبول برعاية طاقم خبير وبمبلغ رمزي 50 ألف جنيه سوداني فقط لكافة المستندات والرفع!
                      </p>

                      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                        <button 
                          onClick={() => setCurrentView('scholarships')} 
                          className="w-full sm:w-auto btn-gold px-10 py-5 text-sm md:text-base font-black flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Compass className="w-5 h-5" />
                          اكتشف المنح المتاحة
                        </button>
                        <button 
                          onClick={handleStartNow} 
                          className="w-full sm:w-auto btn-orange px-10 py-5 text-sm md:text-base font-black flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Sparkles className="w-5 h-5 animate-pulse" />
                          ابدأ الآن مجاناً
                        </button>
                      </div>

                      {/* Micro Statistics Indicators */}
                      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 max-w-md mx-auto lg:mx-0">
                        <div>
                          <p className="text-[#32D6FF] text-2xl md:text-3xl font-black">+٥٠٠٠</p>
                          <p className="text-xs text-slate-400 font-medium mt-1">طالب مسجل للتقديم</p>
                        </div>
                        <div>
                          <p className="text-[#FF8A00] text-2xl md:text-3xl font-black">+٣٠٠</p>
                          <p className="text-xs text-slate-400 font-medium mt-1">شراكات جامعية</p>
                        </div>
                        <div>
                          <p className="text-white text-2xl md:text-3xl font-black">+٥٠</p>
                          <p className="text-xs text-slate-400 font-medium mt-1">دولة ووجهة علمية</p>
                        </div>
                      </div>

                    </div>

                    {/* Hero Right: Interactive 3D Globe + Desktop Design Preview + 3D Lingo Mascot */}
                    <div className="lg:col-span-5 relative flex items-center justify-center h-[350px] sm:h-[450px] lg:h-[500px]">
                      
                      {/* Animated Cyber 3D Globe Elements */}
                      <div className="absolute inset-0 bg-radial-gradient from-[#1E90FF]/10 to-transparent rounded-full filter blur-3xl pointer-events-none" />
                      
                      {/* Spinning Ring Orbits (Cyber Globe representation) */}
                      <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full border border-[#1E90FF]/30 animate-spin" style={{ animationDuration: '20s' }} />
                      <div className="absolute w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] rounded-full border border-dashed border-[#32D6FF]/40 animate-reverse-spin" style={{ animationDuration: '15s' }} />
                      <div className="absolute w-[300px] h-[300px] sm:w-[410px] sm:h-[410px] rounded-full border border-[#FF8A00]/25 rotate-45" />

                      {/* Flying university badges icons floating */}
                      <div className="absolute top-10 right-6 sm:right-12 p-2 rounded-xl bg-[#071B34]/90 border border-[#32D6FF]/30 shadow-lg flex items-center gap-2 animate-bounce" style={{ animationDuration: '4s' }}>
                        <span className="text-xs">🇸🇩</span>
                        <span className="text-[10px] font-bold text-white">جامعة الخرطوم</span>
                      </div>
                      <div className="absolute bottom-16 left-6 sm:left-10 p-2 rounded-xl bg-[#071B34]/90 border border-[#FF8A00]/30 shadow-lg flex items-center gap-2 animate-bounce" style={{ animationDuration: '5s' }}>
                        <span className="text-xs">🇲🇾</span>
                        <span className="text-[10px] font-bold text-white">جامعة ماليزيا</span>
                      </div>
                      <div className="absolute top-1/2 left-0 p-2 rounded-xl bg-[#071B34]/90 border border-[#1E90FF]/30 shadow-lg flex items-center gap-2 animate-bounce" style={{ animationDuration: '6s' }}>
                        <span className="text-xs">🇹🇷</span>
                        <span className="text-[10px] font-bold text-white">منح تركيا</span>
                      </div>

                      {/* Flying Cartoon Airplane Travel lines */}
                      <svg className="absolute w-full h-full pointer-events-none z-10 opacity-70" viewBox="0 0 400 400">
                        <path d="M 50,300 Q 150,100 350,220" fill="transparent" stroke="#32D6FF" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                        <path d="M 300,50 Q 100,200 80,350" fill="transparent" stroke="#FF8A00" strokeWidth="1.5" strokeDasharray="8,4" />
                      </svg>

                      {/* Laptop Mockup container plus Mascot standing beside it */}
                      <div className="relative w-full max-w-[350px] sm:max-w-[420px] aspect-video glass-card border-[#32D6FF]/30 p-2 bg-[#030F1F]/60 shadow-2xl z-20 mt-12 sm:mt-20">
                        {/* Mockup screen */}
                        <div className="w-full h-full bg-[#071B34] rounded-2xl border border-white/5 overflow-hidden p-2 text-right relative font-mono text-[9px]">
                          <div className="flex justify-between items-center border-b border-white/5 pb-1 mb-1">
                            <span className="text-[#32D6FF]">LingoTek Portal v2.0</span>
                            <div className="flex gap-1">
                              <span className="w-2 h-2 rounded-full bg-red-500" />
                              <span className="w-2 h-2 rounded-full bg-orange-500" />
                              <span className="w-2 h-2 rounded-full bg-green-500" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-slate-400">{'>'} LOADING SCHOLARSHIPS_SDN</p>
                            <p className="text-[#32D6FF]">{'>'} 500+ STUDENTS PLACED SUCCESSFULLY</p>
                            <p className="text-emerald-400">{'>'} APPL_FEES: 50,000 SDG - FULL PACK</p>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#1E90FF] to-[#32D6FF] w-4/5" />
                            </div>
                          </div>
                        </div>

                        {/* Laptop base */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[110%] h-3 bg-[#030F1F] rounded-b-xl border border-t-0 border-[#32D6FF]/35" />

                        /* Mascot Image Rendered Beside */
                        <div className="absolute -top-28 -left-12 sm:-left-20 w-36 sm:w-48 h-36 sm:h-48 z-40 animate-float pointer-events-auto">
                          <img 
                            src="/src/assets/images/lingo_mascot_1779702808746.png" 
                            alt="Lingo Mascot" 
                            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(50,214,255,0.4)]"
                            title="لينغو - مستشار المنح الذكي"
                          />
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </section>

              {/* RECOGNIZED STEPS SECTION */}
              <section className="py-12 bg-[#071B34]/30 border-y border-[#1E90FF]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center rtl">
                  <h3 className="text-lg font-black text-white mb-8">خطواتك للتقديم الناجح من السودان لكافة بقاع العالم</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 glass-card border-[#1E90FF]/15 text-right space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1E90FF]/10 text-[#32D6FF] font-black flex items-center justify-center text-sm">١</div>
                      <h4 className="text-white font-black text-lg">اختبر أهليتك مجاناً</h4>
                      <p className="text-slate-400 text-xs leading-relaxed font-bold">بتحسب معدلك وتوثق ملفك وتعرف دول المنح المناسبة ليك في ثواني معدودة عبر حاسبة الأهلية.</p>
                    </div>
                    <div className="p-6 glass-card border-[#1E90FF]/15 text-right space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FF8A00]/10 text-[#FF8A00] font-black flex items-center justify-center text-sm">٢</div>
                      <h4 className="text-white font-black text-lg">سجل باقة الـ ٥٠ ألف</h4>
                      <p className="text-slate-400 text-xs leading-relaxed font-bold">رسوم رمزية شاملة تجهيز الـ CV، وترجمة الأوراق كاملة، وصياغة خطابات دافع حصرية باسمك وبدون نسخ.</p>
                    </div>
                    <div className="p-6 glass-card border-[#1E90FF]/15 text-right space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-[#32D6FF]/10 text-[#32D6FF] font-black flex items-center justify-center text-sm">٣</div>
                      <h4 className="text-white font-black text-lg">قدم طوالي واستلم قبولك</h4>
                      <p className="text-slate-400 text-xs leading-relaxed font-bold">فريقنا بيمسك الملف وبيرفع استمارات التقديم وبيتواصل مع العلاقات الخارجية للجامعات لتأكيد مقعدك.</p>
                    </div>
                  </div>
                </div>
              </section>

            </motion.div>
          )}

          {/* SCHOLARSHIPS TAB */}
          {currentView === 'scholarships' && (
            <motion.div
              key="scholarships"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12"
            >
              <div className="text-center max-w-2xl mx-auto space-y-4 rtl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E90FF]/15 text-[#32D6FF] border border-[#1E90FF]/25 text-xs font-black uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5" /> فرص ذهبية ممولة بالكامل
                </span >
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                  أحدث المنح لمختلف <span className="gold-gradient">المستويات الأكاديمية</span>
                </h2>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed font-bold">
                  منح حكومية وجامعية حصرية تم فرزها وتوثيقها لتوافق مؤهلات الطلاب وتضمن لهم إعفاءات كاملة من الرسوم المعيشية والدراسية والرحلات الجوية.
                </p>
              </div>

              <ScholarshipGrid />

              {/* Call to Quiz Banner in Scholarship tab */}
              <div className="glass-card p-6 sm:p-10 border-[#1E90FF]/25 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between text-right rtl gap-6 mt-16 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF8A00]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-black text-white">ماك متأكد من المنحة ومستواك ومؤهلاتك؟</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-bold max-w-xl">
                    جاوب على حاسبة الأهلية الذكية، ومستشارنا الفوري هيفلتر ليك المنح دي طوالي على حسب نسب نجاحك الأكاديمي الحقيقي ويوريك المناسبة ليك!
                  </p>
                </div>
                <button 
                  onClick={handleStartNow}
                  className="w-full md:w-auto btn-orange text-xs whitespace-nowrap cursor-pointer px-6 py-3.5"
                >
                  اختبر أهليتك الفورية
                </button>
              </div>
            </motion.div>
          )}

          {/* SERVICES TAB */}
          {currentView === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
            >
              <ServicesSection />
            </motion.div>
          )}

          {/* UNIVERSITIES PARTNER TAB */}
          {currentView === 'universities' && (
            <motion.div
              key="universities"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12"
            >
              <div className="text-center max-w-2xl mx-auto space-y-4 rtl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E90FF]/15 text-[#32D6FF] border border-[#1E90FF]/25 text-xs font-black uppercase tracking-wider">
                  <Building className="w-3.5 h-3.5" /> الجامعات المعتمدة دولياً
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                  الوجهات والجامعات <span className="gold-gradient">الشريكة</span>
                </h2>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed font-bold">
                  نوفر لك التقديم لجامعات مصنفة دولياً تضمن لك تعليماً عالي الجودة بشهادات رصينة في كفاءات الطب، الهندسة، إدارة الأعمال والعلوم الحديثة.
                </p>
              </div>

              {/* Slider Representation Box with Auto Rotate Animation */}
              <div className="p-6 md:p-10 glass-card border-[#1E90FF]/25 max-w-5xl mx-auto relative overflow-hidden text-center">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#1E90FF]/20 to-transparent pointer-events-none" />
                
                <h3 className="text-xs font-black text-[#32D6FF] uppercase tracking-widest mb-8">رواد ومصنفين ضمن الشراكات الدولية</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
                  {partners.map((partner, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        scale: activePartnerIndex === idx ? 1.08 : 0.95,
                        borderColor: activePartnerIndex === idx ? '#32D6FF' : 'rgba(30, 144, 255, 0.15)'
                      }}
                      className="p-4 rounded-2xl bg-[#071B34]/60 border border-[#1E90FF]/15 text-center flex flex-col justify-center items-center h-28 cursor-pointer relative transition-all duration-300 shadow-sm"
                    >
                      {activePartnerIndex === idx && (
                        <span className="absolute -top-2.5 bg-[#FF8A00] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase scale-85">
                          شريك نشط
                        </span>
                      )}
                      <span className="text-gradient text-xl font-black block text-[#32D6FF]">{partner.logo}</span>
                      <span className="text-[10px] text-white font-black block mt-2 whitespace-nowrap overflow-hidden text-ellipsis w-full">{partner.name}</span>
                      <span className="text-[8px] text-slate-400 font-bold block mt-1">{partner.country}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 3D Destination Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 rtl text-right">
                
                <div className="glass-card p-6 border-[#1E90FF]/15 relative overflow-hidden group hover:border-[#32D6FF]/55">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#1E90FF]" />
                  <span className="text-xs text-[#32D6FF] font-black block mb-2">🇹🇷 الوجهة التركية</span>
                  <h4 className="text-xl font-black text-white mb-2">الجامعات الخاصة والمنح التركية</h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-semibold mb-4">الدراسة باللغة الإنجليزية أو التركية في أرقى جامعات إسطنبول وأنقرة بتكاليف مدعومة وسكن مريح للطلاب السودانيين.</p>
                  <span className="text-[10px] text-slate-400 block border-t border-white/5 pt-3">الأكثر رغبة: الهندسة المعمارية والبرمجية</span>
                </div>

                <div className="glass-card p-6 border-[#1E90FF]/15 relative overflow-hidden group hover:border-[#32D6FF]/55">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#FF8A00]" />
                  <span className="text-xs text-[#FF8A00] font-black block mb-2">🇲🇾 الوجهة الماليزية</span>
                  <h4 className="text-xl font-black text-white mb-2">جامعات كوالالمبور وسلاغور</h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-semibold mb-4">تعليم بريطاني أو أمريكي متميز بقلب جنوب شرق آسيا. بيئة دراسية تكنولوجية كاملة تضمن لك التميز والابتكار.</p>
                  <span className="text-[10px] text-slate-400 block border-t border-white/5 pt-3">الأكثر رغبة: تكنولوجيا المعلومات وإدارة الأعمال</span>
                </div>

                <div className="glass-card p-6 border-[#1E90FF]/15 relative overflow-hidden group hover:border-[#32D6FF]/55">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#32D6FF]" />
                  <span className="text-xs text-[#32D6FF] font-black block mb-2">🇸🇦 الوجهة السعودية</span>
                  <h4 className="text-xl font-black text-white mb-2">منح جامعات المملكة العربية السعودية</h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-semibold mb-4">أرقى الجامعات المجهزة بأكبر الإمكانيات البحثية والطبية بالشرق الأوسط، شامل الراتب الشهري والسكن العائلي والسفر.</p>
                  <span className="text-[10px] text-slate-400 block border-t border-white/5 pt-3">الأكثر رغبة: الدراسات الإسلامية والطب</span>
                </div>

              </div>

            </motion.div>
          )}

          {/* ABOUT US TAB */}
          {currentView === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14"
            >
              <div className="text-center max-w-2xl mx-auto space-y-4 rtl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E90FF]/15 text-[#32D6FF] border border-[#1E90FF]/25 text-xs font-black uppercase tracking-wider">
                  <Info className="w-3.5 h-3.5" /> تعرف علينا وقابل طاقمنا
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                  من نحن؟ <span className="gold-gradient">LingoTek Services</span>
                </h2>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed font-bold">
                  نحن منصة استشارية سودانية كاملة، صممت بأرقى معايير EdTech العالمية للوقوف بجانب الطالب السوداني وتيسير سفره وتحصيله العلمي وبناء مساره الأكاديمي.
                </p>
              </div>

              {/* Statistics section with animated counters style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
                <div className="p-8 rounded-3xl bg-[#071B34]/60 border border-[#1E90FF]/25 shadow-xl hover:border-[#32D6FF]/50 transition-colors">
                  <h4 className="text-4xl md:text-5xl font-black text-[#32D6FF]">+٥٠٠٠</h4>
                  <p className="text-xs text-slate-400 font-black tracking-widest uppercase mt-2">طالب تمت توجيههم</p>
                </div>
                <div className="p-8 rounded-3xl bg-[#071B34]/60 border border-[#1E90FF]/25 shadow-xl hover:border-[#32D6FF]/50 transition-colors">
                  <h4 className="text-4xl md:text-5xl font-black text-[#FF8A00]">+٣٠٠</h4>
                  <p className="text-xs text-slate-400 font-black tracking-widest uppercase mt-2">جامعة شريكة معتمدة</p>
                </div>
                <div className="p-8 rounded-3xl bg-[#071B34]/60 border border-[#1E90FF]/25 shadow-xl hover:border-[#32D6FF]/50 transition-colors">
                  <h4 className="text-4xl md:text-5xl font-black text-white">+٥٠</h4>
                  <p className="text-xs text-slate-400 font-black tracking-widest uppercase mt-2">دولة ووجهة دراسية</p>
                </div>
                <div className="p-8 rounded-3xl bg-[#071B34]/60 border border-[#1E90FF]/25 shadow-xl hover:border-[#32D6FF]/50 transition-colors">
                  <h4 className="text-4xl md:text-5xl font-black text-[#32D6FF]">+١٠٠٠</h4>
                  <p className="text-xs text-slate-400 font-black tracking-widest uppercase mt-2">منحة متوفرة سنوياً</p>
                </div>
              </div>

              {/* Mission and Core Value Blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto rtl text-right">
                <div className="p-8 rounded-3xl bg-[#071B34]/40 border border-[#1E90FF]/15 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1E90FF]/15 text-[#32D6FF] flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-white">رؤيتنا ورسالتنا</h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-bold">
                    تمكين الشباب السوداني وتذليل عقبات الترجمة والتمويل والقبول عبر صياغة بليغة ودراسة توجيهية علمية مبرهنة تفتح لهم آفاق الإبداع في كل دول العالم. كما نلتزم بالأسعار الرمزية التي تصب في مصلحة الطالب ماديًا.
                  </p>
                </div>
                <div className="p-8 rounded-3xl bg-[#071B34]/40 border border-[#1E90FF]/15 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/15 text-[#FF8A00] flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-white">النزاهة الأكاديمية</h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-bold">
                    نتبع أعلى معايير التدوين السير الذاتية وصياغة الطلبات بدون كتابة آلية منسوخة ومملة، حيث تراجع ملفات كل طالب يدوياً بواسطة مدققين أكاديميين حائزين على أعلى الشهادات لضمان الجودة الأكاديمية المطلقة.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* CONTACT TAB */}
          {currentView === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12"
            >
              <div className="text-center max-w-2xl mx-auto space-y-4 rtl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E90FF]/15 text-[#32D6FF] border border-[#1E90FF]/25 text-xs font-black uppercase tracking-wider">
                  <Phone className="w-3.5 h-3.5" /> تواصل مباشر على مدار الساعة
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                  نحن بانتظارك <span className="gold-gradient">للبدء طويلاً</span>
                </h2>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed font-bold">
                  تواصل معنا عبر تعبئة الاستمارة، أو راسلنا مباشرة عبر قنوات الواتساب والتلغرام المفتوحة للمساعدة الفورية.
                </p>
              </div>

              {/* Form & Info visual grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto text-right rtl">
                
                {/* Visual Direct info with simulated QR */}
                <div className="lg:col-span-5 p-6 md:p-8 glass-card border-[#1E90FF]/20 flex flex-col justify-between space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-[#32D6FF]/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-white">قنوات الاتصال المباشر</h3>
                    <p className="text-slate-400 text-xs font-bold leading-relaxed">تجد طاقم المهندسين والأكاديميين مستعدين فوراً لإجابة استفسارك بخصوص باقة التقديم وتنسيق مستندات السفر.</p>
                  </div>

                  <div className="space-y-4.5 font-bold text-xs text-slate-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                        <Phone className="w-4 h-4 text-[#32D6FF]" />
                      </div>
                      <span>الخط الساخن: 0117734901</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                        <Mail className="w-4 h-4 text-[#32D6FF]" />
                      </div>
                      <span>البريد الإلكتروني: lingotek9@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                        <Globe className="w-4 h-4 text-[#32D6FF]" />
                      </div>
                      <span>بوابة الويب: lingo-tek-services.vercel.app</span>
                    </div>
                  </div>

                  {/* QR Scan Simulation box */}
                  <div className="p-4 rounded-2xl bg-[#030F1F]/90 border border-[#1E90FF]/20 flex items-center gap-4">
                    {/* Simulated vector QR design */}
                    <div className="w-14 h-14 bg-white p-1 rounded-lg flex-shrink-0 relative overflow-hidden flex flex-wrap justify-between">
                      <div className="w-4 h-4 bg-black" />
                      <div className="w-4 h-4 bg-black" />
                      <div className="w-4 h-4 bg-black" />
                      <div className="w-3 h-3 bg-black mt-2" />
                      <div className="w-3 h-3 bg-black mt-2" />
                    </div>
                    <div>
                      <span className="text-white text-xs font-black block">مسح الـ QR للواتساب</span>
                      <span className="text-slate-500 text-[9px] font-bold block mt-0.5">امسح الكود ضوئياً للتواصل طوالي</span>
                    </div>
                  </div>

                </div>

                {/* Cyber interactive Form */}
                <form 
                  onSubmit={(e) => { e.preventDefault(); alert("أنشئت رسالتك بنجاح! سيتم تحويلك إلى الواتساب لبدء محادثة فورية مع فريق المبيعات والتقديم."); window.open(`https://wa.me/249117734901?text=${encodeURIComponent('السلام عليكم فريق لينجوتك، ملأت استمارة التقديم على المنح والخدمات وعندي رغبة قوية في البدء الفوري.')}`, '_blank'); }}
                  className="lg:col-span-7 p-6 md:p-8 glass-card border-[#1E90FF]/20 space-y-6"
                >
                  <h3 className="text-xl font-black text-white">استمارة التوجيه السريعة والتقديم</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 block">الاسم الكامل</label>
                      <input 
                        type="text" 
                        required
                        placeholder="أدخل اسمك الكريم" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#32D6FF] focus:border-[#32D6FF]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 block">رقم الواتساب الحالي</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+249..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white ltr text-left focus:outline-none focus:ring-1 focus:ring-[#32D6FF] focus:border-[#32D6FF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 block">الوجهة الدراسية المطلوبة</label>
                      <select className="w-full bg-[#071B34] border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#32D6FF]">
                        <option>كل الدول / غير محدد</option>
                        <option>المملكة العربية السعودية</option>
                        <option>تركيا</option>
                        <option>ماليزيا</option>
                        <option>كازاخستان</option>
                        <option>رومانيا</option>
                        <option>العراق</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 block">المعدل الدراسي التراكمي</label>
                      <input 
                        type="text" 
                        placeholder="مثال: 85% أو 3.6"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#32D6FF]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 block">رسالتك أو تخصصك ومستنداتك الجاهزة</label>
                    <textarea 
                      rows={4}
                      placeholder="اكتب هنا التخصص البترغب فيه أو استفسارك بخصوص التقديم..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#32D6FF]"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#1E90FF] to-[#32D6FF] font-black text-xs text-white flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1E90FF]/25 cursor-pointer"
                  >
                    <SendHorizontal className="w-4 h-4 rotate-180" />
                    <span>إرسال الطلب والتحويل للواتساب طوالي</span>
                  </button>
                </form>

              </div>
            </motion.div>
          )}

          {/* ELIGIBILITY QUIZ TAB */}
          {currentView === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
            >
              <div className="text-center mb-8 rtl">
                <span className="inline-flex items-center gap-1 bg-[#FF8A00]/15 text-[#FF8A00] border border-[#FF8A00]/25 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-3">
                  قياس ومطابقة في دقيقة واحدة
                </span>
                <h2 className="text-3xl md:text-5xl font-black mb-2 text-white">حاسبة ومستشار الأهلية للفوز بالمنح</h2>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto">أجب على المعايير البسيطة دي لنفهرس ليك حظوظك ومقعدك بين المنح العالمية المتاحة</p>
              </div>

              <div className="glass-card p-6 md:p-10 border-[#1E90FF]/25">
                <EligibilityQuiz />
              </div>

              <div className="text-center pt-8">
                <button 
                  onClick={() => setCurrentView('home')} 
                  className="text-xs text-slate-400 hover:text-[#32D6FF] transition-all font-bold flex items-center gap-1.5 mx-auto"
                >
                  <ChevronLeft className="w-4 h-4" />
                  الرجوع للرئيسية
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="border-t pt-16 md:pt-20 pb-10 bg-[#030F1F] border-[#1E90FF]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16 rtl text-right">
            
            <div className="space-y-5">
              <div className="flex items-center gap-3 justify-end md:justify-start">
                <div className="w-14 h-14 flex items-center justify-center overflow-visible relative">
                  <div className="absolute inset-1.5 bg-gradient-to-tr from-[#1E90FF]/25 to-[#32D6FF]/25 rounded-full blur-md" />
                  <img 
                    src="/src/assets/images/lingo_mascot_1779702808746.png" 
                    alt="LingoTek Mascot Logo" 
                    className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_8px_rgba(50,214,255,0.5)] animate-float"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xl md:text-2xl font-black text-white leading-none mb-1 text-glow-cyan">LingoTek</span>
                  <span className="text-[9px] font-black text-slate-400 tracking-wider">Services Platform</span>
                </div>
              </div>
              <p className="text-xs md:text-sm leading-relaxed text-slate-400 font-bold">
                المنصة السودانية الأولى المتخصصة بالكامل في تيسير ورق المنح وتقديم الاستشارات الأكاديمية العالمية للطلاب بأسعار ميسرة وخدمة احترافية.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-black text-sm text-white uppercase tracking-wider">أقسام المنصة العلمية</h4>
              <ul className="space-y-3.5 text-xs text-slate-400 font-bold">
                <li><button onClick={() => setCurrentView('home')} className="hover:text-[#32D6FF] transition-colors">الرئيسية</button></li>
                <li><button onClick={() => setCurrentView('scholarships')} className="hover:text-[#32D6FF] transition-colors">المنح الدراسية المتاحة</button></li>
                <li><button onClick={() => setCurrentView('services')} className="hover:text-[#32D6FF] transition-colors">خدمات كتابة المستندات والتجهيز</button></li>
                <li><button onClick={() => setCurrentView('universities')} className="hover:text-[#32D6FF] transition-colors">الجامعات والمصنفة دولياً</button></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-black text-sm text-white uppercase tracking-wider">تفاصيل الدعم والتواصل</h4>
              <ul className="space-y-3.5 text-xs text-slate-400 font-bold">
                <li className="flex items-center gap-2 lg:justify-start justify-end"><Phone className="w-3.5 h-3.5 text-[#32D6FF]" /> 0117734901</li>
                <li className="flex items-center gap-2 lg:justify-start justify-end"><Mail className="w-3.5 h-3.5 text-[#32D6FF]" /> lingotek9@gmail.com</li>
                <li className="flex items-center gap-2 lg:justify-start justify-end"><Globe className="w-3.5 h-3.5 text-[#32D6FF]" /> lingo-tek-services.vercel.app</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-black text-sm text-white uppercase tracking-wider">عن خدمات لينجوتك</h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">باقة المتطلبات الـ ٥٠ ألف جنيه تصمم وتصاغ خصيصاً على حسب شغفك الأكاديمي وخبراتك للتميز الفوري بالمنح الدراسية.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="سجل بريدك للأخبار" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#32D6FF]" 
                />
                <button 
                  onClick={() => alert("تم الاشتراك في بريد منح لينجوتك بنجاح! ستصلك الفرص أسبوعياً.")}
                  className="bg-[#1E90FF] text-white p-2.5 rounded-xl hover:bg-[#32D6FF] transition-colors shadow-lg"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>

          </div>

          <div className="border-t border-[#1E90FF]/15 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-semibold">
            <p className="text-slate-500 font-medium Order-2 md:order-1 text-center md:text-right">© 2026 LingoTek Services Platform - بوابتك نحو المنح العالمية. جميع الحقوق محفوظة</p>
            
            <div className="flex flex-wrap justify-center gap-5 order-1 md:order-2">
              <a href="https://www.facebook.com/profile.php?id=100089440483332&mibextid=kFxxJD" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#32D6FF] transition-all" title="فيسبوك">
                <Facebook className="w-5 h-5 filter hover:drop-shadow-[0_0_8px_rgba(50,214,255,0.6)]" />
              </a>
              <a href="https://t.me/LingoTek" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#32D6FF] transition-all" title="تلغرام">
                <Send className="w-5 h-5 filter hover:drop-shadow-[0_0_8px_rgba(50,214,255,0.6)]" />
              </a>
              <a href="https://whatsapp.com/channel/0029Vakd0piCnA7s2hnb6Y0i" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#32D6FF] transition-all" title="قناة الواتساب">
                <MessageCircle className="w-5 h-5 filter hover:drop-shadow-[0_0_8px_rgba(50,214,255,0.6)]" />
              </a>
              <a href="https://chat.whatsapp.com/J7kr6m4NKE20wtMRRUkeeS" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#32D6FF] transition-all" title="مجموعة تفاعل ١">
                <MessageSquare className="w-5 h-5 filter hover:drop-shadow-[0_0_8px_rgba(50,214,255,0.6)]" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
