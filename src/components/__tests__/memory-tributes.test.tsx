import { render, screen } from '@testing-library/react';
import { MemoryTributes } from '../memory-tributes';
import type { Tribute } from '@/data/memorial';

jest.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: null,
}));

const stringTribute: Tribute = {
  name: 'Mary Johnson',
  relationship: 'Daughter',
  message: 'He was the kindest soul I have ever known.',
  date: '2025-06-15',
};

const arrayTribute: Tribute = {
  name: 'Robert Smith',
  relationship: 'Colleague',
  message: ['A great mentor.', 'Always there to help.'],
  date: '2025-06-16',
};

const mockLabels = {
  photoOf: 'Photo of',
  dateLocale: 'en-GB',
  readMore: 'Read more',
  showLess: 'Show less',
};

describe('MemoryTributes', () => {
  it('renders the name and relationship of each fallback tribute', () => {
    render(<MemoryTributes fallbackTributes={[stringTribute, arrayTribute]} labels={mockLabels} />);
    expect(screen.getByText('Mary Johnson')).toBeInTheDocument();
    expect(screen.getByText('Daughter')).toBeInTheDocument();
    expect(screen.getByText('Robert Smith')).toBeInTheDocument();
    expect(screen.getByText('Colleague')).toBeInTheDocument();
  });

  it('wraps a single-string message in typographic quotation marks', () => {
    render(<MemoryTributes fallbackTributes={[stringTribute]} labels={mockLabels} />);
    expect(screen.getByText(/“He was the kindest soul/)).toBeInTheDocument();
  });

  it('renders array message paragraphs without quotation marks', () => {
    render(<MemoryTributes fallbackTributes={[arrayTribute]} labels={mockLabels} />);
    expect(screen.getByText('A great mentor.')).toBeInTheDocument();
    expect(screen.getByText('Always there to help.')).toBeInTheDocument();
    expect(screen.queryByText(/“/)).not.toBeInTheDocument();
  });

  it('renders two-letter initials avatar when no photo is available', () => {
    render(<MemoryTributes fallbackTributes={[stringTribute, arrayTribute]} labels={mockLabels} />);
    expect(screen.getByText('MJ')).toBeInTheDocument();
    expect(screen.getByText('RS')).toBeInTheDocument();
  });

  it('renders an empty container when no tributes are provided', () => {
    const { container } = render(<MemoryTributes fallbackTributes={[]} labels={mockLabels} />);
    expect(container.querySelectorAll('article')).toHaveLength(0);
  });

  it('renders each tribute inside an article element', () => {
    render(<MemoryTributes fallbackTributes={[stringTribute, arrayTribute]} labels={mockLabels} />);
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });
});
