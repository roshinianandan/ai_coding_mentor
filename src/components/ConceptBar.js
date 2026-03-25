import React from 'react';

export default function ConceptBar({ label, value, color }) {
  const pct = Math.round(value * 100);
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
        <span className="font-mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{pct}%</span>
      </div>
      <div className="concept-bar-bg">
        <div className="concept-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
