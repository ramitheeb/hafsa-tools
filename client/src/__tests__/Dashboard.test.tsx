import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dashboard } from '../pages/Dashboard';

vi.mock('../api', () => ({
  api: {
    logout: vi.fn().mockResolvedValue({ ok: true }),
  },
}));

import { api } from '../api';

describe('Dashboard', () => {
  it('renders welcome message', () => {
    render(<Dashboard onLogout={() => {}} />);
    expect(screen.getByText('Welcome, Dr. Hafsa!')).toBeInTheDocument();
  });

  it('renders all tool cards', () => {
    render(<Dashboard onLogout={() => {}} />);
    expect(screen.getByText('Flashcards')).toBeInTheDocument();
    expect(screen.getByText('Practice Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Progress Tracker')).toBeInTheDocument();
  });

  it('shows coming soon badges', () => {
    render(<Dashboard onLogout={() => {}} />);
    const badges = screen.getAllByText('Coming soon');
    expect(badges).toHaveLength(4);
  });

  it('calls logout on button click', async () => {
    const onLogout = vi.fn();
    const user = userEvent.setup();

    render(<Dashboard onLogout={onLogout} />);
    await user.click(screen.getByText('Log out'));

    expect(api.logout).toHaveBeenCalled();
    expect(onLogout).toHaveBeenCalled();
  });
});
