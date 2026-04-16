import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { StatusFilter } from '../components/StatusFilter';

function renderFilter(initialUrl = '/orders') {
  return render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <Routes>
        <Route path="/orders" element={<StatusFilter />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('StatusFilter', () => {
  it('renders 6 filter tabs', () => {
    renderFilter();
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(6);
  });

  it('"Összes" tab is active by default (no query param)', () => {
    renderFilter();
    const allTab = screen.getByTestId('filter-tab-all');
    expect(allTab).toHaveAttribute('aria-selected', 'true');
    expect(allTab.className).toContain('bg-blue-600');
  });

  it('active tab matches the current query param', () => {
    renderFilter('/orders?status=Draft');
    const draftTab = screen.getByTestId('filter-tab-Draft');
    expect(draftTab).toHaveAttribute('aria-selected', 'true');
    expect(draftTab.className).toContain('bg-blue-600');
  });

  it('clicking a status tab sets the query param', () => {
    renderFilter();
    fireEvent.click(screen.getByTestId('filter-tab-Submitted'));
    expect(screen.getByTestId('filter-tab-Submitted')).toHaveAttribute('aria-selected', 'true');
  });

  it('clicking "Összes" clears the status query param', () => {
    renderFilter('/orders?status=Draft');
    fireEvent.click(screen.getByTestId('filter-tab-all'));
    expect(screen.getByTestId('filter-tab-all')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('filter-tab-Draft')).toHaveAttribute('aria-selected', 'false');
  });

  it('all expected tab labels are rendered', () => {
    renderFilter();
    ['Összes', 'Piszkozat', 'Beküldve', 'Gyártásban', 'Kész', 'Törölve'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
