import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, UserCheck, Languages, GraduationCap, ClipboardCheck, Briefcase, 
  ArrowRight, X, CheckCircle, Award, DollarSign, AppWindow, Send, Sparkles, MessageCircle 
} from 'lucide-react';

interface Service {
  title: string;
  desc: string;
  details: string;
  features: string[];
  examples: string[];
  pricing: string;
  icon: React.ReactNode;
  color: string;
}

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const services: Service[] = [
    {
      title: 'التقديم على المنح',
      desc: 'باقة تقديم متكاملة تغطي كافة المستندات والتراجم والتصديقات الرسمية مع التقديم الفعلي.',
      details: 'خدمة التقديم على المنح تشمل المراجعة الأكاديمية الكاملة، واختيار أفضل جامعات التخصص الملائمة لمؤهلاتك، ورفع الملفات وتعبئة استمارات القبول باحترافية تضمن القبول بنسبة تتجاوز 90%.',
      features: [
        'أرخص سعر تقديم متكامل للسودانيين',
        'شامل الترجمة والتصديق لكل الأوراق المطلوبة',
        'متابعة لجان الاختيار والفرز الأكاديمي',
        'تجهيز ملف متكامل وخالٍ من الأخطاء الإملائية والتقنية'
      ],
      examples: [
        'تقديم منحة تركيا الحكومية الكاملة',
        'تقديم منحة الحكومات والجامعات الماليزية',
        'التقديم على البوابات السعودية الموحدة'
      ],
      pricing: '٥٠,٠٠٠ جنيه سوداني فقط (شامل كل المتطلبات)',
      icon: <GraduationCap className="w-8 h-8 text-[#32D6FF]" />,
      color: 'from-[#1E90FF]/25 to-[#32D6FF]/10'
    },
    {
      title: 'تجهيز المستندات والأوراق',
      desc: 'تدقيق وتهيئة جميع شهاداتك وتراجمك الرسمية وخطابات التوصية لتقابل المعايير الدولية.',
      details: 'نقوم بغربلة وتجهيز ملفاتك الورقية لتبدو بأبهى شكل أكاديمي يقبله النظام العالمي للأرشفة الإلكترونية والفرز الأولي.',
      features: [
        'تعديل ملفات بصيغ PDF بجودة عالية جداً',
        'تظبيط التوصية من جهة الدكاترة والأساتذة',
        'فصل وتصنيف الشهادات والكرسات التخصصية'
      ],
      examples: [
        'تجهيز وتصديق شهادة ثانوية دولياً',
        'صياغة خطابات توصية احترافية مخصصة'
      ],
      pricing: 'مشمول بكود باقة التقديم الكاملة',
      icon: <ClipboardCheck className="w-8 h-8 text-[#FF8A00]" />,
      color: 'from-[#FF8A00]/25 to-[#FFA500]/10'
    },
    {
      title: 'كتابة السيرة الذاتية الأكاديمية (CV)',
      desc: 'صياغة سيرة ذاتية فريدة ذات معايير أكاديمية دولية (EuroPass) تبرز كفاءتك ومشاريعك التنموية.',
      details: 'أول ما تقع عليه أعين مقيمي لجان المنح العالمية هي سيرتك الذاتية. نصمم ونكتب لك CV أكاديمي ينطق بتميزك وخبرتك البحثية ويثبت تفوقك.',
      features: [
        'تصميم ذكي متوافق مع خوارزميات الفرز الآلي ATS',
        'لغة أكاديمية بليغة ومعبرة',
        'إضافة كافة الكورسات والنشاطات التطوعية واللاصفية'
      ],
      examples: [
        'سيرة ذاتية متوافقة مع نموذج يوروباس الأوروبي الشهير',
        'سيرة ذاتية تخصصية للمجالات الطبية والهندسية البرمجية'
      ],
      pricing: 'مشمول بالكامل في باقة الـ 50 الف',
      icon: <Briefcase className="w-8 h-8 text-[#32D6FF]" />,
      color: 'from-[#1E90FF]/20 to-[#32D6FF]/5'
    },
    {
      title: 'كتابة خطاب الدافع والتحفيز (Motivation Letter)',
      desc: 'خطاب بليغ وساحر يروي قصتك الطموحة وشغفك العلمي، ويقنع اللجان باختيارك دوناً عمن سواك.',
      details: 'خطاب التحفيز هو فرصتك الذهبية لتتكلم مباشرة مع المقيمين. نحن نكتب خطاباً ينبض بالطموح السوداني والتميز الأكاديمي، ليظهر قصة شخصيتك ونضالك الأكاديمي بكل قوة.',
      features: [
        'صياغة شخصية بالكامل تفاديًا للذكاء الاصطناعي والنسخ',
        'ترابط منطقي مذهل بين طموحات الطالب والمنهج الدراسي',
        'حجج تفوق علمي وبحثي مقنعة ومبهرة للغاية'
      ],
      examples: [
        'خطاب دافع لمنح الدراسات العليا باليابان وأوروبا',
        'رسالة تحفيزية ممتازة للبكالوريوس'
      ],
      pricing: 'صياغة حصرية مشمولة بالباقة الكاملة',
      icon: <FileText className="w-8 h-8 text-[#FF8A00]" />,
      color: 'from-[#FF8A00]/20 to-[#FFA500]/5'
    },
    {
      title: 'الترجمة الاحترافية والتصديقات',
      desc: 'ترجمة فورية معتمدة لكل الأوراق الأكاديمية والمستندات بأسلوب دقيق جداً خالٍ تماماً من الثغرات.',
      details: 'نترجم وثائق الطلاب وسجلاتهم الأكاديمية الرسمية من العربية أو الإنجليزية لتناسب لجان لغات المنح مع تصديق معتمد وخالٍ من الأخطاء وبأرقى صياغة قانونية.',
      features: [
        'مترجمين أكاديميين ذوي خبرات بالمنح العالمية',
        'ترجمة مصطلحات المواد الدراسية بدقة لضمان مكافأتها',
        'تسليم سريع وضمان عدم رفض أي ملف مترجم'
      ],
      examples: [
        'ترجمة شهادة ثانوية سودانية للإنجليزية والتركية',
        'ترجمة السجلات الأكاديمية للدراسات العليا'
      ],
      pricing: 'شامل ومجاني مع باقة الـ ٥٠ ألف كاملة',
      icon: <Languages className="w-8 h-8 text-[#32D6FF]" />,
      color: 'from-[#1E90FF]/25 to-[#32D6FF]/10'
    },
    {
      title: 'متابعة القبول والإجراءات',
      desc: 'تنسيق متواصل على مدار الساعة مع مكاتب القبول الدولية بالجامعات للضغط وضمان مقعدك.',
      details: 'لا نكتفي بتقديم الملف فحسب، بل نتابع بانتظام رسائل البريد الإلكتروني وخوادم الجامعات ونتراسل مع مكاتب العلاقات الدولية لتأكيد صحة التقديم والقبول.',
      features: [
        'متابعة لحظية ومستمرة لإيميل التقديم وخروجه للفرز',
        'دعم وتحديث الطالب طوال فترة انتظار قرار القبول',
        'تجهيز وتوجيه الطالب لمقابلات السفارة والتأشيرات'
      ],
      examples: [
        'تذكير وتواصل مستمر لجامعات ماليزيا وتركيا الخاصة',
        'متابعة مستجدات نتائج منح رومانيا وبوابة السعودية الدراسية'
      ],
      pricing: 'توجيه ومتابعة مشمولة بالتقديم الكامل',
      icon: <UserCheck className="w-8 h-8 text-[#FF8A00]" />,
      color: 'from-[#FF8A00]/25 to-[#FFA500]/10'
    }
  ];

  return (
    <div className="space-y-12 rtl text-right">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E90FF]/15 text-[#32D6FF] border border-[#1E90FF]/25 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> باقة تظبيط متكاملة
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
          خدماتنا <span className="gold-gradient">المستقبلية المتميزة</span>
        </h2>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed font-bold">
          نقدم لك حزم أكاديمية متكاملة لضمان مقعدك الأكاديمي الدولي بأقل رسوم وأوسع شمولية. باقتنا الكاملة هي الأرخص والأنضج في السودان.
        </p>
      </div>

      {/* Featured Pricing Hero Card */}
      <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border border-[#32D6FF]/35 bg-[#071B34]/80 p-6 md:p-10 shadow-2xl shadow-[#1E90FF]/15 text-center mt-6">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#32D6FF]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#FF8A00]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <span className="bg-[#FF8A00] text-deep-blue text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest leading-none">
            العرض الأقوى والأوفر للسودانيين 🇸🇩
          </span>
          <h3 className="text-2xl md:text-4xl font-black text-white">
            باقة التقديم الكاملة والشاملة للمستندات
          </h3>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            شاملة التقديم على المنحة وصياغة وتدقيق السيرة الذاتية (CV)، صياغة خطاب الدافع (Motivation Letter)، التراجم المعتمدة وتصديق ملفات الأوراق كاملة والتقديم من الألف للياء!
          </p>
          <div className="pt-2">
            <span className="text-4xl md:text-6xl font-black text-[#32D6FF] tracking-tight block">
              ٥٠,٠٠٠ <span className="text-sm md:text-lg text-slate-400 font-bold">جنيه سوداني فقط</span>
            </span>
          </div>
          <div className="pt-4">
            <a 
              href={`https://wa.me/249117734901?text=${encodeURIComponent('السلام عليكم فريق لينجوتك، أود الاشتراك الفوري في باقة التقديم الكاملة بمبلغ 50 ألف جنيه سوداني والبدء في تجهيز الأوراق والتقديم للمنح الدراسية.')}`}
              target="_blank"
              className="inline-flex items-center gap-3 btn-gold text-sm md:text-base px-10 py-4.5 rounded-2xl cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              اشترك الآن وقدم طوالي عبر الواتساب
            </a>
          </div>
        </div>
      </div>

      {/* Full Grid of Individual Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pt-8">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -8 }}
            onClick={() => setSelectedService(service)}
            className="glass-card p-6 md:p-8 cursor-pointer relative overflow-hidden group border-[#1E90FF]/15"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-3xl group-hover:bg-[#1E90FF]/10 transition-colors" />
            
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 border border-white/5`}>
              {service.icon}
            </div>

            <h3 className="text-xl font-black text-white mb-3 group-hover:text-[#32D6FF] transition-colors">
              {service.title}
            </h3>

            <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium mb-6">
              {service.desc}
            </p>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[#32D6FF] text-xs font-black">
              <span>عرض تفاصيل الخدمة</span>
              <ArrowRight className="w-4 h-4 text-[#32D6FF] group-hover:translate-x-1 transition-transform rotate-180" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Modal Overlay */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-[#030F1F]/95 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="relative w-full max-w-2xl glass-card p-6 sm:p-10 overflow-y-auto max-h-[85vh] text-right border-[#1E90FF]/30"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-6 left-6 p-2 rounded-full bg-white/5 text-slate-400 hover:text-[#32D6FF] border border-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {selectedService.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-1">{selectedService.title}</h3>
                  <div className="flex items-center gap-1.5 text-[#32D6FF] text-xs font-black">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>سعر الخدمة: {selectedService.pricing}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-sm">
                <div>
                  <h4 className="text-white font-black text-base mb-2">شرح تفصيلي</h4>
                  <p className="text-slate-300 leading-relaxed font-medium">
                    {selectedService.details}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-black text-base mb-3 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-[#32D6FF]" /> مميزات هذه الخدمة
                    </h4>
                    <ul className="space-y-2 text-xs md:text-sm">
                      {selectedService.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-slate-400 font-semibold p-2 bg-[#071B34]/30 rounded-lg">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#32D6FF] mt-1.5 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-black text-base mb-3 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#FF8A00]" /> أمثلة ونماذج تقديم نجحت
                    </h4>
                    <ul className="space-y-2 text-xs md:text-sm">
                      {selectedService.examples.map((exam, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-slate-400 font-semibold p-2 bg-[#071B34]/30 rounded-lg">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] mt-1.5 flex-shrink-0" />
                          <span>{exam}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-[#32D6FF] font-black">{selectedService.pricing}</span>
                  <a 
                    href={`https://wa.me/249117734901?text=${encodeURIComponent(`السلام عليكم فريق لينجوتك، أود الاستفسار والبدء فوراً في خدمة: ${selectedService.title}. السعر المحدد: ${selectedService.pricing}. هل يمكنكم شرح الخطوات لبدء التجهيز؟`)}`}
                    target="_blank"
                    className="w-full sm:w-auto btn-gold text-xs px-6 py-3 cursor-pointer"
                  >
                    اطلب الخدمة الآن عبر الواتساب
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
