import React from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';

export default function Sidebar() {
  const { page, setPage, user, logout, lang } = useApp();
  const initials = (user?.name || 'U')[0].toUpperCase();

  const NAV_ITEMS = [
    { id: 'dashboard', icon: 'bi-grid-fill',    labelKey: 'navDashboard' },
    { id: 'editor',    icon: 'bi-code-slash',   labelKey: 'navEditor'    },
    { id: 'profile',   icon: 'bi-person-circle',labelKey: 'navProfile'   },
  ];

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="d-flex align-items-center gap-2 px-3 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="logo-icon">⚡</div>
        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.02em' }}>{t('appName', lang)}</span>
      </div>

      {/* Nav */}
      <nav className="px-2 py-3 flex-grow-1">
        <div className="section-label px-2">{t('navLabel', lang)}</div>
        {NAV_ITEMS.map(item => (
          <a
            key={item.id}
            href="#!"
            className={`nav-link ${page === item.id ? 'active' : ''}`}
            onClick={e => { e.preventDefault(); setPage(item.id); }}
          >
            <i className={`bi ${item.icon}`} style={{ fontSize: 15 }}></i>
            {t(item.labelKey, lang)}
          </a>
        ))}
      </nav>

      {/* User */}
      <div className="d-flex align-items-center gap-2 px-3 py-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="user-avatar">{initials}</div>
        <div className="flex-grow-1 overflow-hidden">
          <div style={{ fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t('learner', lang)}</div>
        </div>
        <button
          className="btn btn-sm p-0"
          onClick={logout}
          title="Logout"
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 16 }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
