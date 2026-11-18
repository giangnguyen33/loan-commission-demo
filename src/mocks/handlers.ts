import { delay, http, HttpResponse } from 'msw';
import { API_KEY, API_URL } from '../apiConfig';
import {
  COMMISSION_RATES,
  RISK_BANDS,
  type CommissionQuoteApiError,
  type CommissionQuoteRequest,
  type CommissionQuoteResponse,
} from '../types/commissionQuote';

export interface MockApiOptions {
  failureRate?: number;
  responseDelayMs?: number;
  random?: () => number;
}

const defaultOptions: Required<MockApiOptions> = {
  failureRate: 0.2,
  responseDelayMs: 1000,
  random: Math.random,
};

let quoteSequence = 0;

function isQuoteRequest(body: unknown): body is CommissionQuoteRequest {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return false;
  }

  const request = body as Record<string, unknown>;

  return (
    typeof request.loanAmount === 'number' &&
    Number.isFinite(request.loanAmount) &&
    request.loanAmount > 0 &&
    typeof request.loanTermInMonths === 'number' &&
    Number.isInteger(request.loanTermInMonths) &&
    request.loanTermInMonths > 0 &&
    typeof request.riskBand === 'string' &&
    (RISK_BANDS as readonly string[]).includes(request.riskBand)
  );
}

function errorResponse(error: string, message: string, status: number) {
  const body: CommissionQuoteApiError = { error, message };
  return HttpResponse.json(body, { status });
}

export function createCommissionQuoteHandlers(options: MockApiOptions = {}) {
  const config = { ...defaultOptions, ...options };
  const endpointPattern = new RegExp(
    `${API_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
  );

  return [
    http.post(endpointPattern, async ({ request }) => {
      await delay(config.responseDelayMs);

      const apiKey = request.headers.get('api-key');
      if (!apiKey) {
        return errorResponse('MISSING_API_KEY', 'API key is required.', 401);
      }
      if (apiKey !== API_KEY) {
        return errorResponse('INVALID_API_KEY', 'API key is invalid.', 403);
      }

      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return errorResponse('INVALID_REQUEST', 'Request body must be valid JSON.', 400);
      }

      if (!isQuoteRequest(body)) {
        return errorResponse(
          'INVALID_REQUEST',
          'Loan amount must be positive, loan term must be a positive integer, and risk band must be LOW, MEDIUM, or HIGH.',
          400,
        );
      }

      const scenario = request.headers.get('x-mock-scenario');
      const shouldFail =
        scenario === 'vendor-failure' ||
        (scenario !== 'success' && config.random() < config.failureRate);

      if (shouldFail) {
        return errorResponse(
          'VENDOR_UNAVAILABLE',
          'The commission quote service is temporarily unavailable.',
          503,
        );
      }

      const commissionRate = COMMISSION_RATES[body.riskBand];
      const totalCommission =
        Math.round((body.loanAmount * commissionRate + Number.EPSILON) * 100) /
        100;
      const quote: CommissionQuoteResponse = {
        quoteId: `CQ-${Date.now()}-${++quoteSequence}`,
        commissionRate,
        totalCommission,
      };

      return HttpResponse.json(quote);
    }),
  ];
}

export const handlers = createCommissionQuoteHandlers();
