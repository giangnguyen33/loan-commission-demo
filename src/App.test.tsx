import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the quote workspace', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Quote workspace' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'New quote' })).toBeVisible();
  });
});
