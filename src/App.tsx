import { useState, useEffect } from 'react';
import { AuthConfig } from './components/Auth/AuthConfig';
import { DataStoreList } from './components/DataStoreList/DataStoreList';
import { EntryEditor } from './components/EntryEditor/EntryEditor';
import { robloxAPI } from './services/roblox-api';
import { storage } from './utils/storage';
import { ApiConfig } from './types/datastore';

function App() {
  const [config, setConfig] = useState<ApiConfig | null>(null);
  const [selectedDataStore, setSelectedDataStore] = useState<string | null>(null);

  useEffect(() => {
    const savedConfig = storage.getConfig();
    console.log('Loading saved config:', savedConfig);
    if (savedConfig) {
      setConfig(savedConfig);
      robloxAPI.initialize(savedConfig);
    }
  }, []);

  const handleSaveConfig = (newConfig: ApiConfig) => {
    console.log('Saving config:', newConfig);
    setConfig(newConfig);
    storage.saveConfig(newConfig);
    robloxAPI.initialize(newConfig);
    console.log('Config saved to localStorage');
  };

  const handleClearConfig = () => {
    setConfig(null);
    setSelectedDataStore(null);
    storage.clearConfig();
  };

  return (
    <div className="flex h-screen w-full flex-col bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-50">
      <AuthConfig
        config={config}
        onSave={handleSaveConfig}
        onClear={handleClearConfig}
      />

      {config ? (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 flex-shrink-0">
            <DataStoreList onSelectDataStore={setSelectedDataStore} />
          </div>
          <div className="flex-1">
            {selectedDataStore ? (
              <EntryEditor datastoreName={selectedDataStore} />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500 dark:text-zinc-500">
                Select a DataStore to view entries
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-gray-500 dark:text-zinc-500">
          Configure your API credentials to get started
        </div>
      )}
    </div>
  );
}

export default App;
