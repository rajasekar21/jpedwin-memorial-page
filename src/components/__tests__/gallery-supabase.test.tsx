import { render, screen } from '@testing-library/react';
import { GallerySupabase } from '../gallery-supabase';
import type { GalleryPhoto, MemorialContent } from '@/data/memorial';

jest.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: null,
}));

jest.mock('@/components/gallery', () => ({
  Gallery: ({ photos }: { photos: GalleryPhoto[] }) => (
    <div data-testid="gallery">
      {photos.map((p) => (
        <img key={p.src} alt={p.alt} src={p.src} />
      ))}
    </div>
  ),
}));

const fallbackPhotos: GalleryPhoto[] = [
  { src: '/fallback.jpg', alt: 'Fallback portrait', album: 'Memories', caption: 'A family moment' },
  { src: '/fallback2.jpg', alt: 'Second fallback', album: 'Recent', caption: 'Another moment' },
];

const labels: MemorialContent['gallery'] = {
  all: 'All',
  ariaLabel: 'Photo albums',
  viewPhoto: 'View photo',
  dialogLabel: 'Photo',
  closePreview: 'Close',
  photoCount: 'photos',
};

describe('GallerySupabase', () => {
  it('renders the Gallery component', () => {
    render(<GallerySupabase fallbackPhotos={fallbackPhotos} labels={labels} />);
    expect(screen.getByTestId('gallery')).toBeInTheDocument();
  });

  it('passes fallback photos to Gallery when Supabase is not configured', () => {
    render(<GallerySupabase fallbackPhotos={fallbackPhotos} labels={labels} />);
    expect(screen.getByAltText('Fallback portrait')).toBeInTheDocument();
    expect(screen.getByAltText('Second fallback')).toBeInTheDocument();
  });

  it('renders all fallback photos when Supabase is not configured', () => {
    render(<GallerySupabase fallbackPhotos={fallbackPhotos} labels={labels} />);
    expect(screen.getAllByRole('img')).toHaveLength(fallbackPhotos.length);
  });
});
