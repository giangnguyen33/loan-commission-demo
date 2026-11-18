import { useState, type FormEvent } from 'react';
import type {
  CommissionQuoteRequest,
  CommissionQuoteResponse,
  RiskBand,
} from '../types/commissionQuote';
import { useCommissionQuote } from '../hooks/useCommissionQuote';
import { NumberField } from './NumberField';
import { QuoteResult } from './QuoteResult';
import './LoanQuoteForm.css';

type FieldErrors = Partial<
  Record<'loanAmount' | 'loanTermInMonths', string>
>;

interface LoanQuoteFormProps {
  onQuoteGenerated?: (quote: CommissionQuoteResponse) => void;
}

const riskBands: RiskBand[] = ['LOW', 'MEDIUM', 'HIGH'];

export const LoanQuoteForm = ({ onQuoteGenerated }: LoanQuoteFormProps) => {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTermInMonths, setLoanTermInMonths] = useState('');
  const [riskBand, setRiskBand] = useState<RiskBand>('LOW');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const {
    submitQuote,
    resetQuote,
    isSubmitting,
    error: submissionError,
    quote,
  } = useCommissionQuote({ onQuoteGenerated });

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const amount = Number(loanAmount);
    const term = Number(loanTermInMonths);
    const errors: FieldErrors = {};

    if (!loanAmount.trim()) {
      errors.loanAmount = 'Enter a loan amount.';
    } else if (!Number.isFinite(amount) || amount <= 0) {
      errors.loanAmount = 'Loan amount must be greater than 0.';
    }

    if (!loanTermInMonths.trim()) {
      errors.loanTermInMonths = 'Enter a loan term.';
    } else if (!Number.isInteger(term) || term <= 0) {
      errors.loanTermInMonths = 'Loan term must be a whole number greater than 0.';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const request: CommissionQuoteRequest = {
      loanAmount: amount,
      loanTermInMonths: term,
      riskBand,
    };
    await submitQuote(request);
  };

  return (
    <form
      className="loan-quote-form"
      noValidate
      onSubmit={(event) => void handleSubmit(event)}
      aria-busy={isSubmitting}
    >
      <div className="loan-form-fields">
        <NumberField
          id="loan-amount"
          name="loanAmount"
          label="Loan amount (AUD)"
          inputMode="decimal"
          min="0.01"
          step="0.01"
          value={loanAmount}
          error={fieldErrors.loanAmount}
          onValueChange={(value) => {
            resetQuote();
            setLoanAmount(value);
            clearFieldError('loanAmount');
          }}
        />

        <NumberField
          id="loan-term"
          name="loanTermInMonths"
          label="Loan term (months)"
          inputMode="numeric"
          min="1"
          step="1"
          value={loanTermInMonths}
          error={fieldErrors.loanTermInMonths}
          onValueChange={(value) => {
            resetQuote();
            setLoanTermInMonths(value);
            clearFieldError('loanTermInMonths');
          }}
        />

        <div className="loan-form-field loan-risk-field">
          <label htmlFor="risk-band">Risk band</label>
          <select
            id="risk-band"
            name="riskBand"
            value={riskBand}
            onChange={(event) => {
              resetQuote();
              setRiskBand(event.target.value as RiskBand);
            }}
          >
            {riskBands.map((band) => (
              <option key={band} value={band}>
                {band}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="loan-form-actions">
        <button type="submit">
          {isSubmitting ? 'Generating quote…' : 'Generate quote'}
        </button>
        {isSubmitting && (
          <p role="status" aria-live="polite">
            Generating quote. Please wait.
          </p>
        )}
        {submissionError && (
          <p className="submission-error" role="alert">
            {submissionError}
          </p>
        )}
        {quote && <QuoteResult quote={quote} />}
      </div>
    </form>
  );
};