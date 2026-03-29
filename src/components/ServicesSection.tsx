import React from 'react';
import { motion } from 'motion/react';
import { FileText, UserCheck, Languages, GraduationCap, ClipboardCheck, Briefcase, ArrowRight } from 'lucide-react';

const SERVICES = [
  {
    title: "كتابة خطابات الغرض من الدراسة (SOP)",
    desc: "نصيغ لك خطاباً مقنعاً يبرز نقاط قوتك ويجذب لجان القبول في أقوى الجامعات.",
    icon: <FileText className="w-8 h-8" />,
    color: "from-blue-500 to-brand-accent"
  },
  {
    title: "عمل السيرة الذاتية (CV) بأنواعها",
    desc: "تصميم وكتابة CV أكاديمي أو مهني متوافق مع أنظمة الـ ATS العالمية.",
    icon: <UserCheck className="w-8 h-8" />,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "الترجمة المعتمدة",
    desc: "ترجمة احترافية ومعتمدة لكافة مستنداتك الأكاديمية والمهنية.",
    icon: <Languages className="w-8 h-8" />,
    color: "from-brand-gold to-yellow-600"
  },
  {
    title: "استخراج الشهادات السودانية",
    desc: "نساعدك في إجراءات استخراج وتوثيق شهادات (الثانوي، المتوسط، الأساس) من الجهات المختصة.",
    icon: <GraduationCap className="w-8 h-8" />,
    color: "from-green-500 to-emerald-600"
  },
  {
    title: "خطابات التوصية (LOR)",
    desc: "تجهيز مسودات خطابات توصية احترافية تعكس قدراتك الأكاديمية.",
    icon: <ClipboardCheck className="w-8 h-8" />,
    color: "from-orange-500 to-red-500"
  },
  {
    title: "إدارة ملف التقديم الكامل",
    desc: "نتولى عنك كافة إجراءات التقديم من الألف إلى الياء لضمان خلوها من الأخطاء.",
    icon: <Briefcase className="w-8 h-8" />,
    color: "from-cyan-500 to-blue-600"
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 rtl">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">خدماتنا الاحترافية</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            نقدم لك حزمة متكاملة من الخدمات التي تضمن لك ملفاً أكاديمياً لا يقاوم.
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
              className="glass-card p-8 group transition-all rtl border-white/5 hover:border-brand-gold/30 relative overflow-hidden"
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
                <span className="text-brand-gold text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">اطلب الخدمة الآن</span>
                <ArrowRight className="w-5 h-5 text-brand-gold -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
