# Roblox DataStore Editor

A desktop application for managing Roblox DataStores using the Open Cloud API. Built with Electron, React, TypeScript, and Tailwind CSS.

## Features

- Connect to Roblox DataStores using Open Cloud API keys
- Browse all DataStores in your universe
- View, create, edit, and delete entries
- JSON viewer with syntax highlighting
- Search functionality for DataStores and entries

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Roblox account with a game/universe

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Development

Run the app in development mode:
```bash
npm run dev
```

### Build

Build the app for production:
```bash
npm run build
```

## Configuration

### 1. Get Your Open Cloud API Key

1. Go to [Roblox Creator Hub](https://create.roblox.com/credentials)
2. Click "Create API Key"
3. Configure the API key:
   - **Name**: Give it a descriptive name (e.g., "DataStore Editor")
   - **Access Permissions**: Select "Universe" level
   - **Select your game/universe**
   - **API System**: Enable "DataStore"
   - **Operations**: Select the permissions you need:
     - `universe-datastores.objects:list` (required to list datastores)
     - `universe-datastores.objects:read` (required to read entries)
     - `universe-datastores.objects:create` (required to create/update entries)
     - `universe-datastores.objects:delete` (optional, for deleting entries)
4. Copy the generated API key (save it securely - you won't be able to see it again)

### 2. Find Your Universe ID

1. Go to your game's page on Roblox
2. Look at the URL: `https://www.roblox.com/games/PLACE_ID/Game-Name`
3. The Universe ID can be found by:
   - Going to Creator Dashboard → Game → Settings → Basic Info
   - Or use the API: `https://apis.roblox.com/universes/v1/places/PLACE_ID/universe`

### 3. Configure the App

1. Open the app
2. Click "Settings"
3. Enter your API Key and Universe ID
4. Click "Test Connection" to verify your credentials
5. Click "Save Configuration"

## Troubleshooting

### Network Error / Connection Failed

If you get a network error, check the following:

1. **API Key Permissions**: Ensure your API key has the correct permissions enabled:
   - `universe-datastores.objects:list` - Required for listing datastores
   - `universe-datastores.objects:read` - Required for reading entries
   - Make sure the API key is for the correct Universe/Game

2. **Universe ID**: Verify you're using the correct Universe ID (not Place ID)

3. **API Key Validity**: The API key must be:
   - Not expired
   - Not revoked
   - Properly copied (no extra spaces)

4. **Restart the App**: After updating Electron configuration, restart the app completely

5. **Check Developer Console**: Open DevTools (View → Toggle Developer Tools) and check the Console tab for detailed error messages

### Common Error Messages

- **"401 Unauthorized"**: Your API key is invalid or expired
- **"403 Forbidden"**: Your API key doesn't have the required permissions
- **"404 Not Found"**: The Universe ID is incorrect
- **"Network Error"**: Connection issue - check your internet or firewall

### Testing Your Credentials

Use the "Test Connection" button in the Settings panel to verify your API key and Universe ID are working correctly. This will show you the exact error message if something is wrong.

## Tech Stack

- **Electron** - Desktop app framework
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **@uiw/react-json-view** - JSON viewer

## Project Structure

```
src/
├── components/
│   ├── Auth/AuthConfig.tsx         # API configuration UI
│   ├── DataStoreList/              # DataStore browser
│   └── EntryEditor/                # Key-value editor
├── services/
│   └── roblox-api.ts              # Roblox Open Cloud API client
├── types/
│   └── datastore.ts               # TypeScript types
└── utils/
    └── storage.ts                 # Local storage helper
```

## Security Notes

- API keys are stored in browser's localStorage
- The app disables web security to allow CORS requests to Roblox APIs
- Keep your API key secure and don't share it
- Consider using API keys with minimal required permissions
