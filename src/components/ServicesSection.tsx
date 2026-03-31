import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, UserCheck, Languages, GraduationCap, ClipboardCheck, Briefcase, ArrowRight, X, CheckCircle2, DollarSign, Lightbulb } from 'lucide-react';

const SERVICES = [
  {
    title: "كتابة خطابات الغرض من الدراسة (SOP)",
    desc: "نصيغ لك خطاباً مقنعاً يبرز نقاط قوتك ويجذب لجان القبول في أقوى الجامعات.",
    details: "خطاب الغرض من الدراسة هو فرصتك الوحيدة للتحدث مباشرة مع لجنة القبول. نحن نساعدك في صياغة خطاب يعكس شغفك، طموحاتك، وكيف تتماشى خلفيتك الأكاديمية مع البرنامج المختار.",
    features: [
      "كتابة احترافية من الصفر",
      "مراجعة لغوية دقيقة",
      "تخصيص لكل جامعة أو منحة",
      "استشارات لتحسين المحتوى"
    ],
    examples: ["نماذج ناجحة لمنح تركيا", "نماذج لمنح الحكومة الهنغارية", "نماذج لجامعات بريطانية"],
    pricing: "تبدأ من 25,000 جنيه سوداني",
    icon: <FileText className="w-8 h-8" />,
    color: "from-blue-500 to-brand-accent"
  },
  {
    title: "عمل السيرة الذاتية (CV) بأنواعها",
    desc: "تصميم وكتابة CV أكاديمي أو مهني متوافق مع أنظمة الـ ATS العالمية.",
    details: "السيرة الذاتية هي بوابتك الأولى. نضمن لك تصميماً عصرياً ومحتوىً منظماً يبرز مهاراتك وخبراتك بشكل احترافي يتجاوز أنظمة الفرز الآلي.",
    features: [
      "تصميم متوافق مع ATS",
      "صياغة مهنية للمهارات",
      "تنسيق أكاديمي للمنح",
      "نسخة قابلة للتعديل (PDF & Word)"
    ],
    examples: ["سيرة ذاتية أكاديمية", "سيرة ذاتية مهنية تقنية", "سيرة ذاتية لحديثي التخرج"],
    pricing: "تبدأ من 15,000 جنيه سوداني",
    icon: <UserCheck className="w-8 h-8" />,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "الترجمة المعتمدة",
    desc: "ترجمة احترافية ومعتمدة لكافة مستنداتك الأكاديمية والمهنية.",
    details: "نوفر ترجمة دقيقة ومعتمدة لجميع الوثائق الرسمية، مع ضمان قبولها لدى السفارات والجامعات والجهات الحكومية.",
    features: [
      "ترجمة شهادات أكاديمية",
      "ترجمة وثائق رسمية",
      "تدقيق لغوي متخصص",
      "سرعة في التنفيذ"
    ],
    examples: ["ترجمة شهادة بكالوريوس", "ترجمة شهادة ميلاد", "ترجمة شهادات خبرة"],
    pricing: "حسب عدد الصفحات ونوع الوثيقة",
    icon: <Languages className="w-8 h-8" />,
    color: "from-brand-gold to-yellow-600"
  },
  {
    title: "استخراج الشهادات السودانية",
    desc: "نساعدك في إجراءات استخراج وتوثيق شهادات (الثانوي، المتوسط، الأساس) من الجهات المختصة.",
    details: "نوفر عليك عناء الإجراءات الروتينية في السودان. نقوم باستخراج وتوثيق شهاداتك من وزارة التربية والتعليم والخارجية بالنيابة عنك.",
    features: [
      "استخراج شهادات بدل فاقد",
      "توثيق من وزارة الخارجية",
      "توثيق من وزارة التربية",
      "خدمة التوصيل للمغتربين"
    ],
    examples: ["توثيق شهادة ثانوية", "استخراج شهادة أساس", "توثيق من السفارات"],
    pricing: "تواصل معنا لتحديد التكلفة حسب نوع الإجراء",
    icon: <GraduationCap className="w-8 h-8" />,
    color: "from-green-500 to-emerald-600"
  },
  {
    title: "خطابات التوصية (LOR)",
    desc: "تجهيز مسودات خطابات توصية احترافية تعكس قدراتك الأكاديمية.",
    details: "نساعدك في كتابة مسودات خطابات توصية قوية يمكن لأساتذتك أو مدرائك التوقيع عليها، مما يعزز من مصداقية ملفك الأكاديمي.",
    features: [
      "صياغة أكاديمية رصينة",
      "إبراز المهارات الشخصية",
      "تنسيق رسمي معتمد",
      "تعدد النماذج"
    ],
    examples: ["خطاب توصية أكاديمي", "خطاب توصية مهني", "خطاب توصية لمنحة بحثية"],
    pricing: "تبدأ من 10,000 جنيه سوداني",
    icon: <ClipboardCheck className="w-8 h-8" />,
    color: "from-orange-500 to-red-500"
  },
  {
    title: "إدارة ملف التقديم الكامل",
    desc: "نتولى عنك كافة إجراءات التقديم من الألف إلى الياء لضمان خلوها من الأخطاء.",
    details: "خدمة شاملة تبدأ من اختيار الجامعة المناسبة وحتى استلام القبول. نضمن لك ملفاً متكاملاً واحترافياً يزيد من فرص قبولك بشكل كبير.",
    features: [
      "اختيار الجامعات المناسبة",
      "تعبئة طلبات التقديم",
      "متابعة حالة الطلب",
      "تجهيز كافة المستندات"
    ],
    examples: ["ملف تقديم لمنحة تركيا", "ملف تقديم لجامعات ماليزيا", "ملف تقديم لمنح أوروبا"],
    pricing: "تحدد بناءً على عدد الجامعات والوجهات",
    icon: <Briefcase className="w-8 h-8" />,
    color: "from-cyan-500 to-blue-600"
  }
];

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 rtl">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">خدماتنا الاحترافية</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            نقدم لك حزمة متكاملة من الخدمات التي تضمن لك ملفاً أكاديمياً لا يقاوم. اضغط على أي خدمة لمعرفة المزيد.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedService(service)}
              className="glass-card p-8 group transition-all rtl border-white/5 hover:border-brand-gold/30 relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700" />
              
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} p-4 text-white mb-6 shadow-lg shadow-black/20 group-hover:rotate-12 transition-transform relative z-10`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-black text-white mb-4 group-hover:text-brand-gold transition-colors relative z-10">
                {service.title}
              </h3>
              <p className="text-slate-400 text-base leading-relaxed font-medium relative z-10">
                {service.desc}
              </p>
              
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                <span className="text-brand-gold text-xs font-bold">عرض التفاصيل</span>
                <ArrowRight className="w-5 h-5 text-brand-gold -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-brand-deep/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass-card p-8 md:p-12 overflow-y-auto max-h-[90vh] rtl border-brand-gold/20"
            >
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-6 left-6 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedService.color} p-5 text-white shadow-xl`}>
                  {selectedService.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">{selectedService.title}</h2>
                  <div className="flex items-center gap-2 text-brand-gold font-bold">
                    <DollarSign className="w-4 h-4" />
                    <span>{selectedService.pricing}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-brand-gold" />
                    عن الخدمة
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {selectedService.details}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-brand-gold" />
                      مميزات الخدمة
                    </h4>
                    <ul className="space-y-3">
                      {selectedService.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-slate-400 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-brand-gold" />
                      أمثلة من أعمالنا
                    </h4>
                    <ul className="space-y-3">
                      {selectedService.examples.map((example, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-slate-400 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <a 
                    href={`https://wa.me/249117734901?text=أريد الاستفسار عن خدمة: ${selectedService.title}`}
                    target="_blank"
                    className="btn-gold w-full py-4 flex items-center justify-center gap-3 text-lg"
                  >
                    اطلب الخدمة الآن عبر واتساب
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
