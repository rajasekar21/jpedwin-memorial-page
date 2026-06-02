import { fireEvent, render, screen } from '@testing-library/react';
import { HomePage } from '../home-page';

jest.mock('@/components/gallery-supabase', () => ({
  GallerySupabase: () => <div data-testid="gallery-supabase" />,
}));
jest.mock('@/components/memory-form', () => ({
  MemoryForm: () => <div data-testid="memory-form" />,
}));
jest.mock('@/components/memory-tributes', () => ({
  MemoryTributes: () => <div data-testid="memory-tributes" />,
}));
jest.mock('@/components/motion-wrapper', () => ({
  FadeIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('@/components/theme-provider', () => ({
  SiteHeader: ({
    onLanguageChange,
  }: {
    content: unknown;
    language: string;
    onLanguageChange: (lang: string) => void;
  }) => (
    <nav data-testid="site-header">
      <button onClick={() => onLanguageChange('ta')}>Switch to Tamil</button>
      <button onClick={() => onLanguageChange('en')}>Switch to English</button>
    </nav>
  ),
}));
jest.mock('@/components/visitor-count', () => ({
  VisitorCount: () => <span data-testid="visitor-count" />,
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
jest.mock('@/lib/site', () => ({
  withBasePath: (p: string) => p,
}));

const jsonLd = [{ '@type': 'WebPage', name: 'Test' }];

describe('HomePage', () => {
  it('renders a skip-to-main-content link', () => {
    render(<HomePage jsonLd={jsonLd} />);
    expect(screen.getByText(/skip/i)).toBeInTheDocument();
  });

  it('renders the memorial subject name as an h1 heading', () => {
    render(<HomePage jsonLd={jsonLd} />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the biography expand button with aria-expanded="false" initially', () => {
    render(<HomePage jsonLd={jsonLd} />);
    const expandBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expect(expandBtn).toBeInTheDocument();
    expect(expandBtn).toHaveAttribute('aria-expanded', 'false');
    expect(expandBtn).toHaveTextContent('Read more');
  });

  it('biography expand button toggles aria-expanded and its label on click', () => {
    render(<HomePage jsonLd={jsonLd} />);
    const expandBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-expanded') !== null
    )!;

    fireEvent.click(expandBtn);
    expect(expandBtn).toHaveAttribute('aria-expanded', 'true');
    expect(expandBtn).toHaveTextContent('Show less');

    fireEvent.click(expandBtn);
    expect(expandBtn).toHaveAttribute('aria-expanded', 'false');
    expect(expandBtn).toHaveTextContent('Read more');
  });

  it('sets document.documentElement.lang to "ta" when switching to Tamil', () => {
    render(<HomePage jsonLd={jsonLd} />);
    fireEvent.click(screen.getByText('Switch to Tamil'));
    expect(document.documentElement.lang).toBe('ta');
  });

  it('restores document.documentElement.lang to "en" when switching back to English', () => {
    render(<HomePage jsonLd={jsonLd} />);
    fireEvent.click(screen.getByText('Switch to Tamil'));
    fireEvent.click(screen.getByText('Switch to English'));
    expect(document.documentElement.lang).toBe('en');
  });

  it('renders the JSON-LD script tag', () => {
    render(<HomePage jsonLd={jsonLd} />);
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBeGreaterThan(0);
  });

  it('renders the visitor count widget', () => {
    render(<HomePage jsonLd={jsonLd} />);
    expect(screen.getByTestId('visitor-count')).toBeInTheDocument();
  });

  it('renders the memory form', () => {
    render(<HomePage jsonLd={jsonLd} />);
    expect(screen.getByTestId('memory-form')).toBeInTheDocument();
  });
});
