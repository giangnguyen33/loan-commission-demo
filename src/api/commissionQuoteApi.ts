import { API_KEY, API_URL } from '../apiConfig';
import type {
  ApiCommissionQuoteError,
  ApiCommissionQuoteRequest,
  ApiCommissionQuoteResponse,
} from '../types/commissionQuote';

export class CommissionQuoteClientError extends Error {
  constructor(
    message: string,
    readonly status: number | null,
    readonly code: string | null,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'CommissionQuoteClientError';
  }
}

const isApiError = (value: unknown): value is ApiCommissionQuoteError => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const body = value as Record<string, unknown>;
  return typeof body.error === 'string' && typeof body.message === 'string';
};

export const requestCommissionQuote = async (
  request: ApiCommissionQuoteRequest,
): Promise<ApiCommissionQuoteResponse> => {
  let response: Response;

  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
      body: JSON.stringify(request),
    });
  } catch (cause) {
    throw new CommissionQuoteClientError(
      'Unable to connect to the commission quote service.',
      null,
      null,
      { cause },
    );
  }

  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = null;
    }

    const apiError = isApiError(errorBody) ? errorBody : null;
    throw new CommissionQuoteClientError(
      apiError?.message ?? `Commission quote request failed (${response.status}).`,
      response.status,
      apiError?.error ?? null,
    );
  }

  return (await response.json()) as ApiCommissionQuoteResponse;
};