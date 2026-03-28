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
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!status?.authenticated) {
    return <LoginPage isSetup={status?.setup ?? false} onSuccess={checkAuth} />;
  }

  return <Dashboard onLogout={checkAuth} />;
}
