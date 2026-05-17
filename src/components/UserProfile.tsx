import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, LogOut, BookOpen, GraduationCap, FileText, Trash2, Upload, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useAuth } from './AuthContext';
import { db, logout, deleteSavedScholarship, deleteUserDocument, uploadUserDocument } from '../firebase';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';

const UserProfile: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'quiz' | 'scholarships' | 'documents'>('quiz');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const resultsUnsubscribe = onSnapshot(
      query(collection(db, 'users', user.uid, 'quizResults'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        setQuizResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    );

    const scholarshipsUnsubscribe = onSnapshot(
      query(collection(db, 'users', user.uid, 'savedScholarships'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        setSavedScholarships(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    );

    const docsUnsubscribe = onSnapshot(
      query(collection(db, 'users', user.uid, 'documents'), orderBy('uploadDate', 'desc')),
      (snapshot) => {
        setDocuments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    );

    return () => {
      resultsUnsubscribe();
      scholarshipsUnsubscribe();
      docsUnsubscribe();
    };
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      await uploadUserDocument(user.uid, file);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-white/10 shadow-2xl z-[101] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-gold overflow-hidden">
                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt={user.displayName || ''} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white leading-tight">{user.displayName}</h2>
                    <p className="text-sm text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button onClick={() => { logout(); onClose(); }} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
                {[
                  { id: 'quiz', icon: BookOpen, label: 'النتائج' },
                  { id: 'scholarships', icon: GraduationCap, label: 'المنح' },
                  { id: 'documents', icon: FileText, label: 'الملفات' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id ? 'bg-brand-gold text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {activeTab === 'quiz' && (
                  <div className="space-y-3">
                    {quizResults.length === 0 ? (
                      <div className="text-center py-12 text-slate-500">لا توجد نتائج سابقة</div>
                    ) : (
                      quizResults.map(result => (
                        <div key={result.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-brand-gold font-bold text-lg">{result.percentage}%</span>
                            <span className="text-xs text-slate-500">
                              {result.timestamp?.toDate().toLocaleDateString('ar-EG')}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300">النتيجة: {result.score} من 100</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'scholarships' && (
                  <div className="space-y-3">
                    {savedScholarships.length === 0 ? (
                      <div className="text-center py-12 text-slate-500">لم تقم بحفظ أي منح بعد</div>
                    ) : (
                      savedScholarships.map(scholarship => (
                        <div key={scholarship.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-center gap-3">
                            <GraduationCap className="w-5 h-5 text-brand-gold" />
                            <span className="text-sm font-medium text-white">{scholarship.scholarshipTitle}</span>
                          </div>
                          <button 
                            onClick={() => deleteSavedScholarship(user.uid, scholarship.id)}
                            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-2xl hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-all cursor-pointer group">
                      <Upload className={`w-8 h-8 mb-2 transition-colors ${uploading ? 'text-brand-gold animate-bounce' : 'text-slate-500 group-hover:text-brand-gold'}`} />
                      <span className="text-sm font-medium text-slate-400 group-hover:text-white">
                        {uploading ? 'جاري الرفع...' : 'ارفع ملفاتك (PDF, JPG)'}
                      </span>
                      <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                    </label>

                    <div className="space-y-3">
                      {documents.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-brand-gold" />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-white truncate max-w-[150px]">{doc.fileName}</span>
                              <span className="text-[10px] text-slate-500">{doc.uploadDate?.toDate().toLocaleDateString('ar-EG')}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 hover:text-brand-gold transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button 
                              onClick={() => deleteUserDocument(user.uid, doc.id, doc.storagePath)}
                              className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserProfile;
