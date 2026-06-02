import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RsvpForm, type RsvpLabels } from '../rsvp-form';

jest.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: null,
}));

const labels: RsvpLabels = {
  formTitle: 'RSVP for the Event',
  nameLabel: 'Full Name',
  emailLabel: 'Email',
  emailHint: '(optional)',
  guestCountLabel: 'Number of Guests',
  messageLabel: 'Message',
  messageHint: '(optional)',
  submit: 'Submit RSVP',
  submitting: 'Submitting…',
  successMessage: 'Thank you for your RSVP!',
  phaseOneMessage: 'Please email {email} to register.',
  errorMessage: 'Something went wrong. Please try again.',
};

describe('RsvpForm', () => {
  it('renders the form title', () => {
    render(<RsvpForm eventTitle="Memorial Service" labels={labels} contactEmail="family@example.com" />);
    expect(screen.getByText('RSVP for the Event')).toBeInTheDocument();
  });

  it('renders name, email, guest count, and message fields', () => {
    render(<RsvpForm eventTitle="Memorial Service" labels={labels} contactEmail="family@example.com" />);
    expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/)).toBeInTheDocument();
  });

  it('guest count dropdown has exactly 10 options numbered 1–10', () => {
    render(<RsvpForm eventTitle="Memorial Service" labels={labels} contactEmail="family@example.com" />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(10);
    expect(options[0]).toHaveValue('1');
    expect(options[9]).toHaveValue('10');
  });

  it('submit button is enabled in idle state', () => {
    render(<RsvpForm eventTitle="Memorial Service" labels={labels} contactEmail="family@example.com" />);
    expect(screen.getByRole('button', { name: 'Submit RSVP' })).not.toBeDisabled();
  });

  it('does not submit and shows no success when name is empty', async () => {
    render(<RsvpForm eventTitle="Memorial Service" labels={labels} contactEmail="family@example.com" />);
    fireEvent.click(screen.getByRole('button', { name: 'Submit RSVP' }));
    await waitFor(() => {
      expect(screen.queryByText(/Thank you/)).not.toBeInTheDocument();
    });
  });

  it('shows phase-one message with email substituted when Supabase is not configured', async () => {
    render(<RsvpForm eventTitle="Memorial Service" labels={labels} contactEmail="family@example.com" />);
    fireEvent.change(screen.getByLabelText(/Full Name/), { target: { value: 'Jane Doe' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit RSVP' }));

    await waitFor(() => {
      expect(screen.getByText('Please email family@example.com to register.')).toBeInTheDocument();
    });
  });

  it('hides the form after a successful submission', async () => {
    render(<RsvpForm eventTitle="Memorial Service" labels={labels} contactEmail="family@example.com" />);
    fireEvent.change(screen.getByLabelText(/Full Name/), { target: { value: 'Jane Doe' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit RSVP' }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Submit RSVP' })).not.toBeInTheDocument();
    });
  });

  it('does not show error message on initial render', () => {
    render(<RsvpForm eventTitle="Memorial Service" labels={labels} contactEmail="family@example.com" />);
    expect(screen.queryByText(labels.errorMessage)).not.toBeInTheDocument();
  });
});
