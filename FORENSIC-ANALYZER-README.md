# Forensic Legal Document Analysis - Victorian Criminal Procedure

## Overview

This web application provides comprehensive forensic analysis of legal documents using Victorian criminal procedure frameworks. It performs word-by-word analysis across 8 interpretive presets to identify statutory compliance issues, procedural irregularities, and evidentiary concerns.

## Features

### Core Functionality
- **Multi-format Support**: Upload .txt, .pdf, and .docx files
- **Multiple Upload Methods**:
  - Local file selection
  - Drag-and-drop interface
  - URL input for remote documents
- **Batch Processing**: Analyze multiple documents simultaneously
- **8 Analysis Presets**: Comprehensive interpretive frameworks

### Victorian Legal Frameworks (Hard-coded)

The application incorporates these Victorian statutes:

1. **Magistrates' Court Act 1989 (Vic)**
2. **Criminal Procedure Act 2009 (Vic)**
   - Part 3.3 (Disclosure)
   - Section 185 (Defence disclosure)
   - Section 187 (Prosecution disclosure)
3. **Evidence Act 2008 (Vic)**
   - Chapter 2 (Admissibility)
   - Chapter 3 (Hearsay rule)
   - Sections 137-138 (Discretions to exclude)
   - Section 69 (Business records exception)
4. **Road Safety Act 1986 (Vic)**
   - Section 49(1)(a)-(h) - Preliminary test requirements
   - Section 55D - Authority and conditions
   - Section 55E - Proper performance requirements
   - Section 55(1) - Evidentiary test requirements

## Analysis Presets

### Preset 1: Statutory Procedural Analysis
Identifies:
- Statutory references (section X, s.X, Part X, Chapter X)
- Mandatory procedural language (must, shall, required)
- Jurisdictional prerequisites
- Dates, times, and locations
- Missing procedural elements

**Severity Indicators**:
- HIGH: Missing jurisdictional references, mandatory language violations
- MEDIUM: Statutory references, dates/times
- LOW: Administrative details

### Preset 2: Contextual Analysis
Extracts:
- Temporal markers (before, after, during, at the time)
- Conditional statements (if, unless, provided that)
- Authority references (officer, constable, informant)
- Sequence markers (first, then, next, finally)

**Severity Indicators**:
- MEDIUM: Most contextual markers
- LOW: Sequence indicators

### Preset 3: Jurisprudential Analysis
Identifies:
- Common law references
- Legal principles (natural justice, burden of proof)
- Case citations (e.g., Smith v. Jones [2024])
- Latin maxims (actus reus, mens rea, prima facie)

**Severity Indicators**:
- HIGH: Legal principles
- MEDIUM: Common law references, case citations
- LOW: Latin maxims

### Preset 4: Objective Textual Analysis
Analyzes:
- Ambiguous terms (reasonable, appropriate, sufficient)
- Undefined technical terms
- Complex sentence structures (40+ words)
- Double negatives

**Severity Indicators**:
- HIGH: Undefined technical terms
- MEDIUM: Ambiguous terms, double negatives
- LOW: Complex sentences

### Preset 5: Subjective Intent Analysis
Examines:
- Stated intentions (believed, suspected, formed opinion)
- Subjective vs. objective statements
- Qualifiers (may have, appeared to, possibly)
- Balance between subjective and objective evidence

**Severity Indicators**:
- HIGH: Subjective beliefs requiring objective basis, imbalance
- MEDIUM: Qualifiers/hedging language

### Preset 6: Purposive Analysis
Identifies:
- Stated purposes and objectives
- Policy considerations
- Legislative intent references
- Mischief being addressed (prevent, protect, ensure)

**Severity Indicators**:
- HIGH: Legislative intent references
- MEDIUM: Purpose statements, mischief language

### Preset 7: Comparative Cross-Reference
Compares multiple documents for:
- Contradictions in facts
- Inconsistencies in dates and times
- Conflicting statements
- Omissions and discrepancies

**Note**: Requires uploading 2+ documents for meaningful analysis.

**Severity Indicators**:
- HIGH: Major contradictions
- MEDIUM: Timeline discrepancies
- LOW: Minor variations

### Preset 8: Evidentiary Standards (Victorian)
Victorian-specific compliance checking:
- Road Safety Act s.49 preliminary test triggers
- Road Safety Act s.55D authority requirements
- Road Safety Act s.55E proper performance
- Evidence Act s.137 prejudicial evidence discretion
- Evidence Act s.138 improperly obtained evidence
- Evidence Act Chapter 3 hearsay issues
- Evidence Act s.69 business records exception
- Criminal Procedure Act Part 3.3 disclosure obligations

**Severity Indicators**:
- HIGH: Statutory compliance issues, discretion triggers
- MEDIUM: Hearsay issues, business records

## How to Use

### 1. Open the Application
Simply open `forensic-legal-analyzer.html` in a modern web browser:
- Chrome (recommended)
- Firefox
- Safari
- Edge

**No installation or server required** - runs entirely in the browser.

### 2. Upload Documents

**Method A - File Selection**:
1. Click "Choose Files" button
2. Select one or more files (.txt, .pdf, .docx)
3. Files will be listed with their sizes

