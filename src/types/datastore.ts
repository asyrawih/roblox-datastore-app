export interface ApiConfig {
  apiKey: string;
  universeId: string;
}

export interface DataStore {
  name: string;
  createdTime?: string;
}

export interface DataStoreEntry {
  key: string;
  value: unknown;
  version: string;
  userIds?: number[];
  attributes?: Record<string, unknown>;
}

export interface ListDataStoresResponse {
  datastores: DataStore[];
  nextPageCursor?: string;
}

export interface ListEntriesResponse {
  keys: Array<{
    key: string;
  }>;
  nextPageCursor?: string;
}

export interface GetEntryResponse {
  value: unknown;
  version: string;
  userIds?: number[];
  attributes?: Record<string, unknown>;
}
