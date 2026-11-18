import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  CommissionQuoteRequest,
  CommissionQuoteResponse,
} from '../types/commissionQuote';
import { useCommissionQuote } from './useCommissionQuote';

vi.mock('../api/commissionQuoteApi', () => ({
  requestCommissionQuote: vi.fn(),
}));

import { requestCommissionQuote } from '../api/commissionQuoteApi';

const mockRequestCommissionQuote = vi.mocked(requestCommissionQuote);

const request: CommissionQuoteRequest = {
  loanAmount: 500000,
  loanTermInMonths: 360,
  riskBand: 'LOW',
};

const quote: CommissionQuoteResponse = {
  quoteId: 'CQ-123456',
  commissionRate: 0.015,
  totalCommission: 7500,
};

describe('useCommissionQuote', () => {
  beforeEach(() => {
    mockRequestCommissionQuote.mockReset();
  });

  it('stores the returned quote and invokes the success callback', async () => {
    mockRequestCommissionQuote.mockResolvedValue(quote);
    const onQuoteGenerated = vi.fn();
    const { result } = renderHook(() => useCommissionQuote({ onQuoteGenerated }));

    await act(async () => {
      await result.current.submitQuote(request);
    });

    expect(mockRequestCommissionQuote).toHaveBeenCalledWith(request);
    expect(result.current.quote).toEqual(quote);
    expect(result.current.error).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
    expect(onQuoteGenerated).toHaveBeenCalledWith(quote);
  });

  it('stores API errors and clears loading state', async () => {
    mockRequestCommissionQuote.mockRejectedValue(new Error('Vendor unavailable'));
    const { result } = renderHook(() => useCommissionQuote());

    await act(async () => {
      await result.current.submitQuote(request);
    });

    expect(result.current.error).toBe('Vendor unavailable');
    expect(result.current.quote).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('ignores a duplicate submission while the first request is pending', async () => {
    let resolveRequest: (value: CommissionQuoteResponse) => void = () => {};
    mockRequestCommissionQuote.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );
    const { result } = renderHook(() => useCommissionQuote());

    let firstSubmission: Promise<void> = Promise.resolve();
    act(() => {
      firstSubmission = result.current.submitQuote(request);
    });

    expect(result.current.isSubmitting).toBe(true);
    await act(async () => {
      await result.current.submitQuote(request);
    });
    expect(mockRequestCommissionQuote).toHaveBeenCalledOnce();

    await act(async () => {
      resolveRequest(quote);
      await firstSubmission;
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.quote).toEqual(quote);
  });
});
