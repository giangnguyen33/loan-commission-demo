export const RISK_BANDS = ['LOW', 'MEDIUM', 'HIGH'] as const;
export type RiskBand = (typeof RISK_BANDS)[number];

export const COMMISSION_RATES = {
  LOW: 0.015,
  MEDIUM: 0.02,
  HIGH: 0.025,
} as const satisfies Readonly<Record<RiskBand, number>>;

export interface LoanDetails {
  amount: number;
  termMonths: number;
  riskBand: RiskBand;
}

export interface CommissionQuote {
  id: string;
  rate: number;
  total: number;
}
