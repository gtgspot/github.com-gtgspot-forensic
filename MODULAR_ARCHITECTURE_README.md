# Forensic Legal Analyzer - Modular Architecture

## Overview

The Forensic Legal Analyzer has been refactored into a **modular, maintainable architecture** with separated concerns and reusable components. This document describes the new structure and how to use it.

## Version

**Version 2.0.0** - Modular Architecture Release
**Date:** 2025-11-11
**Jurisdiction:** Victoria, Australia

---

## Directory Structure

```
/src
├── /data
│   └── victorianStatutes.json          # Comprehensive statute database
├── /analyzers
│   ├── VictorianStatuteAnalyzer.js     # Core statute logic
│   ├── PresetAnalyzers.js              # All 8 presets as exports
│   ├── CrossReferenceEngine.js         # Phase B logic
│   └── InterpretationEngine.js         # Phase C logic
├── /storage
│   ├── AnalysisDatabase.js             # IndexedDB wrapper
│   ├── PatternDetector.js              # Learning engine
│   └── TimelineManager.js              # Chronological tracking
├── /components
│   ├── FileUploader.jsx                # Upload component (to be created)
│   ├── AnalysisResults.jsx             # Results display (to be created)
│   ├── DefectTimeline.jsx              # Timeline view (to be created)
│   ├── CrossReferenceMatrix.jsx        # Matrix table (to be created)
│   └── PatternInsights.jsx             # Learning insights (to be created)
├── /utils
│   ├── textExtractor.js                # File parsing
│   ├── statuteParser.js                # Extract legal references
│   ├── defectClassifier.js             # Categorize issues
│   └── exportManager.js                # Export functions
└── main.jsx                             # App orchestrator
```

---

## Core Modules

### 1. Data Layer (`/data`)

#### `victorianStatutes.json`

Comprehensive database of Victorian legislation containing:
- **Road Safety Act 1986** (s.49, s.55D, s.55E)
- **Criminal Procedure Act 2009** (s.185, s.187)
- **Evidence Act 2008** (s.59, s.69, s.137, s.138)
- **Magistrates' Court Act 1989**
- **Victoria Police Act 2013**
- **Charter of Human Rights and Responsibilities Act 2006**

Each statute includes:
- Full section text
- Elements and prerequisites
- Required keywords
- Absence consequences
- Test frameworks (e.g., George v Rockett reasonable belief test)

**Usage:**
```javascript
// Loaded automatically by VictorianStatuteAnalyzer
const response = await fetch('/src/data/victorianStatutes.json');
const statutes = await response.json();
```

---

### 2. Analyzers (`/analyzers`)

#### `VictorianStatuteAnalyzer.js`

Core statute compliance checker.

**Key Methods:**
- `init()` - Initialize and load statute database
- `checkCompliance(text, actName, sectionNum)` - Check compliance with specific section
- `extractReferences(text)` - Extract all statutory references
- `identifyGoverningActs(references)` - Identify applicable Acts
- `analyzeReasonableBeliefTest(text)` - George v Rockett two-limb test

**Example:**
```javascript
import { VictorianStatuteAnalyzer } from './analyzers/VictorianStatuteAnalyzer.js';

const analyzer = new VictorianStatuteAnalyzer();
await analyzer.init();

// Check compliance
const result = analyzer.checkCompliance(
  documentText,
  'Road_Safety_Act_1986',
  '49'
);

console.log(result.compliant); // true/false
console.log(result.missing);   // Array of missing elements
```

#### `PresetAnalyzers.js`

Contains all 8 preset analysis methods:

1. **Preset 1:** Statutory Procedural Analysis
2. **Preset 2:** Contextual Analysis
3. **Preset 3:** Jurisprudential Analysis
4. **Preset 4:** Objective Textual Analysis
5. **Preset 5:** Subjective Intent Analysis
6. **Preset 6:** Purposive Analysis
7. **Preset 7:** Comparative Cross-Reference
8. **Preset 8:** Evidentiary Standards (Victorian)

**Example:**
```javascript
import { runAnalysis, getAllPresets } from './analyzers/PresetAnalyzers.js';

// Get all presets
const presets = getAllPresets();

// Run analysis with selected presets
const results = await runAnalysis(
  documentText,
  [1, 2, 8], // Preset IDs
  allDocuments
);
```

#### `CrossReferenceEngine.js`

Phase B: Cross-document comparison engine.

**Key Methods:**
- `addDocument(document)` - Add document for comparison
- `analyze()` - Perform cross-reference analysis
- `compareDates()` - Find date discrepancies
- `compareTimes()` - Find time discrepancies
- `compareEventSequences()` - Find sequence discrepancies

