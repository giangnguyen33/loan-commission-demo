import type { components } from './generated';

export const RISK_BANDS = ['LOW', 'MEDIUM', 'HIGH'] as const;
export type RiskBand = components['schemas']['RiskBand'];

export const COMMISSION_RATES: Readonly<Record<RiskBand, number>> = {
  LOW: 0.015,
  MEDIUM: 0.02,
  HIGH: 0.025,
};

export type CommissionQuoteRequest =
  components['schemas']['CommissionQuoteRequest'];

export type CommissionQuoteResponse =
  components['schemas']['CommissionQuoteResponse'];

export type CommissionQuoteApiError = components['schemas']['ApiError'];
