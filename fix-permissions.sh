#!/bin/bash
# Fix Permissions Script for Forensic Legal Analyzer
# Run this script to fix permissions on the .app bundle

set -e  # Exit on error

echo "Fixing permissions for ForensicLegalAnalyzer.app..."

# Navigate to where the app is located
cd "$(dirname "$0")"

# Check if .app bundle exists
if [ ! -d "ForensicLegalAnalyzer.app" ]; then
    echo "❌ ForensicLegalAnalyzer.app not found in current directory."
    echo "Please ensure this script is in the same directory as ForensicLegalAnalyzer.app"
    exit 1
fi

# Check if proper structure exists
if [ ! -d "ForensicLegalAnalyzer.app/Contents/MacOS" ]; then
    echo "❌ Invalid .app bundle structure. Contents/MacOS directory not found."
    exit 1
fi

# Fix the executable
if [ -f "ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer" ]; then
    chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer
    echo "✓ Executable permissions set"
else
    echo "❌ Executable not found at expected location"
    exit 1
fi

# Fix app bundle permissions
chmod -R 755 ForensicLegalAnalyzer.app
echo "✓ Bundle permissions set"

# Set proper permissions for Info.plist
if [ -f "ForensicLegalAnalyzer.app/Contents/Info.plist" ]; then
    chmod 644 ForensicLegalAnalyzer.app/Contents/Info.plist
    echo "✓ Info.plist permissions set"
fi

# Set proper permissions for Resources
if [ -d "ForensicLegalAnalyzer.app/Contents/Resources" ]; then
    chmod -R 644 ForensicLegalAnalyzer.app/Contents/Resources/*
    chmod 755 ForensicLegalAnalyzer.app/Contents/Resources
    echo "✓ Resources permissions set"
fi

# Remove quarantine attribute (macOS security feature that blocks downloaded apps)
if command -v xattr &> /dev/null; then
    xattr -cr ForensicLegalAnalyzer.app 2>/dev/null || true
    echo "✓ Quarantine attribute removed"
fi

# Final verification
if [ -x "ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer" ]; then
    echo ""
    echo "✅ Permissions fixed successfully!"
    echo ""
    echo "You can now double-click ForensicLegalAnalyzer.app to run it."
    echo ""
    echo "If macOS still blocks the app, try:"
    echo "  1. Right-click the app and select 'Open'"
    echo "  2. Or run: xattr -cr ForensicLegalAnalyzer.app"
else
    echo ""
    echo "❌ There was an issue fixing permissions."
    echo "Please run this command manually:"
    echo "chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer"
    exit 1
fi
