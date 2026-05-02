import { render, screen, fireEvent, within } from '@testing-library/react';
import { Gallery } from '../gallery';

// next/image stub
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  )
}));

jest.mock('@/lib/site', () => ({
  withBasePath: (p: string) => p
}));

describe('Gallery', () => {
  it('renders All tab selected by default', () => {
    render(<Gallery />);
    const allTab = screen.getByRole('tab', { name: 'All' });
    expect(allTab).toHaveAttribute('aria-selected', 'true');
  });

  it('renders at least one photo button', () => {
    render(<Gallery />);
    const buttons = screen.getAllByRole('button', { name: /View photo:/i });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('filters photos when a non-All album tab is clicked', () => {
    render(<Gallery />);
    const allInitial = screen.getAllByRole('button', { name: /View photo:/i }).length;

    const familyTab = screen.getByRole('tab', { name: 'Family' });
    fireEvent.click(familyTab);

    expect(familyTab).toHaveAttribute('aria-selected', 'true');
    const filtered = screen.getAllByRole('button', { name: /View photo:/i }).length;
    expect(filtered).toBeLessThanOrEqual(allInitial);
  });

  it('opens lightbox modal when a photo is clicked', () => {
    render(<Gallery />);
    const [firstPhoto] = screen.getAllByRole('button', { name: /View photo:/i });
    fireEvent.click(firstPhoto);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes lightbox when close button is clicked', () => {
    render(<Gallery />);
    fireEvent.click(screen.getAllByRole('button', { name: /View photo:/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /Close photo preview/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes lightbox on Escape key', () => {
    render(<Gallery />);
    fireEvent.click(screen.getAllByRole('button', { name: /View photo:/i })[0]);
    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('modal has aria-modal and accessible label', () => {
    render(<Gallery />);
    fireEvent.click(screen.getAllByRole('button', { name: /View photo:/i })[0]);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label');
  });
});
