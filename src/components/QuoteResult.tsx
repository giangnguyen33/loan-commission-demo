import type { CommissionQuoteResponse } from '../types/commissionQuote';
import './QuoteResult.css';

interface QuoteResultProps {
  quote: CommissionQuoteResponse;
}

const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

const rateFormatter = new Intl.NumberFormat('en-AU', {
  style: 'percent',
  maximumFractionDigits: 2,
});

export const QuoteResult = ({ quote }: QuoteResultProps) => (
  <section className="quote-result" aria-labelledby="quote-result-title">
    <h3 id="quote-result-title">Quote result</h3>
    <dl className="quote-result-details">
      <div>
        <dt>Quote ID</dt>
        <dd>{quote.quoteId}</dd>
      </div>
      <div>
        <dt>Commission rate</dt>
        <dd>{rateFormatter.format(quote.commissionRate)}</dd>
      </div>
      <div>
        <dt>Total commission</dt>
        <dd>{currencyFormatter.format(quote.totalCommission)}</dd>
      </div>
    </dl>
  </section>
);
