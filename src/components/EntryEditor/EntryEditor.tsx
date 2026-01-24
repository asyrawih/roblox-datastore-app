import { useState, useEffect } from 'react';
import { Key, Plus, Trash2, Loader2, AlertCircle, Save, RefreshCw } from 'lucide-react';
import { robloxAPI } from '../../services/roblox-api';
import { DataStoreEntry } from '../../types/datastore';
import Editor from '@monaco-editor/react';
import { useTheme } from '../../contexts/ThemeContext';

interface EntryEditorProps {
  datastoreName: string;
}

export function EntryEditor({ datastoreName }: EntryEditorProps) {
  const { theme } = useTheme();
  const [entries, setEntries] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [entryData, setEntryData] = useState<DataStoreEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState('global');
  const [scopes, setScopes] = useState<string[]>(['global']);
  const [loadingScopes, setLoadingScopes] = useState(false);
  const [searchPrefix, setSearchPrefix] = useState('');
  const [newKey, setNewKey] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');

  const loadScopes = async () => {
    setLoadingScopes(true);
    try {
      const scopeList = await robloxAPI.listScopes(datastoreName);
      setScopes(scopeList);
      // If current scope is not in the list, reset to global
      if (!scopeList.includes(scope)) {
        setScope('global');
      }
    } catch (err) {
      console.error('Failed to load scopes:', err);
      setScopes(['global']);
    } finally {
      setLoadingScopes(false);
    }
  };

  const loadEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await robloxAPI.listEntries(
        datastoreName,
        scope,
        searchPrefix || undefined
      );
      setEntries(response.keys?.map((k) => k.key) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  const loadEntry = async (key: string) => {
    setLoading(true);
    setError(null);
    setEditMode(false);
    try {
      const response = await robloxAPI.getEntry(datastoreName, key, scope);
      setEntryData({
        key,
        value: response.value,
        version: response.version,
        userIds: response.userIds,
        attributes: response.attributes,
      });
      setEditValue(JSON.stringify(response.value, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entry');
      setEntryData(null);
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!selectedKey && !newKey) return;

    setSaving(true);
    setError(null);
    try {
      const parsedValue = JSON.parse(editValue);
      const keyToSave = newKey || selectedKey!;

      await robloxAPI.setEntry(
        datastoreName,
        keyToSave,
        parsedValue,
        scope,
        entryData?.userIds,
        entryData?.attributes
      );

      setEditMode(false);
      setNewKey('');

      if (newKey) {
        await loadEntries();
        setSelectedKey(newKey);
        await loadEntry(newKey);
      } else {
        await loadEntry(selectedKey!);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  const deleteEntry = async (key: string) => {
    if (!confirm(`Are you sure you want to delete "${key}"?`)) return;

    setLoading(true);
    setError(null);
    try {
      await robloxAPI.deleteEntry(datastoreName, key, scope);
      setSelectedKey(null);
      setEntryData(null);
      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete entry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScopes();
    loadEntries();
  }, [datastoreName]);

  useEffect(() => {
    loadEntries();
  }, [scope]);

  return (
    <div className="flex h-full">
      {/* Entry List */}
      <div className="w-80 flex-shrink-0 border-r border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
        <div className="border-b border-gray-200 dark:border-zinc-800 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-zinc-200">
            <Key className="h-4 w-4" />
            Entries
          </h3>
          <div className="space-y-2">
            <div>
              <label className="mb-1 block text-xs text-gray-600 dark:text-zinc-400">Scope</label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                disabled={loadingScopes}
                className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-1.5 text-sm text-gray-900 dark:text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
              >
                {scopes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={loadScopes}
                disabled={loadingScopes}
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-xs text-gray-900 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-50"
              >
                {loadingScopes ? 'Loading...' : 'Refresh Scopes'}
              </button>
            </div>
            <input
              type="text"
              value={searchPrefix}
              onChange={(e) => setSearchPrefix(e.target.value)}
              placeholder="Search by prefix..."
              className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-1.5 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={loadEntries}
              disabled={loading}
              className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              <RefreshCw className="inline h-4 w-4 mr-1" />
              Refresh Entries
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            </div>
          )}

          {!loading && entries.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-zinc-500">
              No entries found
            </div>
          )}

          {!loading && entries.length > 0 && (
            <div className="divide-y divide-gray-200 dark:divide-zinc-800">
              {entries.map((key) => (
                <div
                  key={key}
                  className={`flex items-center justify-between px-4 py-2.5 ${
                    selectedKey === key ? 'bg-gray-100 dark:bg-zinc-800' : ''
                  }`}
                >
                  <button
                    onClick={() => {
                      setSelectedKey(key);
                      loadEntry(key);
                      setNewKey('');
                    }}
                    className="flex-1 text-left text-sm text-gray-900 dark:text-zinc-200 hover:text-gray-700 dark:hover:text-zinc-100"
                  >
                    {key}
                  </button>
                  <button
                    onClick={() => deleteEntry(key)}
                    className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-zinc-800 p-4">
          <button
            onClick={() => {
              setSelectedKey(null);
              setEntryData(null);
              setEditMode(true);
              setEditValue('{}');
              setNewKey('');
            }}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-500"
          >
            <Plus className="h-4 w-4" />
            New Entry
          </button>
        </div>
      </div>

      {/* Entry Details */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-950 p-6">
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-md border border-red-800 bg-red-950/50 p-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!selectedKey && !editMode && (
          <div className="flex h-full items-center justify-center text-gray-500 dark:text-zinc-500">
            Select an entry or create a new one
          </div>
        )}

        {editMode && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-200">
              {newKey ? 'Edit Entry' : 'New Entry'}
            </h3>

            {!selectedKey && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300">
                  Entry Key
                </label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Enter key name..."
                  className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Value (JSON)
              </label>
              <div className="h-96 rounded-md border border-gray-300 dark:border-zinc-700 overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  value={editValue}
                  onChange={(value) => setEditValue(value || '')}
                  theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    wordWrap: 'on',
                    formatOnPaste: true,
                    formatOnType: true,
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveEntry}
                disabled={saving || (!newKey && !selectedKey)}
                className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setNewKey('');
                }}
                className="rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm text-gray-900 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!editMode && entryData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-200">{entryData.key}</h3>
              <button
                onClick={() => setEditMode(true)}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Edit
              </button>
            </div>

            <div className="space-y-2 rounded-md border border-gray-300 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 p-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-zinc-400">Scope:</span>
                <span className="text-gray-900 dark:text-zinc-200">{scope}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-zinc-400">Key:</span>
                <span className="text-gray-900 dark:text-zinc-200">{entryData.key}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-zinc-400">Version:</span>
                <span className="text-gray-900 dark:text-zinc-200">{entryData.version}</span>
              </div>
              {entryData.userIds && entryData.userIds.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-zinc-400">User IDs:</span>
                  <span className="text-gray-900 dark:text-zinc-200">{entryData.userIds.join(', ')}</span>
                </div>
              )}
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-zinc-300">Value:</h4>
              <div className="h-96 rounded-md border border-gray-300 dark:border-zinc-800 overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  value={JSON.stringify(entryData.value, null, 2)}
                  theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    wordWrap: 'on',
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
