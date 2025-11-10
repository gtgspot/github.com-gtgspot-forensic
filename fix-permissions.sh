#!/bin/bash
# Fix Permissions Script for Forensic Legal Analyzer
# Run this script to fix permissions on the .app bundle

echo "Fixing permissions for ForensicLegalAnalyzer.app..."

# Navigate to where the app is located
cd "$(dirname "$0")"

# Fix the executable
chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer

# Fix app bundle permissions
chmod -R 755 ForensicLegalAnalyzer.app

# Verify
if [ -x "ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer" ]; then
    echo "✅ Permissions fixed successfully!"
    echo "You can now double-click ForensicLegalAnalyzer.app to run it."
else
    echo "❌ There was an issue fixing permissions."
    echo "Please run this command manually:"
    echo "chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer"
fi
