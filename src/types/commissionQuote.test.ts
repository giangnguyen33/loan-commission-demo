import { describe, expect, it } from 'vitest';
import {
  type ApiCommissionQuoteError,
  type ApiCommissionQuoteRequest,
  type ApiCommissionQuoteResponse,
} from './commissionQuote';

const exampleRequest = {
  loanAmount: 500000,
  loanTermInMonths: 360,
  riskBand: 'LOW',
} satisfies ApiCommissionQuoteRequest;

const exampleResponse = {
  quoteId: 'CQ-123456',
  commissionRate: 0.015,
  totalCommission: 7500,
} satisfies ApiCommissionQuoteResponse;

const exampleError = {
  error: 'INVALID_REQUEST',
  message: 'Loan amount must be positive.',
} satisfies ApiCommissionQuoteError;

describe('commission quote contract', () => {


  it('supports the documented request, response, and error examples', () => {
    expect(exampleRequest).toEqual({
      loanAmount: 500000,
      loanTermInMonths: 360,
      riskBand: 'LOW',
    });
    expect(exampleResponse).toEqual({
      quoteId: 'CQ-123456',
      commissionRate: 0.015,
      totalCommission: 7500,
    });
    expect(exampleError.error).toBe('INVALID_REQUEST');
  });

  it('allows a positive fractional loan amount and the minimum loan term', () => {
    const boundaryRequest = {
      loanAmount: 0.01,
      loanTermInMonths: 1,
      riskBand: 'HIGH',
    } satisfies ApiCommissionQuoteRequest;

    expect(boundaryRequest).toEqual({
      loanAmount: 0.01,
      loanTermInMonths: 1,
      riskBand: 'HIGH',
    });
  });

  it('allows a zero commission total after rounding to cents', () => {
    const roundedResponse = {
      quoteId: 'CQ-000001',
      commissionRate: 0.015,
      totalCommission: 0,
    } satisfies ApiCommissionQuoteResponse;

    expect(roundedResponse.totalCommission).toBe(0);
  });

  it('rejects a risk band outside the OpenAPI enum', () => {
    // @ts-expect-error EXTREME is not part of the generated RiskBand enum.
    const unsupportedRiskBand: ApiCommissionQuoteRequest['riskBand'] = 'EXTREME';
    expect(unsupportedRiskBand).toBe('EXTREME');
  });

  it('rejects a commission rate outside the OpenAPI enum', () => {
    // @ts-expect-error 0.03 is not part of the generated commissionRate enum.
    const unsupportedRate: ApiCommissionQuoteResponse['commissionRate'] = 0.03;
    expect(unsupportedRate).toBe(0.03);
  });
});