**Method B - Drag and Drop**:
1. Drag files from your file explorer
2. Drop them into the upload section
3. Files will be automatically processed

**Method C - URL Input**:
1. Enter the URL of a text-based document
2. Click "Load from URL"
3. Document will be fetched and processed

### 3. Select Analysis Presets
Click on the preset cards to select/deselect them:
- Green border = selected
- Gray border = not selected
- You can select multiple presets
- Select all 8 for comprehensive analysis

### 4. Analyze
Click the "Analyze Documents" button to start the analysis.

### 5. Review Results
Each result includes:
- **Word Count**: Total words in document
- **Line Count**: Total lines in document
- **Findings Count**: Number of issues identified
- **Key Terms Found**: List of significant legal terms
- **Statutory References**: All statutes cited
- **Detailed Findings**: Each finding shows:
  - Finding type
  - Severity (HIGH/MEDIUM/LOW)
  - Description
  - Location (line number, character position)
  - Context (50 characters before/after)

## Sample Documents

Two sample documents are provided for testing:

### 1. sample-police-statement.txt
Police witness statement regarding a drink-driving incident. Contains:
- Statutory references to Road Safety Act sections
- Procedural language
- Temporal markers
- Authority references
- Subjective beliefs and objective observations

### 2. sample-defendant-statement.txt
Defence statement challenging the same incident. Contains:
- Defence disclosure pursuant to s.185
- Contradictory timeline
- Challenges to procedural compliance
- Evidentiary objections under Evidence Act
- Different factual assertions

**To Test Comparative Analysis**:
1. Upload both sample documents
2. Select Preset 7 (Comparative Cross-Reference)
3. Analyze to see contradictions highlighted

## Technical Details

### Dependencies (via CDN)
- React 18.0
- React DOM 18.0
- Babel Standalone (for JSX transformation)
- PDF.js 3.11.174 (PDF text extraction)
- Mammoth.js 1.6.0 (DOCX text extraction)

### Browser Requirements
- Modern browser with ES6+ support
- JavaScript enabled
- No plugins required

### File Size Limits
- Limited by browser memory
- Recommended: Documents under 10MB
- Large PDFs may take longer to process

### Privacy
- All processing happens in your browser
- No data sent to external servers
- No data stored or tracked
- Completely private and secure

## Limitations

### File Format Support
- **.doc files NOT supported** - Convert to .docx first
- PDF text extraction may fail on:
  - Scanned images without OCR
  - Password-protected PDFs
  - Corrupted PDFs
- DOCX files with complex formatting may lose structure

### Analysis Accuracy
- Pattern matching based on keywords and regex
- May produce false positives
- May miss context-dependent issues
- Not a replacement for legal expertise

### Comparative Analysis
- Currently performs basic text comparison
- Does not understand legal context
- Best used as a starting point for manual review

## Use Cases

### For Defence Lawyers
- Analyze prosecution briefs for procedural irregularities
- Identify s.137/138 Evidence Act discretion opportunities
- Check disclosure compliance
- Compare witness statements for inconsistencies

### For Prosecutors
- Review police briefs for completeness
- Verify statutory compliance
- Identify potential defence challenges
- Ensure disclosure obligations met

### For Police Prosecutors
- Check statements before filing
- Verify all required elements present
- Identify missing procedural steps
- Ensure proper authority documented

### For Law Students
- Study statutory interpretation
- Learn procedural requirements
- Analyze real-world documents
- Understand evidentiary principles

### For Researchers
- Analyze large document sets
- Identify patterns in legal language
- Extract statutory references
- Study litigation trends

## Best Practices

1. **Run All 8 Presets**: Comprehensive analysis is best
2. **Upload Multiple Documents**: Comparative analysis needs 2+
3. **Review High Severity Findings First**: Prioritize critical issues
4. **Check Context**: Don't rely on snippets alone - review full document
5. **Manual Verification**: Always verify findings in source documents
6. **Keep Original Documents**: This tool doesn't modify originals

## Troubleshooting

### PDF Won't Load
- Ensure PDF is not password-protected
- Try converting to .txt or .docx
- Check if PDF contains actual text (not just images)

### DOCX Shows Errors
- Try opening in Word and re-saving
- Convert to .txt if issues persist
- Check file is not corrupted

### Analysis Takes Long Time
- Large documents require more processing
- Multiple presets increase processing time
- Be patient with PDFs (text extraction is slow)

### No Findings Shown
- Document may not contain relevant legal language
- Try different presets
- Check document uploaded correctly

## Future Enhancements (Session 2)

Potential additions for future versions:
- OCR support for scanned PDFs
- Export results to PDF/DOCX
- Save/load analysis sessions
- Custom preset creation
- More jurisdictions (NSW, QLD, etc.)
- AI-powered contextual analysis
- Timeline visualization
- Document comparison matrix

## Support

This is a standalone tool provided as-is. For legal advice, consult a qualified legal practitioner.

## License

Created for forensic legal document analysis in Victorian criminal matters.

---

**Version**: 1.0
**Last Updated**: November 2025
**Jurisdiction**: Victoria, Australia
**Framework**: Victorian Criminal Procedure
