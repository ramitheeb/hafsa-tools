import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from '../pages/LoginPage';

vi.mock('../api', () => ({
  api: {
    login: vi.fn(),
    setup: vi.fn(),
  },
}));

import { api } from '../api';

describe('LoginPage', () => {
  it('shows login form when already set up', () => {
    render(<LoginPage isSetup={true} onSuccess={() => {}} />);
    expect(screen.getByText('Enter your password to continue')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.queryByLabelText('Confirm Password')).not.toBeInTheDocument();
  });

  it('shows setup form on first visit', () => {
    render(<LoginPage isSetup={false} onSuccess={() => {}} />);
    expect(screen.getByText('Set up your password to get started')).toBeInTheDocument();
    expect(screen.getByText('Create Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('shows error when setup passwords do not match', async () => {
    const user = userEvent.setup();
    render(<LoginPage isSetup={false} onSuccess={() => {}} />);

    await user.type(screen.getByLabelText('Password'), 'pass1');
    await user.type(screen.getByLabelText('Confirm Password'), 'pass2');
    await user.click(screen.getByText('Create Password'));

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('calls api.login on login form submit', async () => {
    const onSuccess = vi.fn();
    vi.mocked(api.login).mockResolvedValue({ ok: true });
    const user = userEvent.setup();

    render(<LoginPage isSetup={true} onSuccess={onSuccess} />);
    await user.type(screen.getByLabelText('Password'), 'mypassword');
    await user.click(screen.getByText('Log In'));

    expect(api.login).toHaveBeenCalledWith('mypassword');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('calls api.setup on setup form submit', async () => {
    const onSuccess = vi.fn();
    vi.mocked(api.setup).mockResolvedValue({ ok: true });
    const user = userEvent.setup();

    render(<LoginPage isSetup={false} onSuccess={onSuccess} />);
    await user.type(screen.getByLabelText('Password'), 'newpass');
    await user.type(screen.getByLabelText('Confirm Password'), 'newpass');
    await user.click(screen.getByText('Create Password'));

    expect(api.setup).toHaveBeenCalledWith('newpass');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('shows error message on login failure', async () => {
    vi.mocked(api.login).mockRejectedValue(new Error('Invalid password'));
    const user = userEvent.setup();

    render(<LoginPage isSetup={true} onSuccess={() => {}} />);
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByText('Log In'));

    expect(screen.getByText('Invalid password')).toBeInTheDocument();
  });
});
