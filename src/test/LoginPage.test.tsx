import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginPage } from '../pages/LoginPage';

vi.mock('../auth/keycloak.config', () => ({
  userManager: {
    signinRedirect: vi.fn(),
  },
}));

describe('LoginPage', () => {
  it('renders login button', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.getByText('Bejelentkezés')).toBeInTheDocument();
  });

  it('renders Doorstar Portal heading', () => {
    render(<LoginPage />);
    expect(screen.getByText('Doorstar Portal')).toBeInTheDocument();
  });
});
