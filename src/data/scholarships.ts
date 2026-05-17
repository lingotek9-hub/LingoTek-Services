export interface Scholarship {
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

export const SCHOLARSHIPS: Scholarship[] = [
  {
    title: 'منحة جامعة خزر الدولية',
    country: 'أذربيجان',
    level: 'Master, PhD',
    deadline: '30 June 2026',
    coverage: 'Fully Funded',
    type: 'graduation',
    description: 'تدعو جامعة خزر الطلاب الدوليين للتقديم على منحة "نائلة خانم" للعام 2026-2027. المنحة مخصصة للنساء فقط وتوفر تمويلاً كاملاً يغطي الرسوم والسكن وراتباً شهرياً بالإضافة لتذكرة طيران.',
    requirements: ['مخصصة للنساء فقط', 'سجل أكاديمي ممتاز (GPA 3.7+)', 'إجادة اللغة الإنجليزية للبحث الأكاديمي', 'كتابة مقال تحفيزي مميز'],
    link: 'https://international.khazar.org/nailekhanim-scholarship-application-form-4/'
  },
  {
    title: 'منحة الحكومة الكولومبية',
    country: 'كولومبيا',
    level: 'Master, PhD, Specialization',
    deadline: '5 June 2026',
    coverage: 'Fully Funded',
    type: 'award',
    description: 'فرصة مميزة من الحكومة الكولومبية بالتعاون مع ICETEX للطلاب الدوليين. تشمل المنحة تغطية كاملة للرسوم، راتباً شهرياً، تأميناً صحياً، وتكاليف التأشيرة ودعماً للكتب.',
    requirements: ['المتقدم من خارج كولومبيا', 'العمر لا يتجاوز 50 عاماً', 'شهادة أكاديمية مناسبة للتخصص', 'لا يشترط شهادة IELTS'],
    link: 'https://internacionalizacion.icetex.gov.co/login/auth/login'
  },
  {
    title: 'منحة ادرس في السعودية',
    country: 'المملكة العربية السعودية',
    level: 'Bachelor, Master, PhD',
    deadline: 'Varies by University',
    coverage: 'Fully Funded',
    type: 'globe',
    description: 'برنامج المنح الدراسية الحكومية في جامعات المملكة العربية السعودية. توفر المنحة مكافآت مالية، سكناً مجانياً، رعاية صحية، وتذاكر سفر سنوية.',
    requirements: ['العمر (17-25 للبكالوريوس، 30 للماجستير)', 'عدم الحصول على منحة أخرى في السعودية', 'شهادة خلو من السوابق وفحص طبي', 'تصديق جميع الشهادات والأوراق'],
    link: 'https://studyinsaudi.moe.gov.sa/'
  },
  {
    title: 'منحة الحكومة اليابانية (MEXT)',
    country: 'اليابان',
    level: 'Bachelor, Master, PhD',
    deadline: 'Varies by Country',
    coverage: 'Fully Funded',
    type: 'award',
    description: 'تعتبر من أرقى المنح العالمية، حيث تغطي الحكومة اليابانية كافة التكاليف الدراسية، الراتب الشهري، تذاكر الطيران، والسكن دون الحاجة لشهادة لغة إنجليزية.',
    requirements: ['جنسية دولة لديها علاقات مع اليابان', 'تاريخ الميلاد بعد 2 أبريل 1988', 'خطة بحثية واضحة للدراسات العليا', 'التميز الأكاديمي'],
    link: 'https://www.studyinjapan.go.jp/en/smap-stopj-applications-scholarship.html'
  },
  {
    title: 'منحة جامعة البخاري الدولية',
    country: 'ماليزيا',
    level: 'Bachelor Only',
    deadline: 'Academic Year 2026',
    coverage: 'Fully/Partially Funded',
    type: 'graduation',
    description: 'منحة مؤسسة البخاري الخيرية في ماليزيا المخصصة للطلاب ذوي الدخل المحدود. توفر تعليماً ذا جودة عالمية في بيئة إسلامية دولية مع راتب وسكن مجاني.',
    requirements: ['العمر بين 18 و22 سنة', 'دخل الأسرة أقل من 300 دولار شهرياً', 'عدم الزواج أثناء فترة الدراسة', 'اجتياز مقابلة شخصية عبر الإنترنت'],
    link: 'https://apply.aiu.edu.my/index.php?page=home'
  },
  {
    title: 'منحة الحكومة العراقية',
    country: 'العراق',
    level: 'Bachelor, Master, PhD',
    deadline: 'Varies',
    coverage: 'Fully Funded',
    type: 'award',
    description: 'مبادرة "ادرس في العراق" التي تهدف لاستقطاب الطلاب الدوليين للدراسة في أعرق الجامعات العراقية بتمويل كامل يغطي كافة التكاليف الدراسية والمعيشية.',
    requirements: ['شهادة دراسية موثقة', 'جواز سفر ساري المفعول', 'خلو من الأمراض السارية', 'الالتزام بالقواعد الجامعية'],
    link: 'https://studyiniraq.scrd-gate.gov.iq/'
  }
];