**Example:**
```javascript
import { CrossReferenceEngine } from './analyzers/CrossReferenceEngine.js';

const engine = new CrossReferenceEngine();

engine.addDocument({ name: 'Police Statement', text: policeText });
engine.addDocument({ name: 'Defence Statement', text: defenceText });

const results = engine.analyze();
console.log(results.dateDiscrepancies);
console.log(results.timeDiscrepancies);
```

#### `InterpretationEngine.js`

Phase C: Legal interpretation and compliance assessment.

**Key Methods:**
- `init()` - Initialize engine
- `analyze(text, options)` - Comprehensive interpretation analysis
- `assessCompliance(text, acts)` - Assess statutory compliance
- `generateRecommendations(results)` - Generate actionable recommendations

**Example:**
```javascript
import { InterpretationEngine } from './analyzers/InterpretationEngine.js';

const engine = new InterpretationEngine();
await engine.init();

const results = await engine.analyze(documentText);
console.log(results.complianceAssessment);
console.log(results.recommendations);
```

---

### 3. Storage Layer (`/storage`)

#### `AnalysisDatabase.js`

IndexedDB wrapper for persistent storage.

**Object Stores:**
- `analyses` - Analysis results
- `documents` - Uploaded documents
- `patterns` - Detected patterns

**Example:**
```javascript
import { AnalysisDatabase } from './storage/AnalysisDatabase.js';

const db = new AnalysisDatabase();
await db.init();

// Save analysis
await db.saveAnalysis(analysisResults);

// Get all analyses
const history = await db.getAllAnalyses();
```

#### `PatternDetector.js`

Machine learning-like pattern detection.

**Key Methods:**
- `detectPatterns(findings)` - Detect recurring patterns
- `learn(analysisResults)` - Learn from analysis
- `getLearnedPatterns()` - Get learned patterns

**Example:**
```javascript
import { PatternDetector } from './storage/PatternDetector.js';

const detector = new PatternDetector();

// Detect patterns
const patterns = detector.detectPatterns(findings);

// Learn from analysis
detector.learn(analysisResults);

// Get learned patterns
const learned = detector.getLearnedPatterns();
```

#### `TimelineManager.js`

Chronological event tracking and timeline reconstruction.

**Example:**
```javascript
import { TimelineManager } from './storage/TimelineManager.js';

const manager = new TimelineManager();

// Extract timeline
const timeline = manager.extractTimeline(documentText, 'Police Statement');

// Build chronological timeline
const chronological = manager.buildChronologicalTimeline();

// Detect discrepancies
const discrepancies = manager.detectDiscrepancies();
```

---

### 4. Utilities (`/utils`)

#### `textExtractor.js`

Multi-format text extraction.

**Supported Formats:**
- Plain text (.txt)
- PDF (.pdf)
- DOCX (.docx)
- Images (.png, .jpg) via OCR

**Example:**
```javascript
import { TextExtractor } from './utils/textExtractor.js';

const extractor = new TextExtractor();
const text = await extractor.extractText(file);
```

#### `statuteParser.js`

Statutory reference parser.

**Example:**
```javascript
import { StatuteParser } from './utils/statuteParser.js';

const parser = new StatuteParser();
const parsed = parser.parse(documentText);

console.log(parsed.sections); // ['s.49(1)(g)', 's.55D', ...]
console.log(parsed.acts);     // ['Road Safety Act 1986', ...]
```

#### `defectClassifier.js`

Legal defect classification and categorization.

**Defect Types:**
- JURISDICTIONAL
- PROCEDURAL
- EVIDENTIARY
- STATUTORY
- DISCLOSURE
- TEMPORAL
- LINGUISTIC

**Example:**
```javascript
import { DefectClassifier } from './utils/defectClassifier.js';

const classifier = new DefectClassifier();
const classification = classifier.classifyAll(findings);

console.log(classification.bySeverity.CRITICAL);
console.log(classification.byType.STATUTORY);
```

#### `exportManager.js`

Multi-format export functionality.

**Formats:**
- PDF
- DOCX
- JSON
- CSV

**Example:**
```javascript
import { ExportManager } from './utils/exportManager.js';

const exporter = new ExportManager();
await exporter.export(results, 'pdf', 'analysis-report.pdf');
```

---

## Main Application (`main.jsx`)

The main orchestrator that coordinates all modules.

### Usage Example

```javascript
import app from './src/main.jsx';

// Process a file
const result = await app.processFile(uploadedFile);

// Run analysis
const analysis = await app.analyzeDocument(documentText, {
  presets: [1, 2, 8]
});

// Export results
await app.exportAnalysis('pdf', 'report.pdf');

// Get status
const status = app.getStatus();
```

### Available Methods

