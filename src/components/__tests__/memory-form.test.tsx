import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryForm } from '../memory-form';

jest.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: null
}));

beforeEach(() => {
  localStorage.clear();
});

describe('MemoryForm', () => {
  it('renders name, relationship, and message fields', () => {
    render(<MemoryForm />);
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/relationship/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/memory or tribute/i)).toBeInTheDocument();
  });

  it('honeypot field is hidden from assistive technology', () => {
    render(<MemoryForm />);
    const honeypot = document.querySelector('input[name="website"]') as HTMLInputElement;
    expect(honeypot).toBeInTheDocument();
    expect(honeypot).toHaveAttribute('aria-hidden', 'true');
    expect(honeypot).toHaveAttribute('tabindex', '-1');
  });

  it('all visible inputs are marked aria-required', () => {
    render(<MemoryForm />);
    expect(screen.getByLabelText(/your name/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/relationship/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/memory or tribute/i)).toHaveAttribute('aria-required', 'true');
  });

  it('shows an error when validation fails (message too short)', async () => {
    render(<MemoryForm />);
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/relationship/i), { target: { value: 'Friend' } });
    fireEvent.change(screen.getByLabelText(/memory or tribute/i), { target: { value: 'Short' } });
    fireEvent.submit(screen.getByRole('button', { name: /submit memory/i }).closest('form')!);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('shows success message when Supabase is not configured (Phase 1 mode)', async () => {
    render(<MemoryForm />);
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/relationship/i), { target: { value: 'Friend' } });
    fireEvent.change(screen.getByLabelText(/memory or tribute/i), {
      target: { value: 'He was a wonderful person who always made time for others.' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /submit memory/i }).closest('form')!);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert').textContent).toMatch(/Phase 1|received|submitted/i);
    });
  });

  it('photo file input accepts only image types', () => {
    render(<MemoryForm />);
    const input = document.querySelector('input[name="photo"]') as HTMLInputElement;
    expect(input).toHaveAttribute('accept', 'image/jpeg,image/png,image/webp');
    expect(input).toHaveAttribute('type', 'file');
  });

  it('photo remove button is not present before a file is selected', () => {
    render(<MemoryForm />);
    expect(screen.queryByRole('button', { name: /remove photo/i })).not.toBeInTheDocument();
  });

  it('shows a success message silently when the honeypot field is filled', async () => {
    render(<MemoryForm />);
    const honeypot = document.querySelector('input[name="website"]') as HTMLInputElement;
    fireEvent.change(honeypot, { target: { value: 'http://spam.com' } });

    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/relationship/i), { target: { value: 'Friend' } });
    fireEvent.change(screen.getByLabelText(/memory or tribute/i), {
      target: { value: 'He was a wonderful person who always made time for others.' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /submit memory/i }).closest('form')!);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    // Should appear to succeed (not reveal the honeypot mechanism)
    expect(screen.queryByRole('alert')?.className).not.toMatch(/red/);
  });

  it('blocks submissions after rate limit is exceeded', async () => {
    const timestamps = Array.from({ length: 3 }, () => Date.now());
    localStorage.setItem('memory_submissions', JSON.stringify(timestamps));

    render(<MemoryForm />);
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/relationship/i), { target: { value: 'Friend' } });
    fireEvent.change(screen.getByLabelText(/memory or tribute/i), {
      target: { value: 'He was a wonderful person who always made time for others.' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /submit memory/i }).closest('form')!);

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatch(/too many/i);
    });
  });
});
