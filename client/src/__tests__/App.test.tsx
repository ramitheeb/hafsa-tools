import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { App } from '../App';

vi.mock('../api', () => ({
  api: {
    getAuthStatus: vi.fn(),
    login: vi.fn(),
    setup: vi.fn(),
    logout: vi.fn(),
  },
}));

import { api } from '../api';

function renderApp() {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

describe('App', () => {
  it('shows loading state initially', () => {
    vi.mocked(api.getAuthStatus).mockReturnValue(new Promise(() => {})); // never resolves
    renderApp();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows login page when not authenticated', async () => {
    vi.mocked(api.getAuthStatus).mockResolvedValue({ setup: true, authenticated: false });
    renderApp();
    await waitFor(() => {
      expect(screen.getByText('Enter your password to continue')).toBeInTheDocument();
    });
  });

  it('shows setup page on first visit', async () => {
    vi.mocked(api.getAuthStatus).mockResolvedValue({ setup: false, authenticated: false });
    renderApp();
    await waitFor(() => {
      expect(screen.getByText('Set up your password to get started')).toBeInTheDocument();
    });
  });

  it('shows dashboard when authenticated', async () => {
    vi.mocked(api.getAuthStatus).mockResolvedValue({ setup: true, authenticated: true });
    renderApp();
    await waitFor(() => {
      expect(screen.getByText('Welcome, Dr. Hafsa!')).toBeInTheDocument();
    });
  });

  it('shows login page on API error', async () => {
    vi.mocked(api.getAuthStatus).mockRejectedValue(new Error('Network error'));
    renderApp();
    await waitFor(() => {
      expect(screen.getByText('Set up your password to get started')).toBeInTheDocument();
    });
  });
});
