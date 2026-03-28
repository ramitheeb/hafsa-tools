import { useState, FormEvent } from 'react';
import { api } from '../api';

interface Props {
  isSetup: boolean;
  onSuccess: () => void;
}

export function LoginPage({ isSetup, onSuccess }: Props) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isFirstTime = !isSetup;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (isFirstTime && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (isFirstTime) {
        await api.setup(password);
      } else {
        await api.login(password);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Hafsa Tools</h1>
        <p style={styles.subtitle}>
          {isFirstTime ? 'Set up your password to get started' : 'Enter your password to continue'}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />

          {isFirstTime && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" className="primary" disabled={loading} style={styles.button}>
            {loading ? '...' : isFirstTime ? 'Create Password' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  card: {
    background: 'var(--color-surface)',
    borderRadius: '12px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    textAlign: 'center' as const,
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: 'var(--color-text-muted)',
    textAlign: 'center' as const,
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  error: {
    color: 'var(--color-error)',
    fontSize: '0.85rem',
  },
  button: {
    width: '100%',
    marginTop: '0.25rem',
  },
};
