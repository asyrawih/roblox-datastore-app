# Building Roblox DataStore Editor

This guide covers how to build the application for different platforms.

## Prerequisites

- Node.js 16+ and npm
- For macOS builds: macOS 10.13+ (required for code signing)
- For Windows builds: Can build on any platform
- For cross-platform builds: Recommended to use the target platform

## Quick Start

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm run dev
```

## Building for Distribution

### Windows Builds

#### Build for Windows x64 and x86 (32-bit)
```bash
npm run build:win
```

This creates:
- `release/1.0.0/Roblox DataStore Editor-1.0.0-x64.exe` - NSIS installer (64-bit)
- `release/1.0.0/Roblox DataStore Editor-1.0.0-ia32.exe` - NSIS installer (32-bit)
- `release/1.0.0/Roblox DataStore Editor-1.0.0-x64.exe` - Portable (64-bit)
- `release/1.0.0/Roblox DataStore Editor-1.0.0-ia32.exe` - Portable (32-bit)

#### Build for Windows ARM64
```bash
npm run build:win-arm
```

This creates:
- `release/1.0.0/Roblox DataStore Editor-1.0.0-arm64.exe` - NSIS installer (ARM64)
- `release/1.0.0/Roblox DataStore Editor-1.0.0-arm64.exe` - Portable (ARM64)

#### Windows Build Outputs
- **NSIS Installer**: Traditional Windows installer with installation wizard
- **Portable**: Single executable that doesn't require installation

### macOS Builds

#### Build for macOS (Intel and Apple Silicon)
```bash
npm run build:mac
```

This creates:
- `release/1.0.0/Roblox DataStore Editor-1.0.0-x64.dmg` - Intel Mac installer
- `release/1.0.0/Roblox DataStore Editor-1.0.0-arm64.dmg` - Apple Silicon installer
- `release/1.0.0/Roblox DataStore Editor-1.0.0-x64-mac.zip` - Intel Mac archive
- `release/1.0.0/Roblox DataStore Editor-1.0.0-arm64-mac.zip` - Apple Silicon archive

**Note**: Building for macOS on non-Mac systems is limited and may not work properly.

### Build All Platforms
```bash
npm run build:all
```

Builds for all platforms and architectures:
- Windows: x64, ia32 (x86), ARM64
- macOS: x64 (Intel), ARM64 (Apple Silicon)

## Platform-Specific Notes

### Windows

**Supported Architectures:**
- `x64` - 64-bit Windows (most common)
- `ia32` - 32-bit Windows (older systems)
- `arm64` - ARM-based Windows devices (Surface Pro X, etc.)

**File Types:**
- **NSIS Installer** (`.exe`): Recommended for most users. Includes uninstaller.
- **Portable** (`.exe`): Single file that runs without installation. Good for USB drives.

**Requirements:**
- Windows 7 or later (x64/ia32)
- Windows 10 or later (ARM64)

### macOS

**Supported Architectures:**
- `x64` - Intel-based Macs
- `arm64` - Apple Silicon (M1, M2, M3 chips)

**File Types:**
- **DMG** (`.dmg`): Disk image installer. Drag to Applications folder.
- **ZIP** (`.zip`): Compressed archive. Extract and run.

**Code Signing:**
- For distribution outside the Mac App Store, you'll need an Apple Developer account
- Set environment variables for code signing:
  ```bash
  export CSC_LINK=/path/to/certificate.p12
  export CSC_KEY_PASSWORD=your_password
  export APPLE_ID=your@apple.id
  export APPLE_ID_PASSWORD=app-specific-password
  ```

**Notarization:**
- Required for macOS 10.15+ (Catalina and later)
- Happens automatically if credentials are set
- Users will get "unidentified developer" warning without notarization

### Linux (Optional)

Build for Linux (from Linux or macOS):
```bash
npm run build -- --linux
```

Creates AppImage and .deb packages.

## Build Configuration

The build configuration is in `package.json` under the `build` key.

### Customization

#### Change App Name
Edit `package.json`:
```json
{
  "productName": "Your App Name",
  "build": {
    "appId": "com.yourcompany.yourapp"
  }
}
```

#### Add Icons
Place icons in the `build/` directory:
- Windows: `build/icon.ico`
- macOS: `build/icon.icns`
- Linux: `build/icons/512x512.png` (and other sizes)

See `build/README.md` for icon requirements.

#### Modify Installer
Edit NSIS settings in `package.json`:
```json
{
  "build": {
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
```

#### Modify DMG
Edit DMG settings in `package.json`:
```json
{
  "build": {
    "dmg": {
      "background": "build/background.png",
      "window": {
        "width": 540,
        "height": 380
      }
    }
  }
}
```

## Troubleshooting

### Build Fails on macOS
- Install Xcode Command Line Tools: `xcode-select --install`
- Make sure you have the latest Node.js version

### Build Fails on Windows
- Install Windows Build Tools: `npm install --global windows-build-tools`
- Run as Administrator if permission errors occur

### "File not found" errors
- Make sure you've run `npm install`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Large File Size
- The app includes Monaco Editor and Electron, which are large
- Expected size: 100-200MB installed
- Consider using compression in the installer

### Code Signing Warnings
**Windows:**
- Purchase a code signing certificate from a Certificate Authority
- Set environment variables:
  ```bash
  export CSC_LINK=/path/to/certificate.pfx
  export CSC_KEY_PASSWORD=password
  ```

**macOS:**
- Requires Apple Developer account ($99/year)
- Export certificate from Keychain Access
- Set environment variables (see Code Signing section above)

## Distribution

### Windows
- Distribute the `.exe` installer files
- Users can choose between NSIS installer and portable versions
- Recommend x64 for most users
- Provide ARM64 for Surface Pro X and similar devices

### macOS
- Distribute `.dmg` files
- Provide both Intel (x64) and Apple Silicon (arm64) versions
- Universal builds are possible but larger in size

### Auto-Updates (Optional)
To enable auto-updates:
1. Set up a release server (GitHub Releases, S3, etc.)
2. Configure in `package.json`:
```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "your-username",
      "repo": "your-repo"
    }
  }
}
```
3. Implement update checking in `electron/main.ts`

## Build Outputs

All builds are created in the `release/` directory:
```
release/
└── 1.0.0/
    ├── Roblox DataStore Editor-1.0.0-x64.exe
    ├── Roblox DataStore Editor-1.0.0-ia32.exe
    ├── Roblox DataStore Editor-1.0.0-arm64.exe
    ├── Roblox DataStore Editor-1.0.0-x64.dmg
    ├── Roblox DataStore Editor-1.0.0-arm64.dmg
    └── ...
```

## CI/CD

### GitHub Actions Example
```yaml
name: Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, windows-latest]

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm install
      - run: npm run build:all

      - uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: release/**/*
```

## Release Checklist

- [ ] Update version in `package.json`
- [ ] Update `README.md` with changes
- [ ] Build for all platforms
- [ ] Test installers on each platform
- [ ] Create GitHub release with binaries
- [ ] Update documentation
- [ ] Announce release

## Additional Resources

- [electron-builder Documentation](https://www.electron.build/)
- [Code Signing Guide](https://www.electron.build/code-signing)
- [macOS Notarization](https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/)
