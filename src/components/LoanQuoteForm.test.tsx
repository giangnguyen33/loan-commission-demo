import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  CommissionQuoteRequest,
  CommissionQuoteResponse,
} from '../types/commissionQuote';
import { LoanQuoteForm } from './LoanQuoteForm';

vi.mock('../api/commissionQuoteApi', () => ({
  requestCommissionQuote: vi.fn(),
}));

import { requestCommissionQuote } from '../api/commissionQuoteApi';

const mockRequestCommissionQuote = vi.mocked(requestCommissionQuote);

const quote: CommissionQuoteResponse = {
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
    mockRequestCommissionQuote.mockResolvedValue(quote);
    render(<LoanQuoteForm onQuoteGenerated={onQuoteGenerated} />);

    await fillValidForm(user);
    await user.selectOptions(screen.getByLabelText('Risk band'), 'MEDIUM');
    await user.click(screen.getByRole('button', { name: 'Generate quote' }));

    await waitFor(() =>
      expect(mockRequestCommissionQuote).toHaveBeenCalledWith({
        loanAmount: 500000,
        loanTermInMonths: 360,
        riskBand: 'MEDIUM',
      } satisfies CommissionQuoteRequest),
    );
    expect(await screen.findByRole('status')).toHaveTextContent('CQ-123456');
    expect(onQuoteGenerated).toHaveBeenCalledWith(quote);
  });

  it('does not resubmit identical details after a successful quote', async () => {
    const user = userEvent.setup();
    mockRequestCommissionQuote.mockResolvedValue(quote);
    render(<LoanQuoteForm />);

    await fillValidForm(user);
    const submitButton = screen.getByRole('button', { name: 'Generate quote' });
    await user.click(submitButton);
    expect(await screen.findByText('Quote CQ-123456 generated.')).toBeVisible();

    await user.click(submitButton);

    expect(mockRequestCommissionQuote).toHaveBeenCalledOnce();
  });

  it('allows another quote after the loan details change', async () => {
    const user = userEvent.setup();
    mockRequestCommissionQuote.mockResolvedValue(quote);
    render(<LoanQuoteForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Generate quote' }));
    expect(await screen.findByText('Quote CQ-123456 generated.')).toBeVisible();

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
    let resolveRequest: (value: CommissionQuoteResponse) => void = () => {};
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
    expect(screen.getByRole('status')).toHaveTextContent(
      'Generating quote. Please wait.',
    );

    await user.click(submitButton);
    await user.click(submitButton);
    await user.click(submitButton);
    expect(mockRequestCommissionQuote).toHaveBeenCalledOnce();

    resolveRequest(quote);
    expect(await screen.findByText('Quote CQ-123456 generated.')).toBeVisible();
  });

  it('shows API errors and permits retry', async () => {
    const user = userEvent.setup();
    mockRequestCommissionQuote
      .mockRejectedValueOnce(new Error('Vendor unavailable'))
      .mockResolvedValueOnce(quote);
    render(<LoanQuoteForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Generate quote' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Vendor unavailable');

    await user.click(screen.getByRole('button', { name: 'Generate quote' }));
    expect(await screen.findByRole('status')).toHaveTextContent('CQ-123456');
    expect(mockRequestCommissionQuote).toHaveBeenCalledTimes(2);
  });
});