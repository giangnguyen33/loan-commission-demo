import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
  it('announces the loading message as a polite status', () => {
    render(<LoadingState message="Generating quote. Please wait." />);

    expect(screen.getByRole('status')).toHaveTextContent(
      'Generating quote. Please wait.',
    );
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('keeps the decorative spinner hidden from assistive technology', () => {
    render(<LoadingState message="Loading" />);

    expect(document.querySelector('.loading-indicator')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});
