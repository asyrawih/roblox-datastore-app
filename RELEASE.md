# Release Guide

This guide explains how to create and publish releases for the Kelas Malam DataStore Editor.

## Automated Releases with GitHub Actions

The project uses GitHub Actions to automatically build and publish releases when you create a version tag.

## What Gets Built

When you create a release, GitHub Actions will build:

### Windows
- **x64** (64-bit Intel/AMD)
  - NSIS Installer (`.exe`)
  - Portable version (`.exe`)
- **ia32** (32-bit x86)
  - NSIS Installer (`.exe`)
  - Portable version (`.exe`)
- **ARM64** (ARM-based Windows)
  - NSIS Installer (`.exe`)
  - Portable version (`.exe`)

### macOS
- **x64** (Intel Macs)
  - DMG installer (`.dmg`)
  - ZIP archive (`.zip`)
- **arm64** (Apple Silicon: M1, M2, M3)
  - DMG installer (`.dmg`)
  - ZIP archive (`.zip`)

## Creating a Release

### Method 1: Using the Release Script (Recommended)

```bash
# Create a new release version
./scripts/create-release.sh 1.0.0

# Push to GitHub to trigger the build
git push origin main
git push origin v1.0.0
```

The script will:
1. Update `package.json` with the new version
2. Commit the version change
3. Create a git tag
4. Show you the commands to push

### Method 2: Manual Steps

1. **Update version in package.json:**
   ```bash
   npm version 1.0.0 --no-git-tag-version
   ```

2. **Commit the version change:**
   ```bash
   git add package.json package-lock.json
   git commit -m "chore: bump version to v1.0.0"
   ```

3. **Create and push the tag:**
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin main
   git push origin v1.0.0
   ```

## What Happens Next

1. **GitHub Actions Triggers:**
   - When you push a tag starting with `v`, the release workflow starts

2. **Building (15-30 minutes):**
   - Windows builds run on `windows-latest`
   - macOS builds run on `macos-latest`
   - All architectures are built in parallel

3. **Release Created:**
   - A new GitHub Release is automatically created
   - All build artifacts are uploaded
   - Release notes are auto-generated from commits

4. **Downloads Available:**
   - Users can download the appropriate installer for their platform
   - All files are listed on the Releases page

## Release Workflow Details

The workflow is defined in `.github/workflows/release.yml`:

```yaml
Trigger: push tags matching 'v*'
Jobs:
  1. build-windows (Windows x64, x86, ARM64)
  2. build-macos (macOS Intel & Apple Silicon)
  3. release (Create GitHub Release with all files)
```

## Monitoring the Build

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Find the "Build and Release" workflow
4. Watch the build progress in real-time

## Troubleshooting

### Build Fails

Check the Actions log for errors:
- Go to Actions tab → Click the failed workflow → Click the job → Expand failed step

Common issues:
- **TypeScript errors**: Run `npm run build` locally first
- **Missing dependencies**: Make sure `package-lock.json` is committed
- **Icon files missing**: Ensure `build/icon.ico` and `build/icon.icns` exist

### No Release Created

Make sure:
- Tag starts with `v` (e.g., `v1.0.0`, not `1.0.0`)
- You pushed the tag: `git push origin v1.0.0`
- GitHub Actions is enabled for your repository

### Missing Files in Release

The workflow uploads:
- `*.exe` - Windows installers
- `*.dmg` - macOS disk images
- `*.zip` - macOS archives

Check the build artifacts in the workflow run.

## Version Numbering

Follow semantic versioning (semver):
- **Major**: `1.0.0` → `2.0.0` (breaking changes)
- **Minor**: `1.0.0` → `1.1.0` (new features)
- **Patch**: `1.0.0` → `1.0.1` (bug fixes)

## Pre-release Versions

For beta or alpha releases:

```bash
./scripts/create-release.sh 1.0.0-beta.1
git push origin main
git push origin v1.0.0-beta.1
```

Mark as pre-release in GitHub:
1. Go to Releases
2. Edit the release
3. Check "This is a pre-release"

## Release Checklist

Before creating a release:

- [ ] All features tested
- [ ] No TypeScript errors (`npm run build`)
- [ ] Icons generated (`npm run icons`)
- [ ] README.md updated
- [ ] CHANGELOG.md updated (optional)
- [ ] Version number decided
- [ ] All changes committed

## Download Links

After release, share these links:

### Latest Release
```
https://github.com/YOUR_USERNAME/YOUR_REPO/releases/latest
```

### Specific Version
```
https://github.com/YOUR_USERNAME/YOUR_REPO/releases/tag/v1.0.0
```

### Direct Download Links
```
Windows x64: https://github.com/YOUR_USERNAME/YOUR_REPO/releases/download/v1.0.0/Kelas-Malam-DataStore-Editor-1.0.0-x64.exe
macOS Intel: https://github.com/YOUR_USERNAME/YOUR_REPO/releases/download/v1.0.0/Kelas-Malam-DataStore-Editor-1.0.0-x64.dmg
macOS ARM64: https://github.com/YOUR_USERNAME/YOUR_REPO/releases/download/v1.0.0/Kelas-Malam-DataStore-Editor-1.0.0-arm64.dmg
```

## Example Release Process

```bash
# 1. Make your changes
git add .
git commit -m "Add new features"

# 2. Create release
./scripts/create-release.sh 1.1.0

# 3. Push to GitHub
git push origin main
git push origin v1.1.0

# 4. Wait for GitHub Actions to build (check Actions tab)

# 5. Release is published automatically!
# Visit: https://github.com/YOUR_USERNAME/YOUR_REPO/releases
```

## Canceling a Release

If you need to cancel:

1. **Delete the tag locally:**
   ```bash
   git tag -d v1.0.0
   ```

2. **Delete the tag on GitHub:**
   ```bash
   git push origin :refs/tags/v1.0.0
   ```

3. **Delete the release on GitHub:**
   - Go to Releases → Click the release → Delete

## Notes

- Builds take 15-30 minutes total
- All builds run in parallel
- GitHub provides unlimited CI/CD minutes for public repositories
- Windows code signing requires a certificate (see BUILD.md)
- macOS notarization requires Apple Developer account (see BUILD.md)

## Support

For issues with releases:
1. Check the Actions tab for build logs
2. Open an issue with the build error
3. Check BUILD.md for manual build instructions
