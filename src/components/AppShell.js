import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import AccessibilityBar from './AccessibilityBar';
import { useApp } from '../context/AppContext';
import Dashboard from '../pages/Dashboard';
import CodeEditorPage from '../pages/CodeEditorPage';
import ProfilePage from '../pages/ProfilePage';

export default function AppShell() {
  const { page, a11yMode } = useApp();

  // Apply a11y CSS class to root for global overrides
  useEffect(() => {
    const root = document.documentElement;
    if (a11yMode) {
      root.classList.add('a11y-mode');
    } else {
      root.classList.remove('a11y-mode');
    }
  }, [a11yMode]);

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1 d-flex flex-column">
        <AccessibilityBar />
        <div className="flex-grow-1">
          {page === 'dashboard' && <Dashboard />}
          {page === 'editor'    && <CodeEditorPage />}
          {page === 'profile'   && <ProfilePage />}
        </div>
      </div>
    </div>
  );
}
