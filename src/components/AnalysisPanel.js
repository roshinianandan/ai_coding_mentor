import React, { useState, useEffect, useCallback } from 'react';
import { CONCEPTS, useApp } from '../context/AppContext';
import DifficultyBadge from './DifficultyBadge';
import { t } from '../utils/i18n';
import { getBullets, getTamilAnalysis } from '../utils/tamilAnalysis';

function ResultBadge({ variant, children }) {
  return <span className={`result-badge badge-${variant}`}>{children}</span>;
}

// ── Text-to-Speech helper ────────────────────────────────────
function buildSpeechText(result, bullets, lang, conceptLabel) {
  if (!result) return '';
  if (lang === 'ta') {
    const ta = getTamilAnalysis(result.analysisIndex);
    return [
      'தவறு: ' + ta.mistake,
      'கருத்து: ' + conceptLabel,
      'விளக்கம்: ' + ta.explanation.beginner.join('. '),
      'குறிப்புகள்: ' + ta.hints.join('. '),
    ].join('. ');
  }
  return [
    'Mistake: ' + result.mistake,
    'Concept: ' + conceptLabel,
    'Explanation: ' + bullets.join('. '),
    'Hints: ' + result.hints.join('. '),
  ].join('. ');
}

function speak(text, lang, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang === 'ta' ? 'ta-IN' : 'en-US';
  utt.rate = 0.9;
  utt.pitch = 1;
  if (onEnd) utt.onend = onEnd;
  // Try to pick a matching voice
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find(v => v.lang.startsWith(lang === 'ta' ? 'ta' : 'en'));
  if (match) utt.voice = match;
  window.speechSynthesis.speak(utt);
}

