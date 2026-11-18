import { expect, test, type Page } from '@playwright/test';

const fillQuoteForm = async (page: Page, riskBand = 'LOW') => {
  await page.getByLabel('Loan amount (AUD)').fill('500000');
  await page.getByLabel('Loan term (months)').fill('360');
  await page.getByLabel('Risk band').selectOption(riskBand);
};

test.beforeEach(async ({ page }) => {
  await page.context().setExtraHTTPHeaders({ 'x-mock-scenario': 'success' });
  await page.goto('/');
});

test('generates a quote and displays quote details', async ({ page }) => {
  await fillQuoteForm(page);
  await page.getByRole('button', { name: 'Generate quote' }).click();

  const result = page.getByRole('region', { name: 'Quote result' });
  await expect(result).toBeVisible();
  await expect(result).toContainText('CQ-');
  await expect(result).toContainText('1.5%');
  await expect(result).toContainText('$7,500.00');
});

test('validates a non-positive loan amount', async ({ page }) => {
  await page.getByLabel('Loan amount (AUD)').fill('0');
  await page.getByLabel('Loan term (months)').fill('360');
  await page.getByRole('button', { name: 'Generate quote' }).click();

  await expect(page.getByText('Loan amount must be greater than 0.')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Quote result' })).toHaveCount(0);
});

test('validates a non-integer loan term', async ({ page }) => {
  await page.getByLabel('Loan amount (AUD)').fill('500000');
  await page.getByLabel('Loan term (months)').fill('1.5');
  await page.getByRole('button', { name: 'Generate quote' }).click();

  await expect(
    page.getByText('Loan term must be a whole number greater than 0.'),
  ).toBeVisible();
  await expect(page.getByRole('region', { name: 'Quote result' })).toHaveCount(0);
});

for (const quoteCase of [
  { riskBand: 'LOW', rate: '1.5%', total: '$7,500.00' },
  { riskBand: 'MEDIUM', rate: '2%', total: '$10,000.00' },
  { riskBand: 'HIGH', rate: '2.5%', total: '$12,500.00' },
]) {
  test(`generates the correct ${quoteCase.riskBand} commission`, async ({ page }) => {
    await fillQuoteForm(page, quoteCase.riskBand);
    await page.getByRole('button', { name: 'Generate quote' }).click();

    const result = page.getByRole('region', { name: 'Quote result' });
    await expect(result).toBeVisible();
    await expect(result).toContainText(quoteCase.rate);
    await expect(result).toContainText(quoteCase.total);
  });
}

test('announces loading while a request is pending', async ({ page }) => {
  await fillQuoteForm(page);
  await page.getByRole('button', { name: 'Generate quote' }).click();

  await expect(page.getByRole('status')).toContainText(
    'Generating quote. Please wait.',
  );
  await expect(page.getByRole('region', { name: 'Quote result' })).toBeVisible();
});

test('shows a deterministic vendor failure and succeeds on retry', async ({ page }) => {
  await page.context().setExtraHTTPHeaders({
    'x-mock-scenario': 'vendor-failure',
  });
  await fillQuoteForm(page);
  await page.getByRole('button', { name: 'Generate quote' }).click();

  await expect(page.getByRole('alert')).toContainText(
    'The commission quote service is temporarily unavailable.',
  );

  await page.context().setExtraHTTPHeaders({ 'x-mock-scenario': 'success' });
  await page.getByRole('button', { name: 'Generate quote' }).click();

  await expect(page.getByRole('region', { name: 'Quote result' })).toBeVisible();
});