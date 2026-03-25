import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export const CONCEPTS = [
  { key: 'arrays',        label: 'Arrays',        labelTa: 'வரிசைகள்',          color: 'var(--accent)'  },
  { key: 'recursion',     label: 'Recursion',      labelTa: 'மறுசுழற்சி',         color: 'var(--orange)'  },
  { key: 'binary_search', label: 'Binary Search',  labelTa: 'இரும தேடல்',         color: 'var(--purple)'  },
  { key: 'dp',            label: 'Dynamic Prog.',  labelTa: 'மாறும் நிரலாக்கம்',  color: 'var(--green)'   },
];

const INITIAL_KNOWLEDGE = {
  arrays: 0.70, recursion: 0.40, binary_search: 0.50, dp: 0.30,
};

export function AppProvider({ children }) {
  const [user,        setUser]        = useState(null);
  const [page,        setPage]        = useState('dashboard');
  const [knowledge,   setKnowledge]   = useState(INITIAL_KNOWLEDGE);
  const [submissions, setSubmissions] = useState([]);
  const [toast,       setToast]       = useState(null);

  // ── New inclusive state ───────────────────────────────────
  const [lang,         setLang]         = useState('en');   // 'en' | 'ta'
  const [a11yMode,     setA11yMode]     = useState(false);  // accessibility
  const [explainLevel, setExplainLevel] = useState('intermediate'); // beginner|intermediate|advanced

  const showToast = useCallback((msg, icon = '✓') => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const login = useCallback((email) => {
    setUser({ email, name: email.split('@')[0] });
    setPage('dashboard');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setPage('dashboard');
  }, []);

  const updateKnowledge = useCallback((conceptKey, delta) => {
    setKnowledge(prev => ({
      ...prev,
      [conceptKey]: Math.min(1, Math.max(0, (prev[conceptKey] ?? 0) + delta)),
    }));
  }, []);

  const addSubmission = useCallback((sub) => {
    setSubmissions(prev => [sub, ...prev].slice(0, 30));
  }, []);

  const toggleA11y = useCallback(() => setA11yMode(v => !v), []);
  const toggleLang = useCallback(() => setLang(l => l === 'en' ? 'ta' : 'en'), []);

  return (
    <AppContext.Provider value={{
      user, login, logout,
      page, setPage,
      knowledge, updateKnowledge,
      submissions, addSubmission,
      toast, showToast,
      lang, setLang, toggleLang,
      a11yMode, toggleA11y,
      explainLevel, setExplainLevel,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
