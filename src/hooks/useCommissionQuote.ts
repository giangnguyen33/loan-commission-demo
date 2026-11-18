import { useRef, useState } from 'react';
import { requestCommissionQuote } from '../api/commissionQuoteApi';
import type {
  CommissionQuoteRequest,
  CommissionQuoteResponse,
} from '../types/commissionQuote';

interface UseCommissionQuoteOptions {
  onQuoteGenerated?: (quote: CommissionQuoteResponse) => void;
}

export const useCommissionQuote = ({
  onQuoteGenerated,
}: UseCommissionQuoteOptions = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<CommissionQuoteResponse | null>(null);
  const submissionLock = useRef(false);
  const lastSuccessfulRequest = useRef<string | null>(null);

  const submitQuote = async (request: CommissionQuoteRequest) => {
    const requestKey = JSON.stringify(request);
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
      const result = await requestCommissionQuote(request);
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
