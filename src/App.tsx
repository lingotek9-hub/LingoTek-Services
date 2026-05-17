import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, MessageCircle, ArrowRight, ShieldCheck, Info, MapPin, Phone, Mail, Users, Menu, X, Sparkles, Facebook, Send, MessageSquare, LogIn, User as UserIcon } from 'lucide-react';
import ScholarshipGrid from './components/ScholarshipGrid';
import EligibilityQuiz from './components/EligibilityQuiz';
import ServicesSection from './components/ServicesSection';
import { AuthProvider, useAuth } from './components/AuthContext';
import { loginWithGoogle } from './firebase';
import UserProfile from './components/UserProfile';
import LingoAssistant from './components/LingoAssistant';

type View = 'home' | 'services' | 'scholarships' | 'quiz' | 'assistant';

function UserNav() {
  const { user, loading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (loading) return <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />;

  if (!user) {
    return (
      <button 
        onClick={loginWithGoogle}
        className="flex items-center gap-2 py-2.5 px-5 text-sm font-bold text-white hover:text-brand-gold transition-colors border border-white/10 rounded-xl hover:border-brand-gold/50"
      >
        <LogIn className="w-4 h-4" />
        <span>دخول</span>
      </button>
    );
  }

  return (
    <>
      <button 
        onClick={() => setIsProfileOpen(true)}
        className="relative group"
      >
        <div className="w-10 h-10 rounded-full border-2 border-brand-gold/30 group-hover:border-brand-gold transition-all overflow-hidden">
          <img 
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
            alt={user.displayName || ''} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-brand-deep rounded-full" />
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

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'services', label: 'خدماتنا' },
    { id: 'scholarships', label: 'المنح' },
    { id: 'quiz', label: 'اختبر أهليتك' },
    { id: 'assistant', label: 'المساعد الذكي', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col cosmic-gradient font-cairo selection:bg-brand-gold selection:text-brand-deep">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-brand-deep/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            <button 
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-4 text-right"
            >
              <div className="flex flex-col rtl">
                <span className="text-2xl md:text-3xl font-black tracking-tighter leading-none text-brand-gold">لينجوتك</span>
                <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-brand-gold/60">LingoTek Services</span>
              </div>
            </button>
            
            <div className="hidden lg:flex items-center gap-8 text-sm font-black rtl text-slate-300">
              {navLinks.map(link => (
                <button 
                  key={link.id}
                  onClick={() => setCurrentView(link.id as View)}
                  className={`hover:text-brand-gold transition-colors flex items-center gap-2 ${currentView === link.id ? 'text-brand-gold border-b-2 border-brand-gold' : ''}`}
                >
                  {link.label}
                  {link.icon}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <UserNav />
              <button 
                onClick={() => setCurrentView('assistant')}
                className="hidden sm:flex btn-gold items-center gap-2 py-2.5 px-5 text-sm"
              >
                <Sparkles className="w-5 h-5" />
                <span>اسأل لينغو</span>
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-white p-2"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 w-full bg-brand-deep border-b border-white/10 p-6 space-y-6 shadow-2xl rtl text-right"
            >
              {navLinks.map(link => (
                <button 
                  key={link.id}
                  onClick={() => { setCurrentView(link.id as View); setIsMenuOpen(false); }}
                  className={`block w-full text-right text-lg font-bold ${currentView === link.id ? 'text-brand-gold' : 'text-white'}`}
                >
                  {link.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1 mt-20 md:mt-24">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Hero Section */}
              <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-brand-accent/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                  <motion.div>
                    <span className="inline-block px-4 py-1.5 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] md:text-xs font-black tracking-widest uppercase mb-6 md:mb-8 border border-brand-gold/20">
                      الخيار الأول للطلاب السودانيين 🇸🇩
                    </span>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 md:mb-10 leading-[1.1] tracking-tight text-white">
                      حلمك بالدراسة برا <br />
                      <span className="gold-gradient">بقى حقيقة مع LingoTek</span>
                    </h1>
                    <p className="text-base md:text-xl max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed rtl font-medium text-slate-400 px-4">
                      بنساعدك تلاقي المنحة المناسبة، نجهز ليك ورقك باحترافية، ونضمن ليك أفضل فرصة قبول. ما تشيل هم الإجراءات، نحن معاك خطوة بخطوة.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4">
                      <button onClick={() => setCurrentView('quiz')} className="w-full sm:w-auto btn-gold text-base md:text-lg px-8 md:px-12 py-4 md:py-5">
                        ابدأ اختبار الأهلية
                      </button>
                      <button onClick={() => setCurrentView('assistant')} className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 md:px-12 py-4 md:py-5 rounded-2xl flex items-center justify-center gap-3 transition-all">
                        تكلم مع لينغو
                        <Sparkles className="w-5 h-5 text-brand-gold" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* About Us Section (Simplified in Home) */}
              <section className="py-20 md:py-24 relative overflow-hidden bg-brand-cosmic/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center rtl">
                    <div className="space-y-6 md:space-y-8 text-center md:text-right">
                      <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold">
                        <Info className="w-4 h-4" />
                        تعرف علينا أكثر
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black text-white">من نحن؟ <span className="text-brand-gold">LingoTek</span></h2>
                      <p className="text-slate-400 text-base md:text-lg leading-relaxed font-medium">
                        نحن منصة سودانية رائدة متخصصة في الخدمات الأكاديمية والمنح الدراسية. هدفنا الأساسي هو تذليل الصعاب أمام الطالب السوداني للوصول إلى أرقى الجامعات العالمية.
                      </p>
                      <div className="grid grid-cols-2 gap-4 md:gap-6">
                        <div className="p-6 md:p-8 glass-card border-brand-gold/10">
                          <h4 className="text-3xl md:text-4xl font-black text-brand-gold mb-1 md:mb-2">+500</h4>
                          <p className="text-xs md:text-sm font-bold text-slate-400">طالب تم قبولهم</p>
                        </div>
                        <div className="p-6 md:p-8 glass-card border-brand-gold/10">
                          <h4 className="text-3xl md:text-4xl font-black text-brand-gold mb-1 md:mb-2">+20</h4>
                          <p className="text-xs md:text-sm font-bold text-slate-400">دولة وجهة دراسية</p>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <img 
                          src="/src/assets/images/lingotek_team_image_1779004787301.png" 
                          alt="LingoTek Team" 
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {currentView === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-12"
            >
              <ServicesSection />
            </motion.div>
          )}

          {currentView === 'scholarships' && (
            <motion.div
              key="scholarships"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-12"
            >
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16 rtl">
                  <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 text-white">أحدث المنح الدراسية</h2>
                  <p className="text-slate-400 font-medium text-base md:text-lg px-4">فرص ذهبية تنتظرك في أفضل الجامعات العالمية</p>
                </div>
                <ScholarshipGrid />
              </section>
            </motion.div>
          )}

          {currentView === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12"
            >
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16 rtl">
                  <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 text-white">هل أنت مستعد للمنحة؟</h2>
                  <p className="text-slate-400 text-base md:text-lg px-4">جاوب على الأسئلة دي واعرف نسبة قبولك في المنح العالمية</p>
                </div>
                <EligibilityQuiz />
              </section>
            </motion.div>
          )}

          {currentView === 'assistant' && (
            <motion.div
              key="assistant"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12 px-4"
            >
              <div className="text-center mb-8 rtl">
                <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">المساعد الشخصي <span className="text-brand-gold">لينغو</span></h2>
                <p className="text-slate-400 text-lg">بجاوب ليك على أي سؤال وبوجهك للمنحة المناسبة</p>
              </div>
              <LingoAssistant />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating WhatsApp Button */}
        <motion.a
          href={`https://wa.me/249117734901?text=${encodeURIComponent('السلام عليكم فريق لينجوتك، أريد الاستفسار عن خدمات التقديم والمنح الدراسية المتاحة.')}`}
          target="_blank"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 border-4 border-white/20"
        >
          <MessageCircle className="w-8 h-8" />
        </motion.a>
      </main>

      {/* Footer */}
      <footer className="border-t pt-16 md:pt-20 pb-10 bg-brand-deep border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16 rtl text-right">
            <div className="space-y-6">
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-brand-gold">LingoTek</span>
                <span className="text-[10px] font-bold text-brand-gold/60 tracking-widest uppercase">Academic Advisor</span>
              </div>
              <p className="text-sm md:text-base leading-relaxed text-slate-400 font-bold">
                المنصة السودانية الأولى المتخصصة في الاستشارات الأكاديمية والمنح الدراسية العالمية. شريكك الأكاديمي الموثوق للوصول إلى العالمية.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="font-black text-lg text-white">روابط سريعة</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-brand-gold transition-colors">الرئيسية</a></li>
                <li><a href="#about" className="hover:text-brand-gold transition-colors">من نحن</a></li>
                <li><a href="#services" className="hover:text-brand-gold transition-colors">خدماتنا</a></li>
                <li><a href="#scholarships" className="hover:text-brand-gold transition-colors">المنح الدراسية</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-black text-lg text-white">تواصل معنا</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-brand-gold" /> 249117734901+</li>
                <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-brand-gold" /> lingotek9@gmail.com</li>
                <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-brand-gold" /> الخرطوم، السودان</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-black text-lg text-white">اشترك في النشرة</h4>
              <p className="text-xs text-slate-500">احصل على أحدث المنح فور صدورها</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="بريدك الإلكتروني" 
                  className="border rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-gold/50 bg-white/5 border-white/20 text-white transition-all" 
                />
                <button className="bg-brand-gold text-brand-deep p-3 rounded-xl hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-gold/20">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-xs font-medium">© 2026 LingoTek للخدمات الأكاديمية - جميع الحقوق محفوظة</p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="https://www.facebook.com/profile.php?id=100089440483332&mibextid=kFxxJD" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-brand-gold transition-colors" title="فيسبوك">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://t.me/LingoTek" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-brand-gold transition-colors" title="تلغرام">
                <Send className="w-6 h-6" />
              </a>
              <a href="https://whatsapp.com/channel/0029Vakd0piCnA7s2hnb6Y0i" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-brand-gold transition-colors" title="قناة الواتساب">
                <MessageCircle className="w-6 h-6" />
              </a>
              <a href="https://chat.whatsapp.com/J7kr6m4NKE20wtMRRUkeeS" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-brand-gold transition-colors" title="قروب الواتساب 1">
                <MessageSquare className="w-6 h-6" />
              </a>
              <a href="https://chat.whatsapp.com/L08thRYeDQ2EjtAErUyvPi" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-brand-gold transition-colors" title="قروب الواتساب 2">
                <MessageSquare className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
