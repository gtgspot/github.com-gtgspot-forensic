# Forensic Legal Analyzer - Distribution Package

## Package Contents

This distribution includes:

1. **ForensicLegalAnalyzer.app** - Complete macOS application bundle
2. **ForensicLegalAnalyzer-macOS.tar.gz** - Compressed archive of the application

## Application Structure

```
ForensicLegalAnalyzer.app/
├── Contents/
│   ├── Info.plist                    # Application metadata
│   ├── MacOS/
│   │   └── ForensicLegalAnalyzer     # Executable launcher (bash script)
│   └── Resources/
│       ├── index.html                # Main application (React-based)
│       ├── AppIcon.icns              # Application icon
│       ├── README.md                 # Complete documentation
│       ├── USER_GUIDE.md             # Detailed user guide with examples
│       └── INSTALL.txt               # Quick installation guide
```

## What This Package Does

When double-clicked, `ForensicLegalAnalyzer.app`:

1. ✅ Verifies Python 3 is installed on the system
2. ✅ Starts a local web server on port 8765
3. ✅ Opens the application in your default web browser
4. ✅ Runs completely locally (no external connections needed after initial load)
5. ✅ Processes documents entirely on your machine

## Installation Options

### Option 1: Use the .app directly (Recommended)

1. Extract the .app from the archive (if compressed)
2. Move `ForensicLegalAnalyzer.app` to your Applications folder
3. Double-click to run

### Option 2: Use the compressed archive

1. Download `ForensicLegalAnalyzer-macOS.tar.gz`
2. Double-click to extract (or use `tar -xzf ForensicLegalAnalyzer-macOS.tar.gz`)
3. Move the extracted .app to Applications
4. Double-click to run

## First Launch Security

macOS Gatekeeper may show a security warning on first launch:

**Expected behavior:**
- "Cannot be opened because it is from an unidentified developer"

**How to bypass (safe):**
1. Right-click (or Control+click) the app
2. Select "Open" from the context menu
3. Click "Open" in the security dialog
4. App will now launch normally

**Why this happens:**
- The app is not signed with an Apple Developer certificate
- This is normal for locally-distributed applications
- The app is safe - it runs only locally on your machine

## System Requirements

| Requirement | Specification |
|-------------|---------------|
| **Operating System** | macOS 10.13 (High Sierra) or later |
| **Processor** | Intel or Apple Silicon (M1/M2/M3) |
| **Memory** | 4GB RAM minimum, 8GB recommended |
| **Storage** | 100MB free space |
| **Python** | Python 3.x (pre-installed on modern macOS) |
| **Browser** | Safari, Chrome, Firefox, or Edge (any modern browser) |
| **Internet** | Required for first launch only (to load React & icons) |

## Features

### Document Upload Methods
- 📁 Local file selection
- 🖱️ Drag and drop
- 🔗 URL import (for web-accessible documents)

### Supported Document Formats
- Plain text (.txt)
- Microsoft Word (.doc, .docx)
- PDF (.pdf) - text-based only

### Analysis Capabilities

**Phase A: Multi-Preset Forensic Examination**
- 8 different interpretive frameworks
- Word-by-word and line-by-line analysis
- Key term extraction
- Legal reference identification
- Procedural element detection
- Issue identification with severity levels

**Phase B: Cross-Reference Analysis**
- Statutory framework identification
- Discrepancy detection between documents
- Omission flagging
- Consistency verification
- Compliance assessment

**Phase C: Statutory Interpretation**
- Literal/textual interpretation
- Contextual analysis
- Purposive interpretation
- Harmonious construction principles
- Application of interpretive maxims
- Ambiguity resolution strategies
- Extrinsic aid recommendations

### Output Features
- Expandable/collapsible result sections
- Severity-coded issue highlighting
- Executive summary with key findings
- Strategic recommendations
- Proposed next steps
- JSON export for record-keeping

## Use Cases

This tool is designed for:

✓ **Legal Professionals**
- Analyzing disclosure documents
- Comparing witness statements
- Verifying statutory compliance
- Identifying procedural defects

