import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Globe, MessageCircle, ArrowRight, ShieldCheck, Zap, Search, Info, MapPin, Phone, Mail, Users, CheckCircle, Menu, X, Bot, Sparkles, Facebook, Twitter, Instagram, CheckCircle2 } from 'lucide-react';
import AIChat from './components/AIChat';
import ScholarshipGrid from './components/ScholarshipGrid';
import EligibilityQuiz from './components/EligibilityQuiz';
import ServicesSection from './components/ServicesSection';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col cosmic-gradient font-cairo selection:bg-brand-gold selection:text-brand-deep">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-brand-deep/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            <div className="flex items-center gap-4">
              <div className="flex flex-col rtl">
                <span className="text-2xl md:text-3xl font-black tracking-tighter leading-none text-brand-gold">لينجوتك</span>
                <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-brand-gold/60">LingoTek Services</span>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-8 text-sm font-black rtl text-slate-300">
              <a href="#" className="hover:text-brand-gold transition-colors">الرئيسية</a>
              <a href="#about" className="hover:text-brand-gold transition-colors">من نحن</a>
              <a href="#services" className="hover:text-brand-gold transition-colors">خدماتنا</a>
              <a href="#scholarships" className="hover:text-brand-gold transition-colors">المنح</a>
              <a href="#quiz" className="hover:text-brand-gold transition-colors">اختبر أهليتك</a>
            </div>

            <div className="flex items-center gap-4">
              <a 
                href="https://wa.me/249117734901" 
                target="_blank"
                className="btn-gold flex items-center gap-2 py-2.5 px-5 text-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="hidden sm:inline">تواصل واتساب</span>
              </a>
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
              <a href="#" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-white">الرئيسية</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-white">من نحن</a>
              <a href="#services" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-white">خدماتنا</a>
              <a href="#scholarships" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-white">المنح</a>
              <a href="#quiz" onClick={() => setIsMenuOpen(false)} className="btn-gold block text-center py-3">اختبر أهليتك</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1">
        {/* Floating WhatsApp Button */}
        <motion.a
          href="https://wa.me/249117734901"
          target="_blank"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 border-4 border-white/20"
        >
          <MessageCircle className="w-8 h-8" />
          <span className="absolute -top-2 -left-2 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500"></span>
          </span>
        </motion.a>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-brand-accent/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
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
                <a href="#quiz" className="w-full sm:w-auto btn-gold text-base md:text-lg px-8 md:px-12 py-4 md:py-5">
                  ابدأ اختبار الأهلية
                </a>
                <a href="#advisor" className="w-full sm:w-auto border-2 border-brand-gold/30 text-brand-gold hover:bg-brand-gold/5 px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg transition-all">
                  استشارة ذكية فورية
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Eligibility Quiz Section */}
        <section id="quiz" className="py-20 md:py-24 relative overflow-hidden bg-brand-cosmic/20">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-gold/5 blur-[80px] rounded-full" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 md:mb-16 rtl">
              <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 text-white">هل أنت مستعد للمنحة؟</h2>
              <p className="text-slate-400 text-base md:text-lg px-4">جاوب على الأسئلة دي واعرف نسبة قبولك في المنح العالمية</p>
            </div>
            <EligibilityQuiz />
          </div>
        </section>

        {/* Services Section */}
        <ServicesSection />

        {/* Advisor Section */}
        <section id="advisor" className="py-20 md:py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_0%_50%,rgba(123,97,255,0.05),transparent)] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 md:gap-16 items-start">
              <div className="lg:col-span-2 space-y-6 md:space-y-8 rtl text-center lg:text-right">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-8 text-white">المستشار الأكاديمي <span className="text-brand-gold">الذكي</span></h2>
                  <p className="text-slate-400 leading-relaxed font-medium text-lg md:text-xl">
                    عندك أي سؤال عن المنح؟ اسأل مستشارنا الذكي وبوريك كل التفاصيل والفرص المتاحة ليك حالياً.
                  </p>
                </div>
                
                <div className="space-y-4 md:space-y-6">
                  {[
                    { icon: <Zap className="text-brand-gold" />, title: "دقة عالية", desc: "معلومات محدثة عن كافة المنح" },
                    { icon: <CheckCircle className="text-brand-gold" />, title: "توجيه سوداني", desc: "فاهمين وضع الطالب السوداني وتحدياته" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 md:gap-5 p-5 md:p-6 rounded-3xl border bg-white/5 border-white/10 hover:border-brand-gold/30 transition-colors text-right">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-black text-base md:text-lg text-white">{item.title}</h4>
                        <p className="text-xs md:text-sm text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-3 h-[500px] md:h-[600px]">
                <AIChat />
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-20 md:py-24 relative overflow-hidden bg-brand-cosmic/30">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-deep to-transparent pointer-events-none opacity-20" />
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
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="p-6 md:p-8 glass-card border-brand-gold/10"
                  >
                    <h4 className="text-3xl md:text-4xl font-black text-brand-gold mb-1 md:mb-2">+500</h4>
                    <p className="text-xs md:text-sm font-bold text-slate-400">طالب تم قبولهم</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="p-6 md:p-8 glass-card border-brand-gold/10"
                  >
                    <h4 className="text-3xl md:text-4xl font-black text-brand-gold mb-1 md:mb-2">+20</h4>
                    <p className="text-xs md:text-sm font-bold text-slate-400">دولة وجهة دراسية</p>
                  </motion.div>
                </div>
                <div className="p-6 md:p-8 glass-card border-brand-gold/10 flex items-center gap-4 md:gap-6 text-right">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-black mb-1 text-white">موثوقية تامة</h4>
                    <p className="text-xs md:text-sm text-slate-400">نحن مسجلون رسمياً ونعمل وفق معايير الجودة العالمية.</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-brand-gold/20 blur-3xl rounded-full animate-pulse" />
                <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <img 
                    src="https://picsum.photos/seed/lingotek-team/800/800" 
                    alt="LingoTek Team" 
                    className="w-full h-auto hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4 left-4 md:bottom-8 md:right-8 md:left-8 p-4 md:p-6 glass-card border-white/20">
                    <p className="text-white font-bold text-center text-sm md:text-base">نعمل بشغف لخدمة الطالب السوداني</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scholarships Section */}
        <section id="scholarships" className="py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16 rtl">
              <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 text-white">أحدث المنح الدراسية</h2>
              <p className="text-slate-400 font-medium text-base md:text-lg px-4">فرص ذهبية تنتظرك في أفضل الجامعات العالمية</p>
            </div>
            <ScholarshipGrid />
          </div>
        </section>
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
                <input type="email" placeholder="بريدك الإلكتروني" className="border rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:border-brand-gold bg-white/5 border-white/10 text-white" />
                <button className="bg-brand-gold text-brand-deep p-2 rounded-xl"><ArrowRight className="w-5 h-5" /></button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-xs font-medium">© 2026 LingoTek للخدمات الأكاديمية - جميع الحقوق محفوظة</p>
            <div className="flex gap-8">
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Users className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Info className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
