import React from 'react';
import { useApp, CONCEPTS } from '../context/AppContext';
import ConceptBar from '../components/ConceptBar';
import DifficultyBadge from '../components/DifficultyBadge';
import { t } from '../utils/i18n';
import { getTamilAnalysis } from '../utils/tamilAnalysis';

const TAGS = ['Binary Search', 'Arrays', 'Sorting', 'Graphs', 'Dynamic Prog.', 'Greedy', 'Recursion', 'Trees'];

export default function ProfilePage() {
  const { user, knowledge, submissions, lang, a11yMode } = useApp();
  const initials  = (user?.name || 'U')[0].toUpperCase();
  const avgScore  = Math.round(Object.values(knowledge).reduce((a, b) => a + b, 0) / 4 * 100);
  const totalSubs = submissions.length;

  const getConceptLabel = (c) => lang === 'ta' ? (c.labelTa || c.label) : c.label;

  const stats = [
    { labelKey: 'submissions', value: totalSubs },
    { labelKey: 'avgMastery',  value: `${avgScore}%` },
    { labelKey: 'streak',      value: '4 days' },
    { labelKey: 'rank',        value: '#142' },
  ];

  return (
    <div>
      <div className="px-4 pt-4 pb-2">
        <h4 style={{ fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 2, fontSize: a11yMode ? 22 : 18 }}>{t('profileTitle', lang)}</h4>
        <p style={{ fontSize: a11yMode ? 14 : 13, color: 'var(--text-secondary)', margin: 0 }}>{t('profileSub', lang)}</p>
      </div>

      <div className="px-4 pb-5">
        <div className="row g-3">
          <div className="col-12 col-lg-4">
            <div className="card">
              <div className="card-body">
                <div className="user-avatar-lg mb-3">{initials}</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 2 }}>{user?.name}</div>
                <div className="font-mono mb-3" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</div>
                <div className="divider" />
                <div className="row g-2 mb-3">
                  {stats.map(s => (
                    <div key={s.labelKey} className="col-6">
                      <div className="stat-mini">
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{t(s.labelKey, lang)}</div>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>{s.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="divider" />
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>{t('interests', lang)}</div>
                <div>{TAGS.map(t2 => <span key={t2} className="tag">{t2}</span>)}</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="card mb-3">
              <div className="card-header py-2 px-3">
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>◈ {t('masteryBreakdown', lang)}</span>
              </div>
              <div className="card-body">
                {CONCEPTS.map(c => (
                  <ConceptBar key={c.key} label={getConceptLabel(c)} value={knowledge[c.key]} color={c.color} />
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header py-2 px-3">
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>◷ {t('submissionHistory', lang)}</span>
              </div>
              <div className="card-body">
                {submissions.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', padding: '16px 0', margin: 0 }}>{t('noSubsYet', lang)}</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {submissions.slice(0, 8).map((s, i) => {
                      const concept = CONCEPTS.find(c => c.key === s.result.concept);
                      const mistakeText = lang === 'ta' && s.result.analysisIndex !== undefined
                        ? getTamilAnalysis(s.result.analysisIndex).mistake
                        : s.result.mistake;
                      return (
                        <div key={i} className="activity-item">
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: concept?.color || 'var(--accent)', flexShrink: 0 }} />
                          <div className="flex-grow-1 overflow-hidden">
                            <div className="text-truncate" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{mistakeText}</div>
                            <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                              {s.lang} · {getConceptLabel(concept || CONCEPTS[0])}
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2 flex-shrink-0">
                            <DifficultyBadge difficulty={s.result.recommendedProblem.difficulty} lang={lang} />
                            <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.time}</span>
                          </div>
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
