import { act, render } from '@testing-library/react';
import { FadeIn } from '../motion-wrapper';

describe('FadeIn', () => {
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    global.IntersectionObserver = class {
      readonly root = null;
      readonly rootMargin = '-40px';
      readonly thresholds: ReadonlyArray<number> = [];
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] { return []; }
    } as unknown as typeof IntersectionObserver;
  });

  it('renders children', () => {
    const { getByText } = render(<FadeIn><p>Hello</p></FadeIn>);
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('wraps children in a div with the fade-in class', () => {
    const { container } = render(<FadeIn><p>Hello</p></FadeIn>);
    expect(container.firstElementChild).toHaveClass('fade-in');
  });

  it('applies no inline transition-delay when delay is 0 (default)', () => {
    const { container } = render(<FadeIn><p>Hello</p></FadeIn>);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.transitionDelay).toBe('');
  });

  it('applies transition-delay style when delay prop is provided', () => {
    const { container } = render(<FadeIn delay={0.3}><p>Hello</p></FadeIn>);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.transitionDelay).toBe('0.3s');
  });

  it('adds is-visible class when element enters the viewport', () => {
    const { container } = render(<FadeIn><p>Hello</p></FadeIn>);
    const wrapper = container.firstElementChild as HTMLElement;

    act(() => {
      observerCallback(
        [{ isIntersecting: true, target: wrapper } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(wrapper).toHaveClass('is-visible');
  });

  it('does not add is-visible when the element is not yet intersecting', () => {
    const { container } = render(<FadeIn><p>Hello</p></FadeIn>);
    const wrapper = container.firstElementChild as HTMLElement;

    act(() => {
      observerCallback(
        [{ isIntersecting: false, target: wrapper } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(wrapper).not.toHaveClass('is-visible');
  });
});
