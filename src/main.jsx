/**
 * Forensic Legal Analyzer - Main Application
 *
 * Modular application orchestrator that initializes and coordinates all
 * analysis modules for Victorian legal document analysis.
 *
 * @version 2.0.0
 * @jurisdiction Victoria, Australia
 */

// Import analyzers
import { VictorianStatuteAnalyzer } from './analyzers/VictorianStatuteAnalyzer.js';
import {
  initializePresetAnalyzers,
  getAllPresets,
  runAnalysis
} from './analyzers/PresetAnalyzers.js';
import { CrossReferenceEngine } from './analyzers/CrossReferenceEngine.js';
import { InterpretationEngine } from './analyzers/InterpretationEngine.js';

// Import storage modules
import { AnalysisDatabase } from './storage/AnalysisDatabase.js';
import { PatternDetector } from './storage/PatternDetector.js';
import { TimelineManager } from './storage/TimelineManager.js';

// Import utilities
import { TextExtractor } from './utils/textExtractor.js';
import { StatuteParser } from './utils/statuteParser.js';
import { DefectClassifier } from './utils/defectClassifier.js';
import { ExportManager } from './utils/exportManager.js';

/**
 * Main Application Class
 */
class ForensicAnalyzerApp {
  constructor() {
    // Core analyzers
    this.statuteAnalyzer = null;
    this.crossReferenceEngine = new CrossReferenceEngine();
    this.interpretationEngine = new InterpretationEngine();

    // Storage
    this.database = new AnalysisDatabase();
    this.patternDetector = new PatternDetector();
    this.timelineManager = new TimelineManager();

    // Utilities
    this.textExtractor = new TextExtractor();
    this.statuteParser = new StatuteParser();
    this.defectClassifier = new DefectClassifier();
    this.exportManager = new ExportManager();

    // State
    this.initialized = false;
    this.documents = [];
    this.currentAnalysis = null;
  }

