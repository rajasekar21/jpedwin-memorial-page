import { render, screen, fireEvent } from '@testing-library/react';
import { SiteHeader, ThemeToggle } from '../theme-provider';

describe('ThemeToggle', () => {
  it('renders a toggle button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: /toggle color theme/i })).toBeInTheDocument();
  });

  it('adds the dark class to documentElement when toggled on', () => {
    document.documentElement.classList.remove('dark');
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: /toggle color theme/i }));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes the dark class when toggled off', () => {
    document.documentElement.classList.add('dark');
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: /toggle color theme/i }));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

describe('SiteHeader', () => {
  it('renders the site logo link', () => {
    render(<SiteHeader />);
    expect(screen.getByRole('link', { name: /J\.P\. Edwin Chelliah/i })).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<SiteHeader />);
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    for (const label of ['About', 'Timeline', 'Gallery', 'Tributes', 'Family', 'Events']) {
      expect(nav).toHaveTextContent(label);
    }
  });

  it('opens and closes the mobile menu', () => {
    render(<SiteHeader />);
    const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(menuButton);
    expect(screen.getByRole('button', { name: /close navigation menu/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close navigation menu/i }));
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument();
  });

  it('mobile nav panel has correct id for aria-controls', () => {
    render(<SiteHeader />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(document.getElementById('mobile-navigation')).toBeInTheDocument();
  });
});