- `initialize()` - Initialize application
- `processFile(file)` - Process uploaded file
- `analyzeDocument(text, options)` - Run comprehensive analysis
- `exportAnalysis(format, fileName)` - Export results
- `getPresets()` - Get available presets
- `getHistory()` - Get analysis history
- `getLearnedPatterns()` - Get learned patterns
- `clearData()` - Clear all data
- `getStatus()` - Get application status

---

## Integration Guide

### 1. In HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>Forensic Legal Analyzer</title>
    <!-- Load dependencies -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
</head>
<body>
    <div id="app"></div>

    <!-- Load as ES6 module -->
    <script type="module">
        import app from './src/main.jsx';

        // Application is ready
        console.log('App Status:', app.getStatus());
    </script>
</body>
</html>
```

### 2. With React

```jsx
import React, { useEffect, useState } from 'react';
import app from './src/main.jsx';

function AnalyzerApp() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    app.initialize();
  }, []);

  const handleFileUpload = async (file) => {
    await app.processFile(file);
    const analysis = await app.analyzeDocument(file.text);
    setResults(analysis);
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleFileUpload(e.target.files[0])} />
      {results && <pre>{JSON.stringify(results, null, 2)}</pre>}
    </div>
  );
}
```

---

## Benefits of Modular Architecture

### 1. **Maintainability**
- Each module has a single responsibility
- Easy to locate and fix bugs
- Clear separation of concerns

### 2. **Scalability**
- Add new analyzers without modifying existing code
- Extend statute database independently
- New export formats easily added

### 3. **Testability**
- Each module can be unit tested independently
- Mock dependencies easily
- Integration tests simplified

### 4. **Reusability**
- Import only what you need
- Use modules in other projects
- Share utilities across applications

### 5. **Performance**
- Lazy loading possible
- Tree-shaking for unused code
- Parallel module loading

---

## Development Workflow

### Adding a New Analyzer

1. Create new file in `/src/analyzers/`
2. Import necessary dependencies
3. Export analyzer class/functions
4. Update `PresetAnalyzers.js` if adding preset
5. Update this README

### Adding a New Statute

1. Edit `/src/data/victorianStatutes.json`
2. Follow existing structure
3. Include all required fields
4. Test with `VictorianStatuteAnalyzer`

### Adding a New Export Format

1. Add method to `/src/utils/exportManager.js`
2. Add format to `supportedFormats` array
3. Implement export logic
4. Test with sample data

---

## Testing

### Unit Testing Example

```javascript
import { VictorianStatuteAnalyzer } from './src/analyzers/VictorianStatuteAnalyzer.js';

describe('VictorianStatuteAnalyzer', () => {
  let analyzer;

  beforeAll(async () => {
    analyzer = new VictorianStatuteAnalyzer();
    await analyzer.init();
  });

  test('extracts statutory references', () => {
    const text = 'According to s.49(1)(g) of the Road Safety Act 1986...';
    const refs = analyzer.extractReferences(text);
    expect(refs).toContain('s.49(1)(g)');
  });

  test('identifies governing acts', () => {
    const refs = ['s.49', 's.55D'];
    const acts = analyzer.identifyGoverningActs(refs);
    expect(acts.length).toBeGreaterThan(0);
    expect(acts[0].actName).toBe('Road_Safety_Act_1986');
  });
});
```

---

## Migration from Monolithic Version

### Before (Monolithic)
```html
<!-- Everything in one 11,834 line HTML file -->
<script>
  // 10,000+ lines of mixed code
</script>
```

### After (Modular)
```javascript
// Clean imports
import app from './src/main.jsx';
import { runAnalysis } from './src/analyzers/PresetAnalyzers.js';

// Use only what you need
const results = await runAnalysis(text, [1, 2, 3]);
```

---

## Future Enhancements

- [ ] React components in `/components` directory
- [ ] Additional Victorian statutes
- [ ] Advanced machine learning for pattern detection
- [ ] Real-time collaborative analysis
- [ ] API endpoints for remote analysis
- [ ] Mobile app using same modules

---

## Support

For questions or issues:
- Check this README
- Review module documentation in source files
- Check the main repository README

---

## License

Copyright © 2025 Forensic Legal Analysis Team
Licensed for use in Victorian legal practice.

---

## Changelog

### Version 2.0.0 (2025-11-11)
- ✅ Complete modular refactoring
- ✅ Comprehensive Victorian statutes database
- ✅ 8 preset analyzers modularized
- ✅ Cross-reference engine (Phase B)
- ✅ Interpretation engine (Phase C)
- ✅ Storage layer with IndexedDB
- ✅ Pattern detection and learning
- ✅ Timeline management
- ✅ Multi-format text extraction
- ✅ Defect classification system
- ✅ Multi-format export (PDF, DOCX, JSON, CSV)
- ✅ Centralized application orchestrator

### Version 1.0.0 (2025-11-11)
- Initial monolithic version
