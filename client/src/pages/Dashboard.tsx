import { api } from '../api';

interface Props {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: Props) {
  async function handleLogout() {
    await api.logout();
    onLogout();
  }

  return (
    <div style={styles.layout}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Hafsa Tools</h1>
        <button className="secondary" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <main style={styles.main}>
        <h2 style={styles.welcome}>Welcome, Dr. Hafsa!</h2>
        <p style={styles.subtitle}>Your exam preparation tools will appear here.</p>

        <div style={styles.grid}>
          <ToolCard title="Flashcards" description="Create and review flashcards" />
          <ToolCard title="Practice Quizzes" description="Test your knowledge with quizzes" />
          <ToolCard title="Notes" description="Organize your study notes" />
          <ToolCard title="Progress Tracker" description="Track your study progress" />
        </div>
      </main>
    </div>
  );
}

function ToolCard({ title, description }: { title: string; description: string }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardDesc}>{description}</p>
      <span style={styles.badge}>Coming soon</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  layout: {
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: 'var(--color-surface)',
    borderBottom: '1px solid var(--color-border)',
  },
  logo: {
    fontSize: '1.2rem',
    fontWeight: 700,
  },
  main: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem',
  },
  welcome: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: 'var(--color-text-muted)',
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  },
  card: {
    background: 'var(--color-surface)',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid var(--color-border)',
  },
  cardTitle: {
    fontSize: '1.05rem',
    fontWeight: 600,
    marginBottom: '0.35rem',
  },
  cardDesc: {
    color: 'var(--color-text-muted)',
    fontSize: '0.85rem',
    marginBottom: '0.75rem',
  },
  badge: {
    display: 'inline-block',
    background: '#f0f0f0',
    color: 'var(--color-text-muted)',
    fontSize: '0.75rem',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
  },
};
