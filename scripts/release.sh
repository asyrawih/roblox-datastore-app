#!/bin/bash
set -e

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "Error: Version number required"
    echo "Usage: ./scripts/release.sh <version>"
    echo "Example: ./scripts/release.sh 1.0.0"
    exit 1
fi

VERSION=${VERSION#v}

echo "Creating release v$VERSION"
echo ""

if ! git diff-index --quiet HEAD --; then
    echo "Error: You have uncommitted changes"
    echo "Please commit or stash your changes first"
    exit 1
fi

echo "Updating version in package.json..."
npm version $VERSION --no-git-tag-version

echo "Committing version change..."
git add package.json package-lock.json
git commit -m "chore: bump version to v$VERSION"

echo "Creating tag v$VERSION..."
git tag -a "v$VERSION" -m "Release v$VERSION"

echo ""
echo "Release prepared!"
echo ""
echo "To publish, run:"
echo "  git push origin main"
echo "  git push origin v$VERSION"
echo ""
echo "This will trigger GitHub Actions to build and release."
