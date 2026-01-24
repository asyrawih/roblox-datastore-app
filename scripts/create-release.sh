#!/bin/bash

# Script to create a new release
# Usage: ./scripts/create-release.sh 1.0.0

set -e

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "❌ Error: Version number required"
    echo "Usage: ./scripts/create-release.sh <version>"
    echo "Example: ./scripts/create-release.sh 1.0.0"
    exit 1
fi

# Remove 'v' prefix if present
VERSION=${VERSION#v}

echo "🚀 Creating release v$VERSION"
echo ""

# Check if git is clean
if ! git diff-index --quiet HEAD --; then
    echo "❌ Error: You have uncommitted changes"
    echo "Please commit or stash your changes before creating a release"
    exit 1
fi

# Update version in package.json
echo "📝 Updating version in package.json..."
npm version $VERSION --no-git-tag-version

# Commit version change
echo "📦 Committing version change..."
git add package.json package-lock.json
git commit -m "chore: bump version to v$VERSION"

# Create and push tag
echo "🏷️  Creating tag v$VERSION..."
git tag -a "v$VERSION" -m "Release v$VERSION"

echo ""
echo "✅ Release prepared!"
echo ""
echo "To publish the release, run:"
echo "  git push origin main"
echo "  git push origin v$VERSION"
echo ""
echo "This will trigger GitHub Actions to:"
echo "  • Build for Windows (x64, x86, ARM64)"
echo "  • Build for macOS (Intel, Apple Silicon)"
echo "  • Create a GitHub Release with downloadable files"
echo ""
echo "View releases at:"
echo "  https://github.com/YOUR_USERNAME/YOUR_REPO/releases"
