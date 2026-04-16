import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DashboardPage } from '../pages/DashboardPage';

const mockUseAuth = vi.fn();

vi.mock('react-oidc-context', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('DashboardPage', () => {
  it('displays welcome message with user name', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { profile: { name: 'Teszt Elek' } },
    });

    render(<DashboardPage />);

    expect(screen.getByTestId('welcome-message')).toHaveTextContent('Üdvözöljük, Teszt Elek!');
  });

  it('falls back to Felhasználó when name is missing', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { profile: {} },
    });

    render(<DashboardPage />);

    expect(screen.getByTestId('welcome-message')).toHaveTextContent('Üdvözöljük, Felhasználó!');
  });
});
