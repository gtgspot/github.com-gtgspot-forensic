# Forensic Legal Analyzer - macOS Application

## Overview
Forensic Legal Analyzer is a sophisticated document analysis system designed for legal professionals conducting evidentiary analysis. The application performs multi-layered interpretive analysis of legal documents using advanced statutory interpretation principles.

## Features

### Three-Phase Analysis System

**Phase A: Multi-Preset Forensic Examination**
- Statutory Procedural Analysis
- Contextual Analysis
- Jurisprudential Analysis
- Objective Textual Analysis
- Subjective Intent Analysis
- Purposive Analysis
- Comparative Cross-Reference Analysis
- Evidentiary Standards Analysis

**Phase B: Statutory Framework & Cross-Reference**
- Identifies governing legislation
- Detects discrepancies between documents
- Flags omissions and inconsistencies
- Assesses statutory compliance

**Phase C: Statutory Interpretation**
- Applies literal, contextual, and purposive approaches
- Uses established interpretive principles
- Provides guidance on extrinsic aids
- Generates ambiguity resolution strategies

## System Requirements

- macOS 10.13 (High Sierra) or later
- Python 3.x (pre-installed on most modern macOS systems)
- Modern web browser (Safari, Chrome, Firefox, or Edge)
- Minimum 4GB RAM
- 100MB free disk space

## Installation

1. **Download the Application**
   - Download `ForensicLegalAnalyzer.app`
   - Move it to your Applications folder

2. **First Launch**
   - Double-click `ForensicLegalAnalyzer.app`
   - If you see a security warning, right-click the app and select "Open"
   - Click "Open" in the security dialog
   - The application will launch in your default web browser

3. **Grant Permissions**
   - If prompted, allow the application to accept incoming network connections
   - This is required for the local web server functionality

## Usage

### Uploading Documents

The application supports three methods for uploading documents:

1. **Drag and Drop**
   - Drag a file from Finder and drop it into the upload zone
   - Supported formats: .txt, .doc, .docx, .pdf

2. **File Browser**
   - Click "Choose File" button
   - Navigate to your document and select it

3. **URL Upload**
   - Paste a URL to a publicly accessible document
   - Press Enter to load the document

### Running Analysis

1. Upload both Document A and Document B
2. Click "Commence Forensic Analysis"
3. The system will process documents through all three phases
4. Review results in the expandable sections

### Exporting Reports

- Click "Export Report" to download analysis as JSON
- Reports include all findings, recommendations, and interpretive analysis
- Timestamp included for record-keeping

## Understanding the Analysis

### Key Terminology

**Statutory Interpretation Principles:**
- **Literalism**: Plain, ordinary meaning of words
- **Purposive Approach**: Legislative purpose and intent
- **Contextual Analysis**: Words within their statutory context
- **Harmonious Construction**: Reading provisions together

**Latin Maxims Applied:**
- *Noscitur a sociis*: Words known by their associates
- *Expressio unius est exclusio alterius*: Express mention excludes others
- *Generalia specialibus non derogant*: Specific prevails over general

### Severity Levels

- **High**: Critical issues requiring immediate attention
- **Medium**: Significant concerns warranting review
- **Low**: Minor issues or areas for improvement

## Troubleshooting

### Application Won't Launch

**Problem**: Security warning prevents opening
**Solution**: 
1. Right-click the app
2. Select "Open"
3. Click "Open" in the dialog

**Problem**: Python not found
**Solution**: 
1. Install Python 3 from python.org
2. Restart the application

### Browser Doesn't Open

**Problem**: Application runs but browser doesn't open
**Solution**: 
1. Manually open browser
2. Navigate to: `http://localhost:8765`

### Port Already in Use

**Problem**: Error message about port 8765
**Solution**: 
1. Close other instances of the application
2. Wait 30 seconds and try again
3. Restart your computer if problem persists

## Privacy & Security

### Data Handling
- All processing occurs locally on your machine
- No data is transmitted to external servers
- Documents are processed in memory only
- No persistent storage of uploaded documents

### Network Access
- The application runs a local web server on port 8765
- This server is only accessible from your computer
- No external network access required or used

## Technical Details

### Architecture
- Native macOS application bundle (.app)
- Python-based local web server
- React-based frontend interface
- Client-side document processing

### File Structure
```
ForensicLegalAnalyzer.app/
├── Contents/
│   ├── Info.plist          # Application metadata
│   ├── MacOS/
│   │   └── ForensicLegalAnalyzer  # Launcher script
│   └── Resources/
│       ├── index.html      # Main application
│       └── AppIcon.icns    # Application icon
```

## Legal Disclaimer

This application is provided as an analytical tool for legal professionals. It does not constitute legal advice. Users should:

- Verify all findings independently
- Consult relevant legislation and case law
- Seek professional legal counsel for specific matters
- Use outputs as supplementary analysis only

The application's analysis should not be relied upon as the sole basis for legal decisions or submissions.

## Support & Feedback

For issues, questions, or feedback:
- Report technical issues via your support channel
- Review analysis methodologies in the application
- Consult the interpretive principles documentation

## Version History

**Version 1.0.0** (Current)
- Initial release
- 8 interpretive presets
- 3-phase analysis system
- Export functionality
- Multi-format document support

## License

This application is provided for professional legal analysis purposes. All rights reserved.

---

**Note**: This application requires an active internet connection during first launch to load external dependencies (React, icons). After initial setup, the application can function offline for document analysis.

## Quick Start Guide

1. **Launch**: Double-click ForensicLegalAnalyzer.app
2. **Upload**: Add two documents (A and B)
3. **Analyze**: Click "Commence Forensic Analysis"
4. **Review**: Expand sections to view detailed findings
5. **Export**: Download report for records

The application will open in your default browser at `http://localhost:8765`.

To quit: Close the browser tab and press Ctrl+C in the terminal window, or quit via the Dock icon.
