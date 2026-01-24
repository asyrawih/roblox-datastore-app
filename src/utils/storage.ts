import { ApiConfig } from '../types/datastore';

const API_CONFIG_KEY = 'roblox_api_config';

export const storage = {
  saveConfig(config: ApiConfig): void {
    localStorage.setItem(API_CONFIG_KEY, JSON.stringify(config));
  },

  getConfig(): ApiConfig | null {
    const stored = localStorage.getItem(API_CONFIG_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as ApiConfig;
    } catch {
      return null;
    }
  },

  clearConfig(): void {
    localStorage.removeItem(API_CONFIG_KEY);
  },
};
