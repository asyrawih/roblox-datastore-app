import { useState, useEffect } from 'react';
import { Settings, Key, Globe, CheckCircle, XCircle, Sun, Moon } from 'lucide-react';
import { ApiConfig } from '../../types/datastore';
import { robloxAPI } from '../../services/roblox-api';
import { useTheme } from '../../contexts/ThemeContext';

interface AuthConfigProps {
  config: ApiConfig | null;
  onSave: (config: ApiConfig) => void;
  onClear: () => void;
}

export function AuthConfig({ config, onSave, onClear }: AuthConfigProps) {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(!config);
  const [apiKey, setApiKey] = useState(config?.apiKey || '');
  const [universeId, setUniverseId] = useState(config?.universeId || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (config) {
      setApiKey(config.apiKey);
      setUniverseId(config.universeId);
    }
  }, [config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey && universeId) {
      onSave({ apiKey, universeId });
      setIsOpen(false);
      setTestResult(null);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey || !universeId) {
      setTestResult({ success: false, message: 'Please enter both API key and Universe ID' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      robloxAPI.initialize({ apiKey, universeId });
      await robloxAPI.listDataStores(undefined, undefined, 1);
      setTestResult({ success: true, message: 'Connection successful!' });
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.message || 'Connection failed. Check your credentials and permissions.'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="w-full border-b border-zinc-800 bg-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">Roblox DataStore Editor</h1>
            {config && (
              <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs text-green-400">
                Connected
              </span>
            )}
            {saveMessage && (
              <span className="text-sm text-green-400">
                {saveMessage}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-md border border-zinc-700 dark:border-zinc-700 border-gray-300 px-3 py-1.5 text-sm hover:bg-zinc-800 dark:hover:bg-zinc-800 hover:bg-gray-100"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 rounded-md border border-zinc-700 dark:border-zinc-700 border-gray-300 px-3 py-1.5 text-sm hover:bg-zinc-800 dark:hover:bg-zinc-800 hover:bg-gray-100"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>

        {isOpen && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
                <Key className="h-4 w-4" />
                Open Cloud API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Roblox Open Cloud API key"
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
              <p className="mt-1 text-xs text-zinc-500">
                Get your API key from{' '}
                <a
                  href="https://create.roblox.com/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  Roblox Creator Hub
                </a>
              </p>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
                <Globe className="h-4 w-4" />
                Universe ID
              </label>
              <input
                type="text"
                value={universeId}
                onChange={(e) => setUniverseId(e.target.value)}
                placeholder="Enter your game's Universe ID"
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
              <p className="mt-1 text-xs text-zinc-500">
                Find this in your game's settings on Roblox
              </p>
            </div>

            {testResult && (
              <div className={`flex items-start gap-2 rounded-md border p-3 text-sm ${
                testResult.success
                  ? 'border-green-800 bg-green-950/50 text-green-400'
                  : 'border-red-800 bg-red-950/50 text-red-400'
              }`}>
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing || !apiKey || !universeId}
                className="rounded-md border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900 disabled:opacity-50"
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Save Configuration
              </button>
              {config && (
                <button
                  type="button"
                  onClick={() => {
                    onClear();
                    setApiKey('');
                    setUniverseId('');
                    setTestResult(null);
                  }}
                  className="rounded-md border border-red-700 px-4 py-2 text-sm text-red-400 hover:bg-red-950"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
