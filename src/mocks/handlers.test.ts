import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { API_KEY, API_URL } from '../apiConfig';
import type {
  CommissionQuoteRequest,
  CommissionQuoteResponse,
} from '../types/commissionQuote';
import { createCommissionQuoteHandlers } from './handlers';
import { server } from './server';

const validRequest: CommissionQuoteRequest = {
  loanAmount: 500000,
  loanTermInMonths: 360,
  riskBand: 'LOW',
};

const endpoint = `http://localhost${API_URL}`;

async function postQuote(
  body: unknown = validRequest,
  apiKey: string | null = API_KEY,
  scenario?: 'success' | 'vendor-failure',
) {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (apiKey !== null) {
    headers.set('api-key', apiKey);
  }
  if (scenario) {
    headers.set('x-mock-scenario', scenario);
  }

  return fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

describe('commission quote MSW handler', () => {
  beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('returns 401 when the API key is missing', async () => {
    const response = await postQuote(validRequest, null);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      error: 'MISSING_API_KEY',
      message: expect.any(String),
    });
  });

  it('returns 403 when the API key is invalid', async () => {
    const response = await postQuote(validRequest, 'wrong-key');

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      error: 'INVALID_API_KEY',
      message: expect.any(String),
    });
  });

  it.each([
    ['zero amount', { ...validRequest, loanAmount: 0 }],
    ['negative amount', { ...validRequest, loanAmount: -1 }],
    ['infinite amount', { ...validRequest, loanAmount: Number.POSITIVE_INFINITY }],
    ['zero term', { ...validRequest, loanTermInMonths: 0 }],
    ['fractional term', { ...validRequest, loanTermInMonths: 1.5 }],
    ['unsupported risk band', { ...validRequest, riskBand: 'EXTREME' }],
    ['missing request property', { loanAmount: 500000, riskBand: 'LOW' }],
    ['non-object request', null],
  ])('returns 400 for %s', async (_caseName, body) => {
    server.use(...createCommissionQuoteHandlers({ responseDelayMs: 0 }));
    const response = await postQuote(body);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: 'INVALID_REQUEST',
      message: expect.any(String),
    });
  });

  it.each([
    ['LOW', 0.015, 7500],
    ['MEDIUM', 0.02, 10000],
    ['HIGH', 0.025, 12500],
  ] as const)(
    'returns the correct %s commission quote',
    async (riskBand, commissionRate, totalCommission) => {
      server.use(
        ...createCommissionQuoteHandlers({ failureRate: 0, responseDelayMs: 0 }),
      );
      const response = await postQuote({ ...validRequest, riskBand });
      const quote = (await response.json()) as CommissionQuoteResponse;

      expect(response.status).toBe(200);
      expect(quote).toMatchObject({ commissionRate, totalCommission });
      expect(quote.quoteId).toMatch(/^CQ-/);
    },
  );

  it('returns a unique quote ID for each successful request', async () => {
    server.use(
      ...createCommissionQuoteHandlers({ failureRate: 0, responseDelayMs: 0 }),
    );
    const first = (await (await postQuote()).json()) as CommissionQuoteResponse;
    const second = (await (await postQuote()).json()) as CommissionQuoteResponse;

    expect(first.quoteId).not.toBe(second.quoteId);
  });

  it('can deterministically simulate a vendor failure', async () => {
    server.use(
      ...createCommissionQuoteHandlers({ failureRate: 1, responseDelayMs: 0 }),
    );
    const response = await postQuote();

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: 'VENDOR_UNAVAILABLE',
      message: expect.any(String),
    });
  });

  it('forces success for the deterministic success scenario', async () => {
    server.use(
      ...createCommissionQuoteHandlers({ failureRate: 1, responseDelayMs: 0 }),
    );
    const response = await postQuote(validRequest, API_KEY, 'success');

    expect(response.status).toBe(200);
  });

  it('forces a vendor failure for the deterministic failure scenario', async () => {
    server.use(
      ...createCommissionQuoteHandlers({ failureRate: 0, responseDelayMs: 0 }),
    );
    const response = await postQuote(validRequest, API_KEY, 'vendor-failure');

    expect(response.status).toBe(503);
  });

  it('returns 400 for malformed JSON', async () => {
    server.use(...createCommissionQuoteHandlers({ responseDelayMs: 0 }));
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'api-key': API_KEY,
      },
      body: '{invalid json',
    });

    expect(response.status).toBe(400);
  });
});
