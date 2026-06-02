import { render, screen } from '@testing-library/react';
import { QrCard } from '../qr-card';

jest.mock('react-qr-code', () => ({
  __esModule: true,
  default: ({ value }: { value: string }) => <div data-testid="qr-code" data-value={value} />,
}));

const labels = {
  subtitle: 'Memorial',
  scanPrompt: 'Scan to visit the memorial page',
  downloadPng: 'Download PNG',
  print: 'Print',
  printedBy: 'Printed by the Edwin Chelliah family',
};

const defaultProps = {
  url: 'https://www.edwinchelliah.com',
  fullName: 'J.P. Edwin Chelliah',
  birthYear: '1955',
  deathDate: '2025',
  labels,
};

describe('QrCard', () => {
  it('renders the memorial subject full name', () => {
    render(<QrCard {...defaultProps} />);
    expect(screen.getByText('J.P. Edwin Chelliah')).toBeInTheDocument();
  });

  it('renders the birth year and death date', () => {
    render(<QrCard {...defaultProps} />);
    expect(screen.getByText(/1955/)).toBeInTheDocument();
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  it('renders the scan prompt text', () => {
    render(<QrCard {...defaultProps} />);
    expect(screen.getByText('Scan to visit the memorial page')).toBeInTheDocument();
  });

  it('renders download and print action buttons', () => {
    render(<QrCard {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Download PNG' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Print' })).toBeInTheDocument();
  });

  it('passes the correct URL to the QR code generator', () => {
    render(<QrCard {...defaultProps} />);
    expect(screen.getByTestId('qr-code')).toHaveAttribute('data-value', 'https://www.edwinchelliah.com');
  });

  it('displays the URL with the https:// scheme stripped', () => {
    render(<QrCard {...defaultProps} />);
    expect(screen.getByText('www.edwinchelliah.com')).toBeInTheDocument();
  });

  it('renders the printed-by attribution note', () => {
    render(<QrCard {...defaultProps} />);
    expect(screen.getByText('Printed by the Edwin Chelliah family')).toBeInTheDocument();
  });
});
