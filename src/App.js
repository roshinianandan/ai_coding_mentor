import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import AppShell from './components/AppShell';
import Toast from './components/Toast';

function AppContent() {
  const { user } = useApp();
  return (
    <>
      {user ? <AppShell /> : <LoginPage />}
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
