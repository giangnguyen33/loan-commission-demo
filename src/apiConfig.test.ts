import { describe, expect, it } from 'vitest';
import localConfig from './apiConfig.local';
import productionConfig from './apiConfig.production';
import { API_CONFIG } from './apiConfig';

describe('API environment configuration', () => {
  it('defaults local and production environments to the mock server', () => {
    expect(localConfig.useMockServer).toBe(true);
    expect(productionConfig.useMockServer).toBe(true);
  });

  it('selects the current environment configuration', () => {
    expect(API_CONFIG).toEqual(
      import.meta.env.PROD ? productionConfig : localConfig,
    );
  });
});
