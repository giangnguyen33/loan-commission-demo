import { afterEach, describe, expect, it, vi } from 'vitest';
import { API_KEY, API_URL } from '../apiConfig';
import type {
  ApiCommissionQuoteError,
  ApiCommissionQuoteRequest,
  ApiCommissionQuoteResponse,
} from '../types/commissionQuote';
import {
  CommissionQuoteClientError,
  requestCommissionQuote,
} from './commissionQuoteApi';

const request: ApiCommissionQuoteRequest = {
  loanAmount: 500000,
  loanTermInMonths: 360,
  riskBand: 'LOW',
};

const quote: ApiCommissionQuoteResponse = {
  quoteId: 'CQ-123456',
  commissionRate: 0.015,
  totalCommission: 7500,
};

const jsonResponse = (body: unknown, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('requestCommissionQuote', () => {
  it('sends a POST with the expected endpoint, headers, and request body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(quote));
    vi.stubGlobal('fetch', fetchMock);

    await requestCommissionQuote(request);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(API_URL);
    expect(options.method).toBe('POST');
    expect(new Headers(options.headers).get('Content-Type')).toBe(
      'application/json',
    );
    expect(new Headers(options.headers).get('api-key')).toBe(API_KEY);
    expect(JSON.parse(String(options.body))).toEqual({
      loanAmount: 500000,
      loanTermInMonths: 360,
      riskBand: 'LOW',
    });
  });

  it('returns the typed successful response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(quote)));

    await expect(requestCommissionQuote(request)).resolves.toEqual(quote);
  });

  it.each([
    [400, 'INVALID_REQUEST'],
    [401, 'MISSING_API_KEY'],
    [403, 'INVALID_API_KEY'],
    [503, 'VENDOR_UNAVAILABLE'],
  ])('converts HTTP %s to a client error', async (status, errorCode) => {
    const errorBody: ApiCommissionQuoteError = {
      error: errorCode,
      message: `Failure ${status}`,
    };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse(errorBody, status)),
    );

    await expect(requestCommissionQuote(request)).rejects.toMatchObject({
      name: 'CommissionQuoteClientError',
      message: `Failure ${status}`,
      status,
      code: errorCode,
    });
  });

  it('provides a fallback message when an HTTP error has no API error body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('unavailable', { status: 503 })),
    );

    await expect(requestCommissionQuote(request)).rejects.toMatchObject({
      message: 'Commission quote request failed (503).',
      status: 503,
      code: null,
    });
  });

  it('wraps network failures as client errors without an HTTP status', async () => {
    const networkError = new TypeError('Network unavailable');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(networkError));

    await expect(requestCommissionQuote(request)).rejects.toMatchObject({
      name: 'CommissionQuoteClientError',
      message: 'Unable to connect to the commission quote service.',
      status: null,
      code: null,
      cause: networkError,
    } satisfies Partial<CommissionQuoteClientError>);
  });
});