import React, { useState, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useApp } from '../context/AppContext';
import { STARTER_CODE, analyzeCode } from '../utils/mockAnalysis';
import AnalysisPanel from '../components/AnalysisPanel';
import { t } from '../utils/i18n';

const LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'java',   label: 'Java'   },
  { value: 'cpp',    label: 'C++'    },
];

export default function CodeEditorPage() {
  const { updateKnowledge, addSubmission, showToast, lang, a11yMode } = useApp();
  const [editorLang, setEditorLang] = useState('python');
  const [code,        setCode]       = useState(STARTER_CODE.python);
  const [submitting,  setSubmitting]  = useState(false);
  const [result,      setResult]      = useState(null);
  const [listening,   setListening]   = useState(false);
  const recognitionRef = useRef(null);

  const handleLangChange = (l) => { setEditorLang(l); setCode(STARTER_CODE[l]); setResult(null); };
  const handleReset = () => { setCode(STARTER_CODE[editorLang]); setResult(null); };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setResult(null);
    try {
      const r = await analyzeCode(code);
      setResult(r);
      updateKnowledge(r.concept, 0.03);
      addSubmission({ result: r, lang: editorLang, time: new Date().toLocaleTimeString() });
      showToast(t('analysisComplete', lang), '🔍');
    } catch {
      showToast(t('analysisFailed', lang), '✕');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Voice Input ────────────────────────────────────────────
  const handleVoiceInput = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice input not supported in this browser.', '⚠');
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'ta' ? 'ta-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setCode(prev => prev + '\n# ' + transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [lang, listening, showToast]);

  const fontSize = a11yMode ? 15 : 13;

  return (
    <div className="d-flex flex-column" style={{ height: 'calc(100vh - 45px)' }}>
      {/* Page header */}
      <div className="px-4 pt-3 pb-2">
        <h4 style={{ fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 2, fontSize: a11yMode ? 22 : 18 }}>
          {t('editorTitle', lang)}
        </h4>
        <p style={{ fontSize: a11yMode ? 14 : 13, color: 'var(--text-secondary)', margin: 0 }}>
          {t('editorSub', lang)}
        </p>
      </div>

      {/* Editor + Analysis layout */}
      <div className="flex-grow-1 px-4 pb-4" style={{ minHeight: 0 }}>
        <div className="d-flex gap-3 h-100">

          {/* Editor panel */}
          <div className="editor-panel flex-grow-1">
            {/* Toolbar */}
            <div className="editor-toolbar flex-wrap gap-2">
              <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('langLabel', lang)}</span>
              <div className="d-flex gap-1">
                {LANGUAGES.map(l => (
                  <button
                    key={l.value}
                    className={`lang-tab ${editorLang === l.value ? 'active' : ''}`}
                    onClick={() => handleLangChange(l.value)}
                  >{l.label}</button>
                ))}
              </div>
              <div className="flex-grow-1" />

              {/* Voice input button */}
              <button
                onClick={handleVoiceInput}
                title={t('voiceInput', lang)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: `1px solid ${listening ? 'var(--red)' : 'var(--border)'}`,
                  background: listening ? 'var(--red-glow)' : 'var(--bg-surface)',
                  color: listening ? 'var(--red)' : 'var(--text-muted)',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: 12, fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <i className={`bi ${listening ? 'bi-stop-circle-fill' : 'bi-mic-fill'}`}></i>
                {listening ? t('listening', lang) : ''}
              </button>

              <button className="btn btn-outline-secondary btn-sm" onClick={handleReset}>
                <i className="bi bi-arrow-counterclockwise me-1"></i>{t('reset', lang)}
              </button>
              <button className="btn btn-green btn-sm px-3" onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <><span className="spinner-sm animate-spin me-1"></span>{t('analyzing', lang)}</>
                ) : (
                  <><i className="bi bi-play-fill me-1"></i>{t('submit', lang)}</>
                )}
              </button>
            </div>

            {/* Monaco */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <Editor
                height="100%"
                language={editorLang === 'cpp' ? 'cpp' : editorLang}
                value={code}
                onChange={val => setCode(val || '')}
                theme="vs-dark"
                options={{
                  fontSize,
                  fontFamily: "'Fira Code', monospace",
                  fontLigatures: true,
                  lineHeight: a11yMode ? 26 : 22,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 14, bottom: 14 },
                  renderLineHighlight: 'line',
                  cursorBlinking: 'smooth',
                  smoothScrolling: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  overviewRulerLanes: 0,
                  scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
                }}
              />
            </div>
          </div>

          {/* Analysis panel */}
          <div style={{ width: a11yMode ? 420 : 380, flexShrink: 0 }}>
            <AnalysisPanel result={result} submitting={submitting} />
          </div>
        </div>
      </div>
    </div>
  );
}