✓ **Self-Represented Litigants**
- Understanding legal documents
- Identifying compliance gaps
- Preparing submissions
- Reviewing evidence

✓ **Law Students & Researchers**
- Learning statutory interpretation
- Analyzing legal documents
- Understanding procedural requirements
- Practical application of legal principles

## Privacy & Security

### Data Protection
- ✅ All processing occurs locally on your machine
- ✅ No data transmitted to external servers
- ✅ No persistent storage of uploaded documents
- ✅ Documents processed in browser memory only
- ✅ No tracking or analytics
- ✅ No account creation required

### Network Usage
- Local web server runs on `localhost:8765` only
- Server is not accessible from other devices
- Internet required only for initial dependency loading (React, icons)
- After first launch, can operate fully offline

## Technical Architecture

### Technology Stack
- **Backend**: Python 3 HTTP server
- **Frontend**: React 18 (via CDN)
- **Icons**: Lucide React
- **Processing**: Client-side JavaScript
- **Packaging**: Native macOS .app bundle

### How It Works

1. **Launcher Script** (`ForensicLegalAnalyzer` in MacOS folder)
   - Bash script that verifies Python installation
   - Starts HTTP server on port 8765
   - Opens browser to application URL
   - Manages server lifecycle

2. **Web Application** (`index.html` in Resources folder)
   - Self-contained React application
   - All dependencies loaded from CDN
   - Processes files using FileReader API
   - Performs analysis entirely in browser
   - No backend API calls needed

3. **Application Bundle** (`.app` structure)
   - Follows macOS bundle conventions
   - Info.plist contains metadata
   - Resources folder contains all assets
   - MacOS folder contains executable

## Customization

The application can be customized by editing:

1. **Info.plist** - Application metadata, file associations
2. **index.html** - UI, analysis logic, presets
3. **ForensicLegalAnalyzer script** - Port, startup behavior

## Troubleshooting

### Issue: Python not found
**Solution**: Install Python 3 from python.org

### Issue: Port 8765 already in use
**Solution**: Close other instances, wait 30 seconds, try again

### Issue: Browser doesn't open
**Solution**: Manually navigate to `http://localhost:8765`

### Issue: Can't upload files
**Solution**: Check file format is supported (.txt, .doc, .docx, .pdf)

### Issue: Analysis doesn't start
**Solution**: Ensure both documents are uploaded before clicking analyze

## Support

For technical issues or questions:
1. Review the README.md in the app bundle
2. Consult the USER_GUIDE.md for detailed examples
3. Check the INSTALL.txt for setup help

## Legal Disclaimer

This application is provided as an analytical tool. It:
- Does NOT constitute legal advice
- Should NOT be relied upon as the sole basis for legal decisions
- Requires independent verification of all findings
- Is supplementary to professional legal counsel
- Does not replace the need for qualified legal representation

Users should:
- Verify all findings independently
- Consult relevant legislation and case law
- Seek professional legal advice
- Use outputs as starting point for research only

## Version Information

**Current Version**: 1.0.0  
**Release Date**: November 2025  
**Build**: Initial Release  
**Compatibility**: macOS 10.13+  

## License

This application is provided for professional legal analysis purposes.  
All rights reserved.

## Distribution

This package may be:
- ✅ Used for personal legal analysis
- ✅ Shared with colleagues or legal team
- ✅ Installed on multiple machines you own
- ❌ Not to be modified without understanding the implications
- ❌ Not to be redistributed commercially without authorization

---

## Quick Start Summary

1. **Extract**: Unzip/extract the .app bundle
2. **Move**: Place in Applications folder
3. **Open**: Right-click → Open (first time only)
4. **Upload**: Add two documents to analyze
5. **Analyze**: Click "Commence Forensic Analysis"
6. **Review**: Expand sections to view findings
7. **Export**: Download report as needed

**Application URL**: `http://localhost:8765`

---

**Ready to use!** The application is completely self-contained and ready to run on any Mac meeting the system requirements.
