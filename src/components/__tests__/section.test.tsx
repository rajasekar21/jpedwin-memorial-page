import { render, screen } from '@testing-library/react';
import { Section } from '../section';

describe('Section', () => {
  it('renders the title', () => {
    render(<Section id="test" title="A life well lived"><p>content</p></Section>);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A life well lived');
  });

  it('renders children', () => {
    render(<Section id="test" title="Title"><p>Child content here</p></Section>);
    expect(screen.getByText('Child content here')).toBeInTheDocument();
  });

  it('renders eyebrow text when provided', () => {
    render(<Section id="test" eyebrow="About him" title="Title"><span /></Section>);
    expect(screen.getByText('About him')).toBeInTheDocument();
  });

  it('does not render eyebrow element when omitted', () => {
    render(<Section id="test" title="Title"><span /></Section>);
    expect(screen.queryByText('About him')).not.toBeInTheDocument();
  });

  it('sets the section id for anchor navigation', () => {
    const { container } = render(<Section id="timeline" title="Title"><span /></Section>);
    expect(container.querySelector('#timeline')).toBeInTheDocument();
  });

  it('applies additional className', () => {
    const { container } = render(
      <Section id="test" title="Title" className="bg-linen"><span /></Section>
    );
    expect(container.querySelector('section')).toHaveClass('bg-linen');
  });
});
