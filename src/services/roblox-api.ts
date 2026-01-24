import axios, { AxiosInstance } from 'axios';
import {
  ApiConfig,
  ListDataStoresResponse,
  ListEntriesResponse,
  GetEntryResponse,
} from '../types/datastore';

class RobloxDataStoreAPI {
  private client: AxiosInstance | null = null;
  private config: ApiConfig | null = null;

  initialize(config: ApiConfig): void {
    this.config = config;
    this.client = axios.create({
      baseURL: 'https://apis.roblox.com/datastores/v1',
      headers: {
        'x-api-key': config.apiKey,
      },
    });
  }

  isInitialized(): boolean {
    return this.client !== null && this.config !== null;
  }

  async listDataStores(
    prefix?: string,
    cursor?: string,
    limit: number = 50
  ): Promise<ListDataStoresResponse> {
    if (!this.client || !this.config) {
      throw new Error('API not initialized');
    }

    const params: Record<string, string | number> = { limit };
    if (prefix) params.prefix = prefix;
    if (cursor) params.cursor = cursor;

    try {
      const response = await this.client.get(
        `/universes/${this.config.universeId}/standard-datastores`,
        { params }
      );

      return response.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      if (error.response) {
        throw new Error(
          `API Error: ${error.response.data?.message || error.response.statusText || 'Unknown error'} (Status: ${error.response.status})`
        );
      }
      throw new Error(`Network Error: ${error.message}`);
    }
  }

  async listEntries(
    datastoreName: string,
    scope: string = 'global',
    prefix?: string,
    cursor?: string,
    limit: number = 50
  ): Promise<ListEntriesResponse> {
    if (!this.client || !this.config) {
      throw new Error('API not initialized');
    }

    const params: Record<string, string | number> = { limit };
    if (prefix) params.prefix = prefix;
    if (cursor) params.cursor = cursor;

    const response = await this.client.get(
      `/universes/${this.config.universeId}/standard-datastores/datastore/entries`,
      {
        params: {
          ...params,
          datastoreName,
          scope,
        },
      }
    );

    return response.data;
  }

  async getEntry(
    datastoreName: string,
    entryKey: string,
    scope: string = 'global'
  ): Promise<GetEntryResponse> {
    if (!this.client || !this.config) {
      throw new Error('API not initialized');
    }

    const response = await this.client.get(
      `/universes/${this.config.universeId}/standard-datastores/datastore/entries/entry`,
      {
        params: {
          datastoreName,
          scope,
          entryKey,
        },
      }
    );

    return {
      value: response.data,
      version: response.headers['roblox-entry-version'] || '',
      userIds: response.headers['roblox-entry-userids']
        ? JSON.parse(response.headers['roblox-entry-userids'])
        : undefined,
      attributes: response.headers['roblox-entry-attributes']
        ? JSON.parse(response.headers['roblox-entry-attributes'])
        : undefined,
    };
  }

  async setEntry(
    datastoreName: string,
    entryKey: string,
    value: unknown,
    scope: string = 'global',
    userIds?: number[],
    attributes?: Record<string, unknown>
  ): Promise<{ version: string }> {
    if (!this.client || !this.config) {
      throw new Error('API not initialized');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (userIds && userIds.length > 0) {
      headers['roblox-entry-userids'] = JSON.stringify(userIds);
    }

    if (attributes) {
      headers['roblox-entry-attributes'] = JSON.stringify(attributes);
    }

    const response = await this.client.post(
      `/universes/${this.config.universeId}/standard-datastores/datastore/entries/entry`,
      value,
      {
        params: {
          datastoreName,
          scope,
          entryKey,
        },
        headers,
      }
    );

    return {
      version: response.headers['roblox-entry-version'] || '',
    };
  }

  async deleteEntry(
    datastoreName: string,
    entryKey: string,
    scope: string = 'global'
  ): Promise<void> {
    if (!this.client || !this.config) {
      throw new Error('API not initialized');
    }

    await this.client.delete(
      `/universes/${this.config.universeId}/standard-datastores/datastore/entries/entry`,
      {
        params: {
          datastoreName,
          scope,
          entryKey,
        },
      }
    );
  }

  async listScopes(datastoreName: string, limit: number = 100): Promise<string[]> {
    if (!this.client || !this.config) {
      throw new Error('API not initialized');
    }

    try {
      // The API doesn't have a direct endpoint for listing scopes
      // We need to use the list-datastore-entries-v2 endpoint which shows scope/key pairs
      const response = await this.client.get(
        `/universes/${this.config.universeId}/standard-datastores/datastore/entries`,
        {
          params: {
            datastoreName,
            allScopes: true,
            limit,
          },
        }
      );

      // Extract unique scopes from the keys
      const scopes = new Set<string>();
      if (response.data.keys) {
        response.data.keys.forEach((entry: { scope?: string }) => {
          if (entry.scope) {
            scopes.add(entry.scope);
          }
        });
      }

      // Always include 'global' as an option
      scopes.add('global');

      return Array.from(scopes).sort();
    } catch (error: any) {
      console.error('Error listing scopes:', error.response?.data || error.message);
      // If the API call fails, return at least the global scope
      return ['global'];
    }
  }
}

export const robloxAPI = new RobloxDataStoreAPI();
