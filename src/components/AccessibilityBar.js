import React from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';

export default function AccessibilityBar() {
  const { lang, toggleLang, a11yMode, toggleA11y, explainLevel, setExplainLevel } = useApp();

  const barBg = a11yMode ? '#1a1a2e' : 'var(--bg-elevated)';
  const borderColor = a11yMode ? 'var(--accent)' : 'var(--border)';

  return (
    <div style={{
      background: barBg,
      borderBottom: `1px solid ${borderColor}`,
      padding: '7px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap',
      transition: 'background 0.3s',
      zIndex: 50,
      position: 'relative',
    }}>
      {/* Language toggle */}
      <div className="d-flex align-items-center gap-2">
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          🌐 {t('language', lang)}
        </span>
        <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {['en', 'ta'].map(l => (
            <button
              key={l}
              onClick={() => { if (lang !== l) toggleLang(); }}
              style={{
                padding: '3px 10px',
                fontSize: 11, fontWeight: 700,
                border: 'none',
                background: lang === l ? 'var(--accent)' : 'transparent',
                color: lang === l ? '#0a0c10' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                letterSpacing: '0.04em',
              }}
            >
              {l === 'en' ? 'EN' : 'தமிழ்'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: 1, height: 18, background: 'var(--border)' }} />

      {/* Explain level */}
      <div className="d-flex align-items-center gap-2">
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          🧠 {t('explainMode', lang)}
        </span>
        <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {['beginner', 'intermediate', 'advanced'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setExplainLevel(lvl)}
              style={{
                padding: '3px 9px',
                fontSize: 11, fontWeight: 700,
                border: 'none',
                background: explainLevel === lvl
                  ? lvl === 'beginner' ? 'var(--green)'
                    : lvl === 'intermediate' ? 'var(--orange)'
                    : 'var(--red)'
                  : 'transparent',
                color: explainLevel === lvl ? '#0a0c10' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {t(lvl, lang)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: 1, height: 18, background: 'var(--border)' }} />

      {/* Accessibility toggle */}
      <div className="d-flex align-items-center gap-2">
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          ♿ {t('a11yMode', lang)}
        </span>
        <div
          onClick={toggleA11y}
          style={{
            width: 36, height: 20,
            background: a11yMode ? 'var(--accent)' : 'var(--border)',
            borderRadius: 10,
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.2s',
            flexShrink: 0,
          }}
        >
          <div style={{
            position: 'absolute',
            top: 2, left: a11yMode ? 18 : 2,
            width: 16, height: 16,
            background: '#fff',
            borderRadius: '50%',
            transition: 'left 0.2s',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }} />
        </div>
        {a11yMode && (
          <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.04em' }}>ON</span>
        )}
      </div>
    </div>
  );
}
