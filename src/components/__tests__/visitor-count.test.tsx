import { render, waitFor } from '@testing-library/react';
import { VisitorCount } from '../visitor-count';

jest.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: null,
}));

const LOCAL_KEY = 'jpedwin_memorial_visitor_count';
const SESSION_KEY = 'jpedwin_memorial_visitor_counted';

describe('VisitorCount', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  function visitorText(container: HTMLElement) {
    return container.querySelector('[aria-live="polite"]')?.textContent ?? '';
  }

  it('shows 1 for a brand-new visitor with no prior data', async () => {
    const { container } = render(<VisitorCount label="Visitors" />);
    await waitFor(() => expect(visitorText(container)).toContain('Visitors: 1'));
  });

  it('does not re-increment within the same session', async () => {
    localStorage.setItem(LOCAL_KEY, '7');
    sessionStorage.setItem(SESSION_KEY, 'true');

    const { container } = render(<VisitorCount label="Visitors" />);
    await waitFor(() => expect(visitorText(container)).toContain('Visitors: 7'));
  });

  it('increments from an existing localStorage count for a new session', async () => {
    localStorage.setItem(LOCAL_KEY, '42');

    const { container } = render(<VisitorCount label="Visitors" />);
    await waitFor(() => expect(visitorText(container)).toContain('Visitors: 43'));
  });

  it('persists the updated count to localStorage after incrementing', async () => {
    localStorage.setItem(LOCAL_KEY, '9');

    render(<VisitorCount label="Visitors" />);
    await waitFor(() => {
      expect(localStorage.getItem(LOCAL_KEY)).toBe('10');
    });
  });

  it('marks the session as counted after the first visit', async () => {
    render(<VisitorCount label="Visitors" />);
    await waitFor(() => {
      expect(sessionStorage.getItem(SESSION_KEY)).toBe('true');
    });
  });

  it('has aria-live="polite" so count updates are announced to screen readers', () => {
    const { container } = render(<VisitorCount label="Visitors" />);
    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();
  });

  it('renders the custom label text', async () => {
    const { container } = render(<VisitorCount label="Page views" />);
    await waitFor(() => expect(visitorText(container)).toContain('Page views:'));
  });
});
