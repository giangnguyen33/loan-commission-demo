import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  ApiCommissionQuoteRequest,
  ApiCommissionQuoteResponse,
} from '../types/commissionQuote';
import type { CommissionQuote } from '../models/commissionQuote';
import { LoanQuoteForm } from './LoanQuoteForm';

vi.mock('../api/commissionQuoteApi', () => ({
  requestCommissionQuote: vi.fn(),
}));

import { requestCommissionQuote } from '../api/commissionQuoteApi';

const mockRequestCommissionQuote = vi.mocked(requestCommissionQuote);

const quote: CommissionQuote = {
  id: 'CQ-123456',
  rate: 0.015,
  total: 7500,
};

const apiQuote: ApiCommissionQuoteResponse = {
  quoteId: 'CQ-123456',
  commissionRate: 0.015,
  totalCommission: 7500,
};

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('Loan amount (AUD)'), '500000');
  await user.type(screen.getByLabelText('Loan term (months)'), '360');
};

describe('LoanQuoteForm', () => {
  beforeEach(() => {
    mockRequestCommissionQuote.mockReset();
  });

  it('renders required loan fields and supported risk bands', () => {
    render(<LoanQuoteForm />);

    expect(screen.getByLabelText('Loan amount (AUD)')).toBeRequired();
    expect(screen.getByLabelText('Loan term (months)')).toBeRequired();
    expect(screen.getByLabelText('Risk band')).toHaveValue('LOW');
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'LOW',
      'MEDIUM',
      'HIGH',
    ]);
  });

  it('accepts input and risk-band selection', async () => {
    const user = userEvent.setup();
    render(<LoanQuoteForm />);

    await fillValidForm(user);
    await user.selectOptions(screen.getByLabelText('Risk band'), 'HIGH');

    expect(screen.getByLabelText('Loan amount (AUD)')).toHaveValue(500000);
    expect(screen.getByLabelText('Loan term (months)')).toHaveValue(360);
    expect(screen.getByLabelText('Risk band')).toHaveValue('HIGH');
  });

  it('requires loan amount and term', async () => {
    const user = userEvent.setup();
    render(<LoanQuoteForm />);

    await user.click(screen.getByRole('button', { name: 'Generate quote' }));

    expect(screen.getByText('Enter a loan amount.')).toBeVisible();
    expect(screen.getByText('Enter a loan term.')).toBeVisible();
    expect(mockRequestCommissionQuote).not.toHaveBeenCalled();
  });

  it.each(['0', '-25'])('rejects invalid loan amount %s', async (amount) => {
    const user = userEvent.setup();
    render(<LoanQuoteForm />);

    await user.type(screen.getByLabelText('Loan amount (AUD)'), amount);
    await user.type(screen.getByLabelText('Loan term (months)'), '12');
    await user.click(screen.getByRole('button', { name: 'Generate quote' }));

    expect(screen.getByText('Loan amount must be greater than 0.')).toBeVisible();
    expect(mockRequestCommissionQuote).not.toHaveBeenCalled();
  });

  it.each(['0', '1.5', '-2'])(
    'rejects invalid loan term %s',
    async (term) => {
      const user = userEvent.setup();
      render(<LoanQuoteForm />);

      await user.type(screen.getByLabelText('Loan amount (AUD)'), '1000');
      await user.type(screen.getByLabelText('Loan term (months)'), term);
      await user.click(screen.getByRole('button', { name: 'Generate quote' }));

      expect(
        screen.getByText('Loan term must be a whole number greater than 0.'),
      ).toBeVisible();
      expect(mockRequestCommissionQuote).not.toHaveBeenCalled();
    },
  );

  it('submits the typed request and reports the generated quote', async () => {
    const user = userEvent.setup();
    const onQuoteGenerated = vi.fn();
    mockRequestCommissionQuote.mockResolvedValue(apiQuote);
    render(<LoanQuoteForm onQuoteGenerated={onQuoteGenerated} />);

    await fillValidForm(user);
    await user.selectOptions(screen.getByLabelText('Risk band'), 'MEDIUM');
    await user.click(screen.getByRole('button', { name: 'Generate quote' }));

    await waitFor(() =>
      expect(mockRequestCommissionQuote).toHaveBeenCalledWith({
        loanAmount: 500000,
        loanTermInMonths: 360,
        riskBand: 'MEDIUM',
      } satisfies ApiCommissionQuoteRequest),
    );
    expect(
      await screen.findByRole('region', { name: 'Quote result' }),
    ).toHaveTextContent('CQ-123456');
    expect(onQuoteGenerated).toHaveBeenCalledWith(quote);
  });

  it('does not resubmit identical details after a successful quote', async () => {
    const user = userEvent.setup();
    mockRequestCommissionQuote.mockResolvedValue(apiQuote);
    render(<LoanQuoteForm />);

    await fillValidForm(user);
    const submitButton = screen.getByRole('button', { name: 'Generate quote' });
    await user.click(submitButton);
    expect(
      await screen.findByRole('region', { name: 'Quote result' }),
    ).toBeVisible();

    await user.click(submitButton);

    expect(mockRequestCommissionQuote).toHaveBeenCalledOnce();
  });

  it('allows another quote after the loan details change', async () => {
    const user = userEvent.setup();
    mockRequestCommissionQuote.mockResolvedValue(apiQuote);
    render(<LoanQuoteForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Generate quote' }));
    expect(
      await screen.findByRole('region', { name: 'Quote result' }),
    ).toBeVisible();

    const amountInput = screen.getByLabelText('Loan amount (AUD)');
    await user.clear(amountInput);
    await user.type(amountInput, '600000');
    await user.click(screen.getByRole('button', { name: 'Generate quote' }));

    await waitFor(() =>
      expect(mockRequestCommissionQuote).toHaveBeenCalledTimes(2),
    );
    expect(mockRequestCommissionQuote).toHaveBeenLastCalledWith({
      loanAmount: 600000,
      loanTermInMonths: 360,
      riskBand: 'LOW',
    });
  });

  it('keeps the button accessible and ignores rapid repeated clicks', async () => {
    const user = userEvent.setup();
    let resolveRequest: (value: ApiCommissionQuoteResponse) => void = () => {};
    mockRequestCommissionQuote.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );
    render(<LoanQuoteForm />);

    await fillValidForm(user);
    const submitButton = screen.getByRole('button');
    await user.click(submitButton);

    expect(
      screen.getByRole('button', { name: 'Generating quote…' }),
    ).toBeEnabled();
    expect(screen.getByRole('button').closest('form')).toHaveAttribute(
      'aria-busy',
      'true',
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Generating quote. Please wait.',
    );

    await user.click(submitButton);
    await user.click(submitButton);
    await user.click(submitButton);
    expect(mockRequestCommissionQuote).toHaveBeenCalledOnce();

    resolveRequest(apiQuote);
    expect(
      await screen.findByRole('region', { name: 'Quote result' }),
    ).toBeVisible();
  });

  it('shows API errors and permits retry', async () => {
    const user = userEvent.setup();
    mockRequestCommissionQuote
      .mockRejectedValueOnce(new Error('Vendor unavailable'))
      .mockResolvedValueOnce(apiQuote);
    render(<LoanQuoteForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Generate quote' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Vendor unavailable');

    await user.click(screen.getByRole('button', { name: 'Generate quote' }));
    expect(
      await screen.findByRole('region', { name: 'Quote result' }),
    ).toHaveTextContent('CQ-123456');
    expect(mockRequestCommissionQuote).toHaveBeenCalledTimes(2);
  });

  it.each([
    ['missing API key', 'API key is required.'],
    ['invalid API key', 'API key is invalid.'],
    [
      'vendor unavailable',
      'The commission quote service is temporarily unavailable.',
    ],
    [
      'network failure',
      'Unable to connect to the commission quote service.',
    ],
  ])('shows the %s message to the user', async (_caseName, message) => {
    const user = userEvent.setup();
    mockRequestCommissionQuote.mockRejectedValue(new Error(message));
    render(<LoanQuoteForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Generate quote' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(message);
  });

  it('clears a stale request error when the user edits the loan details', async () => {
    const user = userEvent.setup();
    mockRequestCommissionQuote.mockRejectedValueOnce(
      new Error('The commission quote service is temporarily unavailable.'),
    );
    render(<LoanQuoteForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Generate quote' }));
    expect(await screen.findByRole('alert')).toBeVisible();

    await user.type(screen.getByLabelText('Loan amount (AUD)'), '0');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});