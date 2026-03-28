import { useState, useEffect } from 'react';
import { api, AuthStatus } from './api';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';

export function App() {
  const [status, setStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  async function checkAuth() {
    try {
      const s = await api.getAuthStatus();
      setStatus(s);
    } catch {
      setStatus({ setup: false, authenticated: false });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!status?.authenticated) {
    return <LoginPage isSetup={status?.setup ?? false} onSuccess={checkAuth} />;
  }

  return <Dashboard onLogout={checkAuth} />;
}
