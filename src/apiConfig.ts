import localConfig from './apiConfig.local';
import productionConfig from './apiConfig.production';

export const API_CONFIG = import.meta.env.PROD ? productionConfig : localConfig;

export const API_URL = API_CONFIG.apiUrl;
export const API_KEY = API_CONFIG.apiKey;
