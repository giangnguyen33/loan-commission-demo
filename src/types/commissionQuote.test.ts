import { describe, expect, it } from 'vitest';
import {
  COMMISSION_RATES,
  RISK_BANDS,
  type CommissionQuoteApiError,
  type CommissionQuoteRequest,
  type CommissionQuoteResponse,
} from './commissionQuote';

const exampleRequest = {
  loanAmount: 500000,
  loanTermInMonths: 360,
  riskBand: 'LOW',
} satisfies CommissionQuoteRequest;

const exampleResponse = {
  quoteId: 'CQ-123456',
  commissionRate: 0.015,
  totalCommission: 7500,
} satisfies CommissionQuoteResponse;

const exampleError = {
  error: 'INVALID_REQUEST',
  message: 'Loan amount must be positive.',
} satisfies CommissionQuoteApiError;

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
    } satisfies CommissionQuoteRequest;

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
    } satisfies CommissionQuoteResponse;

    expect(roundedResponse.totalCommission).toBe(0);
  });

  it('exposes all supported risk bands and their illustrative rates', () => {
    expect(RISK_BANDS).toEqual(['LOW', 'MEDIUM', 'HIGH']);
    expect(COMMISSION_RATES).toEqual({
      LOW: 0.015,
      MEDIUM: 0.02,
      HIGH: 0.025,
    });
  });

  it('rejects a risk band outside the OpenAPI enum', () => {
    expect(RISK_BANDS).not.toContain('EXTREME');

    // @ts-expect-error EXTREME is not part of the generated RiskBand enum.
    const unsupportedRiskBand: CommissionQuoteRequest['riskBand'] = 'EXTREME';
    expect(unsupportedRiskBand).toBe('EXTREME');
  });

  it('rejects a commission rate outside the OpenAPI enum', () => {
    expect(Object.values(COMMISSION_RATES)).not.toContain(0.03);

    // @ts-expect-error 0.03 is not part of the generated commissionRate enum.
    const unsupportedRate: CommissionQuoteResponse['commissionRate'] = 0.03;
    expect(unsupportedRate).toBe(0.03);
  });

  it.each([
    ['LOW', 0.015, 7500],
    ['MEDIUM', 0.02, 10000],
    ['HIGH', 0.025, 12500],
  ] as const)(
    'matches the documented %s rate and example commission',
    (riskBand, commissionRate, totalCommission) => {
      expect(COMMISSION_RATES[riskBand]).toBe(commissionRate);
      expect(exampleRequest.loanAmount * COMMISSION_RATES[riskBand]).toBe(
        totalCommission,
      );
    },
  );
});