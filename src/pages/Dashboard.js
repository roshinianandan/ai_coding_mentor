import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp, CONCEPTS } from '../context/AppContext';
import { RECOMMENDED_PROBLEMS } from '../utils/problems';
import ConceptBar from '../components/ConceptBar';
import DifficultyBadge from '../components/DifficultyBadge';
import { t } from '../utils/i18n';
import { getTamilAnalysis } from '../utils/tamilAnalysis';

const STAT_STYLES = [
  { val: 'var(--accent)',  bar: 'linear-gradient(90deg,var(--accent),#79c0ff)' },
  { val: 'var(--orange)', bar: 'linear-gradient(90deg,var(--orange),#ffa657)' },
  { val: 'var(--purple)', bar: 'linear-gradient(90deg,var(--purple),#d2a8ff)' },
  { val: 'var(--green)',  bar: 'linear-gradient(90deg,var(--green),#56d364)'  },
];

function StatCard({ label, value, style, a11y }) {
  const pct = Math.round(value * 100);
  return (
    <div className="card h-100" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: style.bar, borderRadius: '12px 12px 0 0' }} />
      <div className="card-body">
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: a11y ? 32 : 28, fontWeight: 800, letterSpacing: '-0.03em', color: style.val, marginBottom: 8 }}>{pct}%</div>
        <div style={{ height: 4, background: 'var(--bg-elevated)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 2, width: `${pct}%`, background: style.bar, transition: 'width 1s ease' }} />
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{payload[0].value}%</div>
    </div>
  );
};

export default function Dashboard() {
  const { knowledge, submissions, setPage, lang, a11yMode } = useApp();

  const weakest = CONCEPTS.slice().sort((a, b) => knowledge[a.key] - knowledge[b.key])[0];
  const recProblems = [
    ...RECOMMENDED_PROBLEMS.filter(p => p.concept === weakest.key).slice(0, 2),
    ...RECOMMENDED_PROBLEMS.filter(p => p.concept !== weakest.key).slice(0, 1),
  ];

  const chartData = CONCEPTS.map(c => ({
    name: lang === 'ta' ? (c.labelTa || c.label) : c.label.replace('Dynamic Prog.', 'DP'),
    score: Math.round(knowledge[c.key] * 100),
  }));

  const getConceptLabel = (c) => lang === 'ta' ? (c.labelTa || c.label) : c.label;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between px-4 pt-4 pb-2">
        <div>
          <h4 style={{ fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 2, fontSize: a11yMode ? 22 : 18 }}>
            {t('dashTitle', lang)}
          </h4>
          <p style={{ fontSize: a11yMode ? 14 : 13, color: 'var(--text-secondary)', margin: 0 }}>{t('dashSub', lang)}</p>
        </div>
        <button className="btn btn-green px-3 py-2" onClick={() => setPage('editor')}>
          <i className="bi bi-plus-lg me-1"></i>{t('newProblem', lang)}
        </button>
      </div>

      <div className="px-4 pb-5">
        {/* Stat cards */}
        <div className="row g-3 mb-4">
          {CONCEPTS.map((c, i) => (
            <div key={c.key} className="col-6 col-xl-3">
              <StatCard label={getConceptLabel(c)} value={knowledge[c.key]} style={STAT_STYLES[i]} a11y={a11yMode} />
            </div>
          ))}
        </div>

        <div className="row g-3">
          {/* Left col */}
          <div className="col-12 col-lg-6">
            <div className="card mb-3">
              <div className="card-header py-2 px-3">
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>◈ {t('conceptMastery', lang)}</span>
              </div>
              <div className="card-body">
                {CONCEPTS.map(c => (
                  <ConceptBar key={c.key} label={getConceptLabel(c)} value={knowledge[c.key]} color={c.color} />
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header py-2 px-3">
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>◈ {t('scoreOverview', lang)}</span>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fill: '#8b949e', fontSize: 10, fontFamily: 'Plus Jakarta Sans' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#484f58', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(88,166,255,0.05)' }} />
                    <Bar dataKey="score" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={44} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right col */}
          <div className="col-12 col-lg-6">
            <div className="card mb-3">
              <div className="card-header py-2 px-3">
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>⚑ {t('recommended', lang)}</span>
              </div>
              <div className="card-body">
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                  {t('focusArea', lang)}{' '}
                  <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{getConceptLabel(weakest)}</span>
                  {' '}({Math.round(knowledge[weakest.key] * 100)}% {t('mastery', lang)})
                </p>
                {recProblems.map((p, i) => (
                  <div key={i} className="problem-row mb-2 d-flex align-items-center justify-content-between" onClick={() => setPage('editor')}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{p.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {getConceptLabel(CONCEPTS.find(c => c.key === p.concept))}
                      </div>
                    </div>
                    <DifficultyBadge difficulty={p.difficulty} lang={lang} />
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header py-2 px-3">
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>◷ {t('recentSubs', lang)}</span>
              </div>
              <div className="card-body">
                {submissions.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', padding: '16px 0', margin: 0 }}>{t('noSubs', lang)}</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {submissions.slice(0, 5).map((s, i) => {
                      const concept = CONCEPTS.find(c => c.key === s.result.concept);
                      return (
                        <div key={i} className="activity-item">
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: concept?.color || 'var(--accent)', flexShrink: 0 }} />
                          <div className="flex-grow-1 text-truncate" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                            {lang === 'ta' && s.result.analysisIndex !== undefined
                              ? getTamilAnalysis(s.result.analysisIndex).mistake
                              : s.result.mistake}
                          </div>
                          <span className="font-mono ms-2 flex-shrink-0" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.time}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
