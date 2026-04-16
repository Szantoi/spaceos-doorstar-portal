import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProfilePage } from '../pages/ProfilePage';

const mockUseProfile = vi.fn();

vi.mock('../hooks/useProfile', () => ({
  useProfile: () => mockUseProfile(),
}));

vi.mock('../auth/keycloak.config', () => ({
  userManager: { signoutRedirect: vi.fn() },
}));

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const mockProfile = {
  sub: 'user-123',
  email: 'teszt@doorstar.hu',
  name: 'Teszt Elek',
  tenantId: 'tenant-1',
  tenantName: 'Doorstar Kft.',
  roles: ['order-manager', 'viewer'],
};

describe('ProfilePage', () => {
  it('shows loading state', () => {
    mockUseProfile.mockReturnValue({ isLoading: true, isError: false, data: undefined });
    renderPage();
    expect(screen.getByTestId('profile-loading')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseProfile.mockReturnValue({ isLoading: false, isError: true, data: undefined });
    renderPage();
    expect(screen.getByTestId('profile-error')).toBeInTheDocument();
  });

  it('renders name and email', () => {
    mockUseProfile.mockReturnValue({ isLoading: false, isError: false, data: mockProfile });
    renderPage();
    expect(screen.getByTestId('profile-name')).toHaveTextContent('Teszt Elek');
    expect(screen.getByTestId('profile-email')).toHaveTextContent('teszt@doorstar.hu');
  });

  it('renders roles as badges', () => {
    mockUseProfile.mockReturnValue({ isLoading: false, isError: false, data: mockProfile });
    renderPage();
    const roles = screen.getByTestId('profile-roles');
    expect(roles).toHaveTextContent('order-manager');
    expect(roles).toHaveTextContent('viewer');
  });

  it('renders logout button', () => {
    mockUseProfile.mockReturnValue({ isLoading: false, isError: false, data: mockProfile });
    renderPage();
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
  });

  it('renders tenant name', () => {
    mockUseProfile.mockReturnValue({ isLoading: false, isError: false, data: mockProfile });
    renderPage();
    expect(screen.getByTestId('profile-tenant')).toHaveTextContent('Doorstar Kft.');
  });

  it('renders avatar initials from name', () => {
    mockUseProfile.mockReturnValue({ isLoading: false, isError: false, data: mockProfile });
    renderPage();
    expect(screen.getByTestId('profile-avatar')).toHaveTextContent('TE');
  });
});
