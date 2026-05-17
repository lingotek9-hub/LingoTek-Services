import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Globe, Award, Calendar, ExternalLink, ChevronRight, X, CheckCircle, Info, Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from './AuthContext';
import { saveScholarship, deleteSavedScholarship, db, getScholarships } from '../firebase';
import { doc, onSnapshot, collection, addDoc, getDocs } from 'firebase/firestore';

import { SCHOLARSHIPS } from '../data/scholarships';

const getIcon = (type: string) => {
  switch (type) {
    case 'globe': return <Globe className="w-5 h-5" />;
    case 'award': return <Award className="w-5 h-5" />;
    default: return <GraduationCap className="w-5 h-5" />;
  }
};

export default function ScholarshipGrid() {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<any | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndSeed = async () => {
      try {
        let data = await getScholarships();
        
        // Seed if empty
        if (data.length === 0) {
          try {
            const scholarshipsRef = collection(db, 'scholarships');
            for (const s of SCHOLARSHIPS) {
              await addDoc(scholarshipsRef, s);
            }
            data = await getScholarships();
          } catch (seedError) {
            console.warn("Seeding failed (likely not an admin), using mock data for this session.");
            // Add IDs to mock data so they work with toggleSave
            data = SCHOLARSHIPS.map((s, index) => ({ id: `mock-${index}`, ...s }));
          }
        }
        
        setScholarships(data);
      } catch (error) {
        console.error("Error in fetchAndSeed:", error);
        setScholarships(SCHOLARSHIPS.map((s, index) => ({ id: `mock-${index}`, ...s })));
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

    return () => {
      subUnsubscribe();
    };
  }, [user]);

  const toggleSave = async (e: React.MouseEvent, scholarship: any) => {
    e.stopPropagation();
    if (!user) {
      alert('الرجاء تسجيل الدخول لحفظ المنح');
      return;
    }

    if (savedIds.has(scholarship.id)) {
      await deleteSavedScholarship(user.uid, scholarship.id);
    } else {
      await saveScholarship(user.uid, scholarship);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-card p-8 h-80 animate-pulse bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {scholarships.map((s) => (
          <motion.div 
            key={s.id} 
            whileHover={{ y: -8 }}
            className="glass-card p-8 hover:border-brand-gold/40 transition-all group flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <button 
              onClick={(e) => toggleSave(e, s)}
              className="absolute top-6 left-6 z-20 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-brand-gold hover:border-brand-gold/50 transition-all"
            >
              {savedIds.has(s.id) ? <BookmarkCheck className="w-5 h-5 text-brand-gold" /> : <Bookmark className="w-5 h-5" />}
            </button>

            <div className="rtl relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-6 group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-brand-deep transition-all duration-500 shadow-lg shadow-brand-gold/5">
                {getIcon(s.type)}
              </div>
              <h3 className="text-2xl font-black text-white mb-4 leading-tight group-hover:text-brand-gold transition-colors">{s.title}</h3>
              <div className="space-y-4 text-sm text-slate-400 font-bold">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-brand-gold" />
                  </div>
                  <span>الوجهة: {s.country}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-brand-gold" />
                  </div>
                  <span>المستوى: {s.level}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-brand-gold" />
                  </div>
                  <span>الموعد النهائي: {s.deadline}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-xs font-black text-brand-deep bg-brand-gold px-4 py-2 rounded-xl shadow-lg shadow-brand-gold/20">
                {s.coverage}
              </span>
              <button 
                onClick={() => setSelectedScholarship(s)}
                className="text-brand-gold hover:text-white text-sm font-black flex items-center gap-2 transition-all group/btn"
              >
                التفاصيل
                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedScholarship && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScholarship(null)}
              className="absolute inset-0 bg-brand-deep/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass-card p-8 sm:p-12 overflow-y-auto max-h-[90vh] border-brand-gold/20"
            >
              <button 
                onClick={() => setSelectedScholarship(null)}
                className="absolute top-6 left-6 text-slate-400 hover:text-brand-gold transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="rtl space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/20">
                    {getIcon(selectedScholarship.type)}
                  </div>
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">{selectedScholarship.title}</h2>
                    <div className="flex flex-wrap gap-4">
                      <span className="px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-bold border border-brand-gold/20">
                        {selectedScholarship.country}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 text-xs font-bold border border-white/10">
                        {selectedScholarship.coverage}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-brand-gold">
                    <Info className="w-6 h-6" />
                    <h3 className="text-xl font-black">عن المنحة</h3>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-lg font-medium">
                    {selectedScholarship.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-brand-gold">
                    <CheckCircle className="w-6 h-6" />
                    <h3 className="text-xl font-black">المتطلبات الأساسية</h3>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedScholarship.requirements.map((req: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-brand-gold mt-2 flex-shrink-0" />
                        <span className="text-slate-300 text-sm font-medium">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Calendar className="w-5 h-5 text-brand-gold" />
                    <span className="text-sm font-bold">الموعد النهائي: {selectedScholarship.deadline}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {selectedScholarship.link && (
                      <a 
                        href={selectedScholarship.link} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-xl flex items-center justify-center gap-3 transition-all"
                      >
                        الموقع الرسمي
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    <a 
                      href={`https://wa.me/249117734901?text=${encodeURIComponent(`السلام عليكم، أريد الاستفسار عن التقديم لمنحة: ${selectedScholarship.title} في ${selectedScholarship.country}. هل يمكنكم تزويدي بالتفاصيل والأسعار؟`)}`} 
                      target="_blank"
                      className="w-full sm:w-auto btn-gold flex items-center justify-center gap-3"
                    >
                      قدم عبر لينجوتك
                      <CheckCircle className="w-5 h-5" />
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
