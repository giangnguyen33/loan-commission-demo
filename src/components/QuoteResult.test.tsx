import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { CommissionQuote } from '../models/commissionQuote';
import { QuoteResult } from './QuoteResult';

const quote: CommissionQuote = {
  id: 'CQ-123456',
  rate: 0.015,
  total: 7500,
};

describe('QuoteResult', () => {
  it('displays the quote ID, rate, and AUD commission total', () => {
    render(<QuoteResult quote={quote} />);

    expect(screen.getByRole('region', { name: 'Quote result' })).toBeVisible();
    expect(screen.getByText('CQ-123456')).toBeVisible();
    expect(screen.getByText('1.5%')).toBeVisible();
    expect(screen.getByText('$7,500.00')).toBeVisible();
  });

  it('formats a commission below one dollar as AUD currency', () => {
    render(<QuoteResult quote={{ ...quote, total: 0.25 }} />);

    expect(screen.getByText('$0.25')).toBeVisible();
  });
});
