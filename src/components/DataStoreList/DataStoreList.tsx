import { useState, useEffect } from 'react';
import { Database, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { robloxAPI } from '../../services/roblox-api';
import { DataStore } from '../../types/datastore';

interface DataStoreListProps {
  onSelectDataStore: (datastore: string) => void;
}

export function DataStoreList({ onSelectDataStore }: DataStoreListProps) {
  const [datastores, setDatastores] = useState<DataStore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPrefix, setSearchPrefix] = useState('');

  const loadDataStores = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await robloxAPI.listDataStores(searchPrefix || undefined);
      setDatastores(response.datastores || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load datastores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (robloxAPI.isInitialized()) {
      loadDataStores();
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadDataStores();
  };

  return (
    <div className="flex h-full flex-col border-r border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
      <div className="border-b border-gray-200 dark:border-zinc-800 p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-zinc-200">
          <Database className="h-4 w-4" />
          DataStores
        </h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchPrefix}
            onChange={(e) => setSearchPrefix(e.target.value)}
            placeholder="Search by prefix..."
            className="flex-1 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-1.5 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          </div>
        )}

        {error && (
          <div className="m-4 flex items-start gap-2 rounded-md border border-red-800 bg-red-950/50 p-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && datastores.length === 0 && (
          <div className="p-4 text-center text-sm text-gray-500 dark:text-zinc-500">
            No datastores found
          </div>
        )}

        {!loading && !error && datastores.length > 0 && (
          <div className="divide-y divide-gray-200 dark:divide-zinc-800">
            {datastores.map((ds) => (
              <button
                key={ds.name}
                onClick={() => onSelectDataStore(ds.name)}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <span className="text-sm text-gray-900 dark:text-zinc-200">{ds.name}</span>
                <ChevronRight className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
