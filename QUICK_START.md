# Quick Start Guide

## For Users

### Download and Install

1. **Go to Releases**: [Download Latest Release](https://github.com/YOUR_USERNAME/YOUR_REPO/releases/latest)

2. **Choose your platform**:
   - **Windows**: Download `.exe` file for your architecture
     - x64: Most modern Windows PCs
     - ARM64: Surface Pro X and ARM devices
   - **macOS**: Download `.dmg` file for your Mac
     - x64: Intel Macs
     - arm64: Apple Silicon (M1, M2, M3)

3. **Install**:
   - **Windows**: Run the `.exe` installer
   - **macOS**: Open `.dmg`, drag app to Applications

### First Time Setup

1. Open Kelas Malam DataStore Editor
2. Click "Settings" button
3. Enter your credentials:
   - **API Key**: Get from [Roblox Creator Hub](https://create.roblox.com/credentials)
   - **Universe ID**: Find in your game settings
4. Click "Test Connection" to verify
5. Click "Save Configuration"

### Using the App

1. **Browse DataStores**: Select from left sidebar
2. **Choose Scope**: Select scope from dropdown
3. **View Entries**: Click on any entry to view/edit
4. **Edit Values**: Click "Edit", modify JSON, click "Save"
5. **Create New**: Click "New Entry" button

## For Developers

### Development

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Install dependencies
npm install

# Run in development mode
npm run dev
```

### Building

```bash
# Build for your platform
npm run build:win   # Windows
npm run build:mac   # macOS

# Build for all platforms
npm run build:all
```

### Creating a Release

```bash
# Create version tag
./scripts/create-release.sh 1.0.0

# Push to trigger automated build
git push origin main
git push origin v1.0.0

# GitHub Actions will:
# - Build for all platforms
# - Create GitHub Release
# - Upload installers
```

## Troubleshooting

### Connection Errors

- **401 Unauthorized**: API key is invalid
- **403 Forbidden**: Missing permissions on API key
- **404 Not Found**: Wrong Universe ID

**Fix**: Check API key has these permissions:
- `universe-datastores.objects:list`
- `universe-datastores.objects:read`
- `universe-datastores.objects:create`

### Settings Not Saving

1. Check browser console (Help → Toggle Developer Tools)
2. Clear localStorage
3. Re-enter credentials

### Build Errors

```bash
# Clean and rebuild
rm -rf node_modules dist dist-electron
npm install
npm run build
```

## Documentation

- [Full README](README.md) - Complete documentation
- [Build Guide](BUILD.md) - Detailed build instructions
- [Release Guide](RELEASE.md) - How to create releases
- [Icon Guide](ICONS.md) - Icon customization

## Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/YOUR_REPO/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/YOUR_REPO/discussions)

## License

See [LICENSE](LICENSE) file for details.
