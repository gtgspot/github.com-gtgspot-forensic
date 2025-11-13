# YScript Rules-as-Code Engine - Deployment Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Integration with Existing Analyzers](#integration-with-existing-analyzers)
6. [Extending Rules](#extending-rules)
7. [Production Deployment](#production-deployment)
8. [Testing](#testing)
9. [Performance Optimization](#performance-optimization)
10. [Security Considerations](#security-considerations)
11. [Monitoring and Maintenance](#monitoring-and-maintenance)
12. [Troubleshooting](#troubleshooting)

---

## Overview

The YScript Rules-as-Code Engine is a sophisticated backend preprocessing system that converts Victorian statutes into machine-executable rules and evaluates documents against these rules programmatically.

### Key Features

- ✅ Parses statutes into machine-executable rules
- ✅ Evaluates documents against rule conditions programmatically
- ✅ Supports logical operators: AND, OR, NOT, IF-THEN
- ✅ Extracts evidence with confidence scoring
- ✅ Returns structured compliance results with remedies
- ✅ Integrates seamlessly with existing PresetAnalyzers

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Forensic Legal Analyzer                    │
│                                                          │
│  ┌─────────────────┐         ┌──────────────────────┐  │
│  │ PresetAnalyzers │◄────────┤ YScript Integration  │  │
│  │  (8 Presets)    │         │     Module           │  │
│  └─────────────────┘         └──────────────────────┘  │
│          │                             │                │
│          └──────────────┬──────────────┘                │
│                         ▼                               │
│             ┌────────────────────────┐                  │
│             │   YScript Engine       │                  │
│             │  (Core Interpreter)    │                  │
│             └────────────────────────┘                  │
│                         │                               │
│                         ▼                               │
│             ┌────────────────────────┐                  │
│             │  Statutory Rules       │                  │
│             │  (Rules Library)       │                  │
│             └────────────────────────┘                  │
└─────────────────────────────────────────────────────────┘
```

---

## System Requirements

### Minimum Requirements

- **Browser**: Modern browser with ES6+ support (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Node.js**: v14.0.0+ (for server-side deployment and testing)
- **Python**: 3.7+ (for development server)
- **Memory**: 512MB RAM minimum
- **Storage**: 50MB for core files

### Recommended Requirements

- **Browser**: Latest version of Chrome, Firefox, or Edge
- **Node.js**: v18.0.0+ (LTS)
- **Memory**: 2GB RAM
- **Storage**: 500MB (includes logs, test files, extended rules)

---

## Installation

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/gtgspot/4rensic.git
cd 4rensic

# Ensure all dependencies are in place
# (No npm dependencies required - pure ES6 modules)
```

### Step 2: Verify File Structure

```
4rensic/
├── src/
│   ├── engines/
│   │   ├── YScriptEngine.js          # Core engine
│   │   ├── YScriptIntegration.js     # Integration layer
│   │   ├── StatutoryRules.js         # Base rules
│   │   ├── ExtendedStatutoryRules.js # Extended rules
│   │   ├── example-usage.html        # Browser demo
│   │   └── index.js                  # Module exports
│   ├── analyzers/
│   │   ├── PresetAnalyzers.js        # 8 preset analyzers
│   │   └── VictorianStatuteAnalyzer.js
│   └── main.jsx
├── tests/
│   ├── yscript-engine.test.js        # Unit tests
│   ├── yscript-integration.test.js   # Integration tests
│   └── test-runner.html              # Browser test runner
├── package.json
└── YSCRIPT_DEPLOYMENT_GUIDE.md       # This file
```

### Step 3: Start Development Server

```bash
# Start HTTP server
python3 -m http.server 8000

# Or use npm script
npm start
```

### Step 4: Verify Installation

Open browser and navigate to:

- **Test Runner**: http://localhost:8000/tests/test-runner.html
- **Example Usage**: http://localhost:8000/src/engines/example-usage.html
- **Main Application**: http://localhost:8000/index-modular.html

---

## Configuration

### Basic Configuration

```javascript
import { createAnalyzer } from './src/engines/YScriptIntegration.js';

// Create analyzer with default configuration
const analyzer = createAnalyzer({
  debug: false,           // Enable debug logging
  autoLoadRules: true     // Automatically load all statutory rules
});
```

### Advanced Configuration

```javascript
import { YScriptEngine } from './src/engines/YScriptEngine.js';
import { AllStatutoryRules } from './src/engines/StatutoryRules.js';
import { AllExtendedStatutoryRules } from './src/engines/ExtendedStatutoryRules.js';

// Create custom engine instance
const engine = new YScriptEngine();

// Enable debug mode
engine.setDebugMode(true);

// Load specific rule sets
engine.registerRules(AllStatutoryRules);
engine.registerRules(AllExtendedStatutoryRules);

// Verify rules loaded
console.log(`Loaded ${engine.rules.size} rules`);
```

---

## Integration with Existing Analyzers

### Method 1: Using PresetAnalyzers

The YScript engine is already integrated with PresetAnalyzers. Use the preset functions to analyze documents:

```javascript
import { PresetAnalyzers } from './src/engines/YScriptIntegration.js';

const document = `
  On 15 January 2024, I had reason to believe the driver had consumed
  alcohol and had driven a motor vehicle...
`;

// Use Drink Driving preset
const results = PresetAnalyzers.DrinkDriving.analyze(document);
console.log(results);
```

### Method 2: Using YScriptDocumentAnalyzer

For more control, use the YScriptDocumentAnalyzer directly:

```javascript
import { createAnalyzer } from './src/engines/YScriptIntegration.js';

const analyzer = createAnalyzer({ debug: false });

// Analyze Road Safety Act compliance
const results = analyzer.analyzeRoadSafetyCompliance(document);

// Find defects
const defects = analyzer.findDefects(document);

// Generate forensic report
const report = analyzer.generateForensicReport(document, {
  focusStatute: 'Road Safety Act',
  includeEvidence: true
});
```

### Method 3: Using Raw YScriptEngine

For maximum flexibility, use the raw engine:

```javascript
import { YScriptEngine } from './src/engines/YScriptEngine.js';
import { RoadSafetyActRules } from './src/engines/StatutoryRules.js';

const engine = new YScriptEngine();
engine.registerRules(RoadSafetyActRules);

// Evaluate single rule
const result = engine.evaluateRule('RSA_s49_1_reason_to_believe', document);

// Evaluate multiple rules
const ruleIds = ['RSA_s49_1_reason_to_believe', 'RSA_s49_1_articulation_of_belief'];
const results = engine.evaluateMultipleRules(ruleIds, document);

// Generate report
const report = engine.generateReport(results);
console.log(report);
```

---

## Extending Rules

### Step 1: Define Your Rule

```javascript
const newRule = {
  ruleId: "CUSTOM_rule_identifier",
  statute: "Your Act Name",
  section: "Section Number",
  type: "MANDATORY_PREREQUISITE", // or MANDATORY_PROCEDURAL, DISCRETIONARY_EXCLUSION, etc.
  description: "Brief description of what this rule checks",

  condition: {
    operator: "AND", // AND, OR, NOT, IF-THEN
    requirements: [
      {
        element: "element_name",
        keywords: [
          "keyword1",
          "keyword2",
          "keyword3"
        ],
        required: true,
        type: "ELEMENT_TYPE"
      }
    ]
  },

  evaluation: {
    onSuccess: {
      result: "COMPLIANT",
      message: "Success message"
    },
    onFailure: {
      result: "NON_COMPLIANT",
      severity: "CRITICAL", // CRITICAL, HIGH, MEDIUM, LOW
      consequence: "What happens if rule fails",
      remedy: "How to fix or challenge",
      legalPrinciple: "Legal principle underlying the rule"
    }
  }
};
```

### Step 2: Add to Rules Library

Create a new file or add to `ExtendedStatutoryRules.js`:

```javascript
export const MyCustomRules = [
  newRule,
  // ... more rules
];

// Export combined rules
export const AllMyRules = [
  ...AllStatutoryRules,
  ...MyCustomRules
];
```

### Step 3: Register Rules

```javascript
import { createAnalyzer } from './src/engines/YScriptIntegration.js';
import { MyCustomRules } from './src/engines/MyCustomRules.js';

const analyzer = createAnalyzer({ autoLoadRules: false });
analyzer.engine.registerRules(MyCustomRules);
```

### Rule Types

- **MANDATORY_PREREQUISITE**: Must be satisfied before proceeding
- **MANDATORY_PROCEDURAL**: Required procedural step
- **DISCRETIONARY_EXCLUSION**: Discretionary ground for excluding evidence
- **DISCRETIONARY_CONSIDERATION**: Optional factor to consider
- **INTERPRETIVE**: Guides interpretation of law

### Logical Operators

1. **AND**: All conditions must be satisfied
   ```javascript
   {
     operator: "AND",
     requirements: [condition1, condition2, condition3]
   }
   ```

2. **OR**: At least one condition must be satisfied
   ```javascript
   {
     operator: "OR",
     requirements: [condition1, condition2, condition3]
   }
   ```

3. **NOT**: Condition must NOT be satisfied
   ```javascript
   {
     operator: "NOT",
     requirements: [condition]
   }
   ```

4. **IF-THEN**: If antecedent true, consequent must be true
   ```javascript
   {
     operator: "IF-THEN",
     antecedent: condition1,
     consequent: condition2
   }
   ```

---

## Production Deployment

### Deployment Architecture Options

#### Option 1: Static Site Hosting (Recommended)

Deploy as static files to:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **AWS S3 + CloudFront**
- **Azure Static Web Apps**

```bash
# Build for production (if using bundler)
npm run build

# Deploy to static host
# Copy dist/ or src/ directory to hosting service
```

#### Option 2: Node.js Server

```javascript
// server.js
import express from 'express';
import { createAnalyzer } from './src/engines/YScriptIntegration.js';

const app = express();
app.use(express.json());
app.use(express.static('src'));

app.post('/api/analyze', async (req, res) => {
  const { document, presetId } = req.body;
  const analyzer = createAnalyzer({ debug: false });

  const results = analyzer.analyzeRoadSafetyCompliance(document);

  res.json(results);
});

app.listen(3000, () => {
  console.log('YScript API running on port 3000');
});
```

#### Option 3: Serverless Functions

```javascript
// netlify/functions/analyze.js
import { createAnalyzer } from '../../src/engines/YScriptIntegration.js';

export async function handler(event, context) {
  const { document } = JSON.parse(event.body);

  const analyzer = createAnalyzer({ debug: false });
  const results = analyzer.analyzeRoadSafetyCompliance(document);

  return {
    statusCode: 200,
    body: JSON.stringify(results)
  };
}
```

### Environment Configuration

```javascript
// config/production.js
export const productionConfig = {
  engine: {
    debug: false,
    autoLoadRules: true,
    cacheResults: true,
    maxCacheSize: 1000
  },
  api: {
    rateLimit: 100, // requests per minute
    timeout: 30000, // 30 seconds
    maxDocumentSize: 1048576 // 1MB
  },
  logging: {
    level: 'error',
    destination: 'cloudwatch' // or 'file', 'console'
  }
};
```

### Security Hardening

1. **Input Validation**
   ```javascript
   function validateDocument(document) {
     if (!document || typeof document !== 'string') {
       throw new Error('Invalid document');
     }
     if (document.length > 1048576) { // 1MB
       throw new Error('Document too large');
     }
     return document.trim();
   }
   ```

2. **Rate Limiting**
   ```javascript
   import rateLimit from 'express-rate-limit';

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });

   app.use('/api/', limiter);
   ```

3. **CORS Configuration**
   ```javascript
   import cors from 'cors';

   app.use(cors({
     origin: 'https://yourdomain.com',
     methods: ['GET', 'POST'],
     allowedHeaders: ['Content-Type']
   }));
   ```

---

## Testing

### Run All Tests

```bash
# Unit tests
node tests/yscript-engine.test.js

# Integration tests
node tests/yscript-integration.test.js

# Browser tests
# Open http://localhost:8000/tests/test-runner.html
```

### Test Coverage

Current test coverage:
- **Unit Tests**: 20 tests covering core engine functionality
- **Integration Tests**: 18 tests covering analyzer integration
- **Browser Tests**: 4 tests covering browser compatibility

### Continuous Integration

Add to `.github/workflows/test.yml`:

```yaml
name: YScript Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Run Unit Tests
        run: node tests/yscript-engine.test.js
      - name: Run Integration Tests
        run: node tests/yscript-integration.test.js
```

---

## Performance Optimization

### 1. Rule Caching

```javascript
class CachedYScriptEngine extends YScriptEngine {
  constructor() {
    super();
    this.cache = new Map();
  }

  evaluateRule(ruleId, documentText) {
    const cacheKey = `${ruleId}:${documentText.substring(0, 100)}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const result = super.evaluateRule(ruleId, documentText);
    this.cache.set(cacheKey, result);

    // Limit cache size
    if (this.cache.size > 1000) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    return result;
  }
}
```

### 2. Lazy Rule Loading

```javascript
async function loadRulesLazily(statute) {
  const module = await import(`./rules/${statute}.js`);
  return module.default;
}
```

### 3. Web Workers

```javascript
// worker.js
import { YScriptEngine } from './YScriptEngine.js';

self.onmessage = function(e) {
  const { ruleId, documentText } = e.data;

  const engine = new YScriptEngine();
  // Load rules...

  const result = engine.evaluateRule(ruleId, documentText);

  self.postMessage(result);
};
```

### 4. Benchmarking

```javascript
// Run performance benchmark
const startTime = performance.now();

for (let i = 0; i < 1000; i++) {
  engine.evaluateRule('RSA_s49_1_reason_to_believe', sampleDoc);
}

const endTime = performance.now();
console.log(`Average time: ${(endTime - startTime) / 1000}ms per evaluation`);
```

---

## Security Considerations

### 1. Content Security Policy

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline'">
```

### 2. Data Sanitization

```javascript
import DOMPurify from 'dompurify';

function sanitizeDocument(document) {
  return DOMPurify.sanitize(document, { ALLOWED_TAGS: [] });
}
```

### 3. Secure API Communication

```javascript
// Always use HTTPS in production
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.yourdomain.com'
  : 'http://localhost:3000';
```

### 4. Authentication

```javascript
async function analyzeWithAuth(document, token) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ document })
  });

  return await response.json();
}
```

---

## Monitoring and Maintenance

### 1. Error Tracking

```javascript
window.addEventListener('error', (event) => {
  // Log to monitoring service (e.g., Sentry)
  logError({
    message: event.message,
    stack: event.error?.stack,
    timestamp: new Date().toISOString()
  });
});
```

### 2. Performance Monitoring

```javascript
// Track evaluation performance
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`${entry.name}: ${entry.duration}ms`);
  }
});

observer.observe({ entryTypes: ['measure'] });

performance.mark('eval-start');
const result = engine.evaluateRule(ruleId, document);
performance.mark('eval-end');
performance.measure('evaluation', 'eval-start', 'eval-end');
```

### 3. Health Checks

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    rulesLoaded: engine.rules.size,
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

### 4. Logging

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log rule evaluations
logger.info('Rule evaluated', {
  ruleId,
  compliant: result.compliant,
  timestamp: result.timestamp
});
```

---

## Troubleshooting

### Common Issues

#### Issue 1: Rules not loading

**Symptom**: `engine.rules.size` is 0

**Solution**:
```javascript
// Check module imports
import { AllStatutoryRules } from './src/engines/StatutoryRules.js';
console.log('Rules array length:', AllStatutoryRules.length);

// Verify registration
const results = engine.registerRules(AllStatutoryRules);
console.log('Registration results:', results);
```

#### Issue 2: Module import errors in browser

**Symptom**: `Uncaught SyntaxError: Cannot use import statement outside a module`

**Solution**:
```html
<!-- Use type="module" in script tag -->
<script type="module" src="./src/main.js"></script>
```

#### Issue 3: CORS errors

**Symptom**: `Access to fetch blocked by CORS policy`

**Solution**:
```javascript
// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

#### Issue 4: Slow evaluation

**Symptom**: Evaluation takes >100ms per rule

**Solution**:
```javascript
// Enable caching
const engine = new CachedYScriptEngine();

// Reduce document size
const trimmedDoc = document.substring(0, 10000);

// Evaluate only necessary rules
const criticalRules = getCriticalRules();
```

### Debug Mode

Enable debug logging to troubleshoot:

```javascript
const analyzer = createAnalyzer({ debug: true });

// Check console for detailed logs:
// [YScript] ✓ Registered rule: RSA_s49_1_reason_to_believe
// [YScript] ━━━ Evaluating Rule: RSA_s49_1_reason_to_believe ━━━
// [YScript] Result: ✓ COMPLIANT
```

---

## Support and Documentation

- **GitHub Repository**: https://github.com/gtgspot/4rensic
- **Issue Tracker**: https://github.com/gtgspot/4rensic/issues
- **Example Usage**: `src/engines/example-usage.html`
- **API Documentation**: See inline JSDoc comments

---

## Changelog

### Version 1.0.0 (Current)

- ✅ Core YScript engine implementation
- ✅ Integration with 8 PresetAnalyzers
- ✅ Road Safety Act, Crimes Act, Evidence Act rules
- ✅ Extended rules for 6 additional statutes
- ✅ Comprehensive test suite (38 tests)
- ✅ Browser-based demo interface
- ✅ Production deployment guide

### Planned Features (v1.1.0)

- 🔄 Additional Victorian statutes (Magistrates' Court Act, Children, Youth and Families Act)
- 🔄 Rule validation wizard
- 🔄 Visual rule builder
- 🔄 Export to PDF reports
- 🔄 Multi-document batch analysis
- 🔄 Machine learning confidence adjustment

---

## License

PROPRIETARY - Victoria, Australia

© 2024 Forensic Legal Analysis Team. All rights reserved.

---

**Last Updated**: November 2024
**Document Version**: 1.0.0
**Engine Version**: 1.0.0