  /**
   * Initialize the application
   */
  async initialize() {
    if (this.initialized) {
      console.log('Application already initialized');
      return;
    }

    console.log('Initializing Forensic Legal Analyzer...');

    try {
      // Initialize statute analyzer
      this.statuteAnalyzer = new VictorianStatuteAnalyzer();
      await this.statuteAnalyzer.init();

      // Initialize preset analyzers
      await initializePresetAnalyzers();

      // Initialize interpretation engine
      await this.interpretationEngine.init();

      // Initialize database
      await this.database.init();

      this.initialized = true;
      console.log('✓ Application initialized successfully');

      return {
        success: true,
        message: 'Forensic Legal Analyzer initialized'
      };
    } catch (error) {
      console.error('✗ Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Process a uploaded file
   * @param {File} file - Uploaded file
   * @returns {Promise<Object>} Processing results
   */
  async processFile(file) {
    if (!this.initialized) {
      await this.initialize();
    }

    console.log(`Processing file: ${file.name}`);

    try {
      // Extract text from file
      const text = await this.textExtractor.extractText(file);
      console.log(`✓ Extracted ${text.length} characters`);

      // Store document
      const document = {
        name: file.name,
        text: text,
        uploadedAt: new Date().toISOString(),
        size: file.size,
        type: file.type
      };

      await this.database.saveDocument(document);
      this.documents.push(document);

      // Add to cross-reference engine
      this.crossReferenceEngine.addDocument(document);

      return {
        success: true,
        document: document,
        textLength: text.length
      };
    } catch (error) {
      console.error('File processing error:', error);
      throw error;
    }
  }

  /**
   * Run complete analysis on a document
   * @param {string} documentText - Document text
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Complete analysis results
   */
  async analyzeDocument(documentText, options = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    console.log('Starting comprehensive analysis...');

    const results = {
      timestamp: new Date().toISOString(),
      phases: {}
    };

    try {
      // Phase A: Preset Analysis
      console.log('Phase A: Running preset analyses...');
      const selectedPresets = options.presets || [1, 2, 3, 4, 5, 6, 7, 8];
      const presetResults = await runAnalysis(documentText, selectedPresets, this.documents);
      results.phases.presetAnalysis = presetResults;

      // Detect patterns
      const allFindings = presetResults.flatMap(r => r.findings || []);
      const patterns = this.patternDetector.detectPatterns(allFindings);
      results.phases.patterns = patterns;

      // Extract timeline
      const timeline = this.timelineManager.extractTimeline(documentText);
      results.phases.timeline = timeline;

      // Phase B: Cross-Reference Analysis (if multiple documents)
      if (this.documents.length > 1) {
        console.log('Phase B: Running cross-reference analysis...');
        const crossRefResults = this.crossReferenceEngine.analyze();
        results.phases.crossReference = crossRefResults;
      }

      // Phase C: Interpretation Analysis
      console.log('Phase C: Running legal interpretation analysis...');
      const interpretationResults = await this.interpretationEngine.analyze(documentText);
      results.phases.interpretation = interpretationResults;

      // Classify defects
      if (allFindings.length > 0) {
        const classification = this.defectClassifier.classifyAll(allFindings);
        results.defectClassification = classification;
      }

      // Overall summary
      results.summary = this.generateSummary(results);

      // Save to database
      await this.database.saveAnalysis(results);

      // Learn from results
      this.patternDetector.learn(results);

      this.currentAnalysis = results;
      console.log('✓ Analysis complete');

      return results;
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  }

  /**
   * Generate overall summary
   * @param {Object} results - Analysis results
   * @returns {Object} Summary
   */
  generateSummary(results) {
    const summary = {
      totalFindings: 0,
      criticalIssues: 0,
      highIssues: 0,
      mediumIssues: 0,
      lowIssues: 0,
      patternsDetected: 0,
      overallStatus: 'UNKNOWN'
    };

    // Count findings
    if (results.phases.presetAnalysis) {
      results.phases.presetAnalysis.forEach(preset => {
        if (preset.findings) {
          summary.totalFindings += preset.findings.length;
          preset.findings.forEach(f => {
            const severity = (f.severity || 'LOW').toUpperCase();
            if (severity === 'CRITICAL') summary.criticalIssues++;
            else if (severity === 'HIGH') summary.highIssues++;
            else if (severity === 'MEDIUM') summary.mediumIssues++;
            else summary.lowIssues++;
          });
        }
      });
    }

    // Count patterns
    if (results.phases.patterns) {
      summary.patternsDetected = results.phases.patterns.length;
    }

    // Determine overall status
    if (summary.criticalIssues > 0) {
      summary.overallStatus = 'CRITICAL NON-COMPLIANCE';
    } else if (summary.highIssues > 5) {
      summary.overallStatus = 'HIGH RISK';
    } else if (summary.highIssues > 0) {
      summary.overallStatus = 'MODERATE RISK';
    } else if (summary.mediumIssues > 0) {
      summary.overallStatus = 'LOW RISK';
    } else {
      summary.overallStatus = 'COMPLIANT';
    }

    return summary;
  }

  /**
   * Export current analysis
   * @param {string} format - Export format (pdf, docx, json, csv)
   * @param {string} fileName - Output file name
   */
  async exportAnalysis(format, fileName) {
    if (!this.currentAnalysis) {
      throw new Error('No analysis to export');
    }

    await this.exportManager.export(this.currentAnalysis, format, fileName);
  }

  /**
   * Get all available presets
   * @returns {Array} Array of presets
   */
  getPresets() {
    return getAllPresets();
  }

  /**
   * Get analysis history
   * @returns {Promise<Array>} Array of past analyses
   */
  async getHistory() {
    return await this.database.getAllAnalyses();
  }

  /**
   * Get learned patterns
   * @returns {Array} Learned patterns
   */
  getLearnedPatterns() {
    return this.patternDetector.getLearnedPatterns();
  }

  /**
   * Clear application data
   */
  async clearData() {
    await this.database.clearAll();
    this.patternDetector.reset();
    this.timelineManager.clear();
    this.crossReferenceEngine.reset();
    this.documents = [];
    this.currentAnalysis = null;
    console.log('✓ Application data cleared');
  }

  /**
   * Get application status
   * @returns {Object} Application status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      documentsLoaded: this.documents.length,
      hasCurrentAnalysis: !!this.currentAnalysis,
      learnedPatterns: this.patternDetector.patterns.size,
      timelineEvents: this.timelineManager.events.length
    };
  }
}

// Create and export singleton instance
const app = new ForensicAnalyzerApp();

// Auto-initialize on module load
app.initialize().catch(error => {
  console.error('Failed to initialize application:', error);
});

// Export for use in other modules
export default app;
export { ForensicAnalyzerApp };

// Make available globally for browser usage
if (typeof window !== 'undefined') {
  window.ForensicAnalyzer = app;
}

console.log('✓ Forensic Legal Analyzer loaded');