export default function AnalysisPanel({ result, submitting }) {
  const { lang, a11yMode, explainLevel } = useApp();
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [simplerLevel, setSimplerLevel] = useState(null); // override level

  useEffect(() => { setHintsRevealed(0); setShowSteps(false); setSimplerLevel(null); }, [result]);

  // Auto-read when a11yMode is on and result arrives
  useEffect(() => {
    if (a11yMode && result && !submitting) {
      const activeLevel = simplerLevel || explainLevel;
      const bullets = getBullets(result.analysisIndex, activeLevel, lang);
      const conceptLabel = CONCEPTS.find(c => c.key === result.concept)?.[lang === 'ta' ? 'labelTa' : 'label'] || '';
      const text = buildSpeechText(result, bullets, lang, conceptLabel);
      setSpeaking(true);
      speak(text, lang, () => setSpeaking(false));
    }
    // eslint-disable-next-line
  }, [result, a11yMode]);

  const handleReadAloud = useCallback(() => {
    if (!result) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const activeLevel = simplerLevel || explainLevel;
    const bullets = getBullets(result.analysisIndex, activeLevel, lang);
    const conceptLabel = CONCEPTS.find(c => c.key === result.concept)?.[lang === 'ta' ? 'labelTa' : 'label'] || '';
    const text = buildSpeechText(result, bullets, lang, conceptLabel);
    setSpeaking(true);
    speak(text, lang, () => setSpeaking(false));
  }, [result, speaking, lang, explainLevel, simplerLevel]);

  const handleExplainSimpler = () => {
    const levels = ['beginner', 'intermediate', 'advanced'];
    const current = simplerLevel || explainLevel;
    const idx = levels.indexOf(current);
    if (idx > 0) setSimplerLevel(levels[idx - 1]);
    else setSimplerLevel('beginner');
  };

  if (!result) {
    return renderShell(lang, submitting, null, null, null, null, null, null, null, null, null, null, null);
  }

  const activeLevel = simplerLevel || explainLevel;
  const bullets = getBullets(result.analysisIndex, activeLevel, lang);
  const tamilData = getTamilAnalysis(result.analysisIndex);
  const concept = CONCEPTS.find(c => c.key === result.concept);
  const conceptLabel = concept?.[lang === 'ta' ? 'labelTa' : 'label'] || concept?.label || '';
  const mistakeText = lang === 'ta' ? tamilData.mistake : result.mistake;
  const taHints = lang === 'ta' ? tamilData.hints : result.hints;
  const steps = lang === 'ta' ? tamilData.steps : result.steps;
  const recTitle = lang === 'ta' ? tamilData.recommendedProblem.title : result.recommendedProblem.title;

  return (
    <div className="analysis-panel">
      {/* Header */}
      <div className="analysis-header">
        <span style={{ fontSize: 16 }}>🔍</span>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{t('aiAnalysis', lang)}</span>
        {result && !submitting && (
          <span className="ms-auto font-mono" style={{ fontSize: 11, color: 'var(--green)' }}>{t('complete', lang)}</span>
        )}
        {submitting && (
          <span className="ms-auto font-mono" style={{ fontSize: 11, color: 'var(--orange)' }}>{t('analyzingDot', lang)}</span>
        )}
      </div>

      {/* Body */}
      <div className="flex-grow-1 overflow-auto p-3">
        {/* Empty */}
        {!result && !submitting && (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center p-4">
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>💡</div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{t('emptyState', lang)}</p>
          </div>
        )}

        {/* Loading */}
        {submitting && (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 gap-3">
            <div className="spinner-ring animate-spin-slow"></div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{t('analyzingCode', lang)}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('detectingPatterns', lang)}</div>
          </div>
        )}

        {/* Result */}
        {result && !submitting && (
          <div className="animate-fade-in">

            {/* Read Aloud + Explain Simpler row */}
            <div className="d-flex gap-2 mb-3 flex-wrap">
              <button
                onClick={handleReadAloud}
                className="btn btn-sm"
                style={{
                  fontSize: 11, fontWeight: 700,
                  background: speaking ? 'var(--red-glow)' : 'var(--accent-dim)',
                  border: `1px solid ${speaking ? 'var(--red)' : 'var(--accent)'}`,
                  color: speaking ? 'var(--red)' : 'var(--accent)',
                  borderRadius: 6, padding: '4px 10px',
                }}
              >
                {speaking ? t('stopReading', lang) : t('readAloud', lang)}
              </button>
              <button
                onClick={handleExplainSimpler}
                className="btn btn-sm"
                disabled={activeLevel === 'beginner'}
                style={{
                  fontSize: 11, fontWeight: 700,
                  background: 'var(--green-glow)',
                  border: '1px solid var(--green)',
                  color: 'var(--green)',
                  borderRadius: 6, padding: '4px 10px',
                  opacity: activeLevel === 'beginner' ? 0.4 : 1,
                }}
              >
                {t('explainSimpler', lang)}
              </button>
              {simplerLevel && (
                <span style={{ fontSize: 10, color: 'var(--orange)', fontWeight: 700, alignSelf: 'center' }}>
                  ↓ {t(simplerLevel, lang)}
                </span>
              )}
            </div>

            {/* Mistake */}
            <div className="mb-3">
              <ResultBadge variant="error">{t('mistakeDetected', lang)}</ResultBadge>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{mistakeText}</div>
              {/* Bullet-point explanation */}
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {bullets.map((b, i) => (
                  <li key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4, lineHeight: 1.5 }}>{b}</li>
                ))}
              </ul>
            </div>

            <div className="divider" />

            {/* Concept + Confidence */}
            <div className="mb-3">
              <ResultBadge variant="info">{t('conceptLabel', lang)}</ResultBadge>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span style={{ fontSize: 13, fontWeight: 700, color: concept?.color }}>{conceptLabel}</span>
                <span className="font-mono" style={{ fontSize: 12, color: 'var(--accent)' }}>
                  {Math.round(result.confidence * 100)}%
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{t('confidenceScore', lang)}</div>
              <div className="confidence-bar-bg">
                <div className="confidence-bar-fill" style={{ width: `${result.confidence * 100}%` }} />
              </div>
            </div>

            <div className="divider" />

            {/* Step-by-Step toggle */}
            <div className="mb-3">
              <button
                onClick={() => setShowSteps(s => !s)}
                className="btn btn-sm w-100 mb-2"
                style={{
                  fontSize: 11, fontWeight: 700,
                  background: showSteps ? 'var(--purple-glow)' : 'var(--bg-elevated)',
                  border: `1px solid ${showSteps ? 'var(--purple)' : 'var(--border)'}`,
                  color: showSteps ? 'var(--purple)' : 'var(--text-muted)',
                  borderRadius: 6,
                }}
              >
                {t('stepByStep', lang)} {showSteps ? '▲' : '▼'}
              </button>
              {showSteps && steps && (
                <div className="animate-fade-in" style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '10px 14px',
                }}>
                  {steps.map((s, i) => (
                    <div key={i} className="d-flex gap-2 align-items-start mb-2">
                      <div style={{
                        background: 'var(--purple-glow)', color: 'var(--purple)',
                        width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 700, marginTop: 1,
                      }}>{i + 1}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="divider" />

            {/* Hints */}
            <div className="mb-3">
              <ResultBadge variant="warn">{t('hintsLabel', lang)} ({hintsRevealed}/{taHints.length})</ResultBadge>
              <div className="d-flex flex-column gap-2">
                {taHints.slice(0, hintsRevealed).map((h, i) => (
                  <div key={i} className="hint-item animate-fade-in d-flex gap-2">
                    <div style={{
                      background: 'var(--accent-dim)', color: 'var(--accent)',
                      width: 18, height: 18, borderRadius: 4,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1,
                    }}>{i + 1}</div>
                    <div>{h}</div>
                  </div>
                ))}
                {hintsRevealed < taHints.length ? (
                  <button className="hint-reveal-btn" onClick={() => setHintsRevealed(n => n + 1)}>
                    {hintsRevealed === 0 ? t('revealFirst', lang) : `${t('revealNext', lang)} ${hintsRevealed + 1}`}
                  </button>
                ) : (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>{t('allRevealed', lang)}</div>
                )}
              </div>
            </div>

            <div className="divider" />

            {/* Recommended problem */}
            <div>
              <ResultBadge variant="success">{t('nextProblem', lang)}</ResultBadge>
              <div className="d-flex align-items-center justify-content-between p-3 rounded"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{recTitle}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('recBased', lang)}</div>
                </div>
                <DifficultyBadge difficulty={result.recommendedProblem.difficulty} lang={lang} />
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

// Helper so empty/loading states still render correctly
function renderShell(lang, submitting) {
  return (
    <div className="analysis-panel">
      <div className="analysis-header">
        <span style={{ fontSize: 16 }}>🔍</span>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{t('aiAnalysis', lang)}</span>
        {submitting && <span className="ms-auto font-mono" style={{ fontSize: 11, color: 'var(--orange)' }}>{t('analyzingDot', lang)}</span>}
      </div>
      <div className="flex-grow-1 overflow-auto p-3">
        {!submitting && (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center p-4">
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>💡</div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{t('emptyState', lang)}</p>
          </div>
        )}
        {submitting && (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 gap-3">
            <div className="spinner-ring animate-spin-slow"></div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{t('analyzingCode', lang)}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('detectingPatterns', lang)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
