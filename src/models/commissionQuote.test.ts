import { describe, expect, it } from 'vitest';
import {
  COMMISSION_RATES,
  RISK_BANDS,
  type CommissionQuote,
  type LoanDetails,
} from './commissionQuote';

describe('frontend commission quote models', () => {
  it('defines supported risk bands and their illustrative rates', () => {
    expect(RISK_BANDS).toEqual(['LOW', 'MEDIUM', 'HIGH']);
    expect(COMMISSION_RATES).toEqual({
      LOW: 0.015,
      MEDIUM: 0.02,
      HIGH: 0.025,
    });
  });

  it('rejects risk bands outside the frontend model', () => {
    // @ts-expect-error EXTREME is not a supported frontend risk band.
    const unsupportedRiskBand: LoanDetails['riskBand'] = 'EXTREME';
    expect(unsupportedRiskBand).toBe('EXTREME');
  });

  it('allows the frontend quote model to evolve independently of API enums', () => {
    const quoteWithNewRate = {
      id: 'CQ-123456',
      rate: 0.03,
      total: 15000,
    } satisfies CommissionQuote;

    expect(quoteWithNewRate.rate).toBe(0.03);
  });
});