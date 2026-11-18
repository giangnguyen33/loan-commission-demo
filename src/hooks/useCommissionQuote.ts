import { useRef, useState } from 'react';
import { requestCommissionQuote } from '../api/commissionQuoteApi';
import type { CommissionQuote, LoanDetails } from '../models/commissionQuote';
import {
  toApiCommissionQuoteRequest,
  toCommissionQuote,
} from '../api/commissionQuoteMapper';

interface UseCommissionQuoteOptions {
  onQuoteGenerated?: (quote: CommissionQuote) => void;
}

export const useCommissionQuote = ({
  onQuoteGenerated,
}: UseCommissionQuoteOptions = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<CommissionQuote | null>(null);
  const submissionLock = useRef(false);
  const lastSuccessfulRequest = useRef<string | null>(null);

  const submitQuote = async (details: LoanDetails) => {
    const requestKey = JSON.stringify(details);
    if (
      submissionLock.current ||
      lastSuccessfulRequest.current === requestKey
    ) {
      return;
    }

    submissionLock.current = true;
    setIsSubmitting(true);
    setError(null);
    setQuote(null);

    try {
      const apiRequest = toApiCommissionQuoteRequest(details);
      const apiResponse = await requestCommissionQuote(apiRequest);
      const result = toCommissionQuote(apiResponse);
      lastSuccessfulRequest.current = requestKey;
      setQuote(result);
      onQuoteGenerated?.(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to generate a quote. Please try again.',
      );
    } finally {
      submissionLock.current = false;
      setIsSubmitting(false);
    }
  };

  const resetQuote = () => {
    lastSuccessfulRequest.current = null;
    setError(null);
    setQuote(null);
  };

  return { submitQuote, resetQuote, isSubmitting, error, quote };
};
