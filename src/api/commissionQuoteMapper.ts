import type {
  ApiCommissionQuoteRequest,
  ApiCommissionQuoteResponse,
} from '../types/commissionQuote';
import type { CommissionQuote, LoanDetails } from '../models/commissionQuote';

export const toApiCommissionQuoteRequest = (
  details: LoanDetails,
): ApiCommissionQuoteRequest => ({
  loanAmount: details.amount,
  loanTermInMonths: details.termMonths,
  riskBand: details.riskBand,
});

export const toCommissionQuote = (
  response: ApiCommissionQuoteResponse,
): CommissionQuote => ({
  id: response.quoteId,
  rate: response.commissionRate,
  total: response.totalCommission,
});
