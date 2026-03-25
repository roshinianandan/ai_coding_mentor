import React from 'react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className="toast-custom animate-fade-in">
      <span style={{ fontSize: 16, color: 'var(--green)' }}>{toast.icon}</span>
      {toast.msg}
    </div>
  );
}
