import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';

export default function LoginPage() {
  const { login, lang, toggleLang } = useApp();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = () => {
    if (!email.trim()) { setError(t('emailError', lang)); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { login(email.trim()); setLoading(false); }, 900);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}
    >
      <div className="login-grid" />
      <div className="login-glow" />

      {/* Language toggle top-right */}
      <div style={{ position: 'absolute', top: 20, right: 24, display: 'flex', gap: 6 }}>
        {['en', 'ta'].map(l => (
          <button key={l} onClick={() => { if (lang !== l) toggleLang(); }} style={{
            padding: '4px 12px', fontSize: 11, fontWeight: 700,
            border: '1px solid var(--border)', borderRadius: 6,
            background: lang === l ? 'var(--accent)' : 'var(--bg-elevated)',
            color: lang === l ? '#0a0c10' : 'var(--text-muted)',
            cursor: 'pointer',
          }}>
            {l === 'en' ? 'EN' : 'தமிழ்'}
          </button>
        ))}
      </div>

      <div className="animate-slide-up" style={{
        position: 'relative',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '44px 40px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 0 60px rgba(0,0,0,0.5)',
      }}>
        <div className="d-flex align-items-center gap-2 mb-4">
          <div className="logo-icon-lg">⚡</div>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>{t('appName', lang)}</span>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>{t('welcomeBack', lang)}</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 28 }}>{t('loginSub', lang)}</p>

        {error && <div className="alert py-2 px-3 mb-3" style={{ background: 'var(--red-glow)', border: '1px solid var(--red)', color: 'var(--red)', borderRadius: 8, fontSize: 12 }}>{error}</div>}

        <div className="mb-3">
          <label className="form-label">{t('emailLabel', lang)}</label>
          <input type="email" className="form-control" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <div className="mb-4">
          <label className="form-label">{t('passwordLabel', lang)}</label>
          <input type="password" className="form-control" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        <button className="btn btn-accent w-100 py-2" onClick={handleSubmit} disabled={loading}>
          {loading ? t('signingIn', lang) : t('signIn', lang)}
        </button>

        <p className="text-center mt-3 font-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {t('demoHint', lang)}
        </p>
      </div>
    </div>
  );
}
