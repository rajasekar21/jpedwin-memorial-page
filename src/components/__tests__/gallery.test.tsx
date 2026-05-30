import { render, screen, fireEvent, within } from '@testing-library/react';
import { Gallery } from '../gallery';
import { defaultContent } from '@/data/memorial';

// next/image stub
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, ...props }: { alt: string; fill?: boolean; sizes?: string; [key: string]: unknown }) => {
    delete props.fill;
    delete props.sizes;

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt} {...props} />
    );
  }
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

    const memoriesTab = screen.getByRole('tab', { name: 'Memories' });
    fireEvent.click(memoriesTab);

    expect(memoriesTab).toHaveAttribute('aria-selected', 'true');
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

  it('navigates between photos inside the selected album', () => {
    render(
      <Gallery
        photos={[
          { src: '/one.jpg', alt: 'First family photo', album: 'Memories', caption: 'First family photo' },
          { src: '/two.jpg', alt: 'Second family photo', album: 'Memories', caption: 'Second family photo' },
          { src: '/career.jpg', alt: 'Career photo', album: 'Recent', caption: 'Career photo' },
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /View photo: Memories/i }));
    expect(within(screen.getByRole('dialog')).getByAltText('First family photo')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Next photo/i }));
    expect(within(screen.getByRole('dialog')).getByAltText('Second family photo')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Previous photo/i }));
    expect(within(screen.getByRole('dialog')).getByAltText('First family photo')).toBeInTheDocument();
  });

  it('uses localized album names and photo counts', () => {
    render(
      <Gallery
        photos={[
          { src: '/one.jpg', alt: 'First photo', album: 'Memories', caption: '' },
          { src: '/two.jpg', alt: 'Second photo', album: 'Memories', caption: '' },
        ]}
        labels={{
          ...defaultContent.gallery,
          all: 'அனைத்தும்',
          viewPhoto: 'புகைப்படத்தை பார்க்க',
          photoCount: 'புகைப்படங்கள்',
          albumNames: { Memories: 'நினைவுகள்' },
        }}
      />
    );

    expect(screen.getByRole('button', { name: 'புகைப்படத்தை பார்க்க: நினைவுகள்' })).toHaveTextContent('நினைவுகள்');
    expect(screen.getByText('2 புகைப்படங்கள்')).toBeInTheDocument();
  });
});
