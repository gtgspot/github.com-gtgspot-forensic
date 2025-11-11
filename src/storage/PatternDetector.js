/**
 * Pattern Detector
 *
 * Machine learning-like pattern detection for recurring legal issues
 * and common defects across analyzed documents.
 *
 * @version 1.0.0
 */

export class PatternDetector {
  constructor() {
    this.patterns = new Map();
    this.threshold = 3; // Minimum occurrences to consider a pattern
  }

  /**
   * Analyze findings for patterns
   * @param {Array} findings - Analysis findings
   * @returns {Array} Detected patterns
   */
  detectPatterns(findings) {
    const detectedPatterns = [];

    // Group findings by type
    const findingsByType = new Map();
    findings.forEach(finding => {
      const type = finding.type || 'Unknown';
      if (!findingsByType.has(type)) {
        findingsByType.set(type, []);
      }
      findingsByType.get(type).push(finding);
    });

    // Analyze each group
    findingsByType.forEach((groupFindings, type) => {
      if (groupFindings.length >= this.threshold) {
        detectedPatterns.push({
          type: 'Recurring Issue',
          category: type,
          frequency: groupFindings.length,
          description: `"${type}" appears ${groupFindings.length} times in document`,
          significance: this.assessSignificance(groupFindings.length),
          examples: groupFindings.slice(0, 3)
        });
      }
    });

    // Detect temporal patterns
    detectedPatterns.push(...this.detectTemporalPatterns(findings));

    // Detect severity patterns
    detectedPatterns.push(...this.detectSeverityPatterns(findings));

    return detectedPatterns;
  }

  /**
   * Detect temporal patterns in findings
   * @param {Array} findings - Analysis findings
   * @returns {Array} Temporal patterns
   */
  detectTemporalPatterns(findings) {
    const patterns = [];

    // Count temporal references
    const temporalFindings = findings.filter(f =>
      f.type && f.type.toLowerCase().includes('temporal')
    );

    if (temporalFindings.length > 5) {
      patterns.push({
        type: 'Temporal Pattern',
        category: 'High Temporal Reference Density',
        frequency: temporalFindings.length,
        description: 'Document contains many temporal references - timeline analysis recommended',
        significance: 'MEDIUM'
      });
    }

    return patterns;
  }

  /**
   * Detect severity patterns
   * @param {Array} findings - Analysis findings
   * @returns {Array} Severity patterns
   */
  detectSeverityPatterns(findings) {
    const patterns = [];

    // Count by severity
    const severityCounts = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0
    };

    findings.forEach(finding => {
      const severity = finding.severity ? finding.severity.toUpperCase() : 'LOW';
      if (severityCounts.hasOwnProperty(severity)) {
        severityCounts[severity]++;
      }
    });

    // Detect critical issue clusters
    if (severityCounts.CRITICAL > 3) {
      patterns.push({
        type: 'Severity Pattern',
        category: 'Multiple Critical Issues',
        frequency: severityCounts.CRITICAL,
        description: `Document has ${severityCounts.CRITICAL} CRITICAL issues - urgent review required`,
        significance: 'CRITICAL'
      });
    }

    return patterns;
  }

  /**
   * Learn from analysis results
   * @param {Object} analysisResults - Complete analysis results
   */
  learn(analysisResults) {
    if (!analysisResults.findings) return;

    // Extract patterns
    const patterns = this.detectPatterns(analysisResults.findings);

    // Store patterns
    patterns.forEach(pattern => {
      const key = `${pattern.type}:${pattern.category}`;
      if (this.patterns.has(key)) {
        const existing = this.patterns.get(key);
        existing.count++;
        existing.totalFrequency += pattern.frequency;
      } else {
        this.patterns.set(key, {
          ...pattern,
          count: 1,
          totalFrequency: pattern.frequency,
          firstSeen: new Date().toISOString()
        });
      }
    });
  }

  /**
   * Get learned patterns
   * @returns {Array} All learned patterns
   */
  getLearnedPatterns() {
    return Array.from(this.patterns.values())
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Assess pattern significance
   * @param {number} frequency - Pattern frequency
   * @returns {string} Significance level
   */
  assessSignificance(frequency) {
    if (frequency >= 10) return 'CRITICAL';
    if (frequency >= 7) return 'HIGH';
    if (frequency >= 5) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Reset learned patterns
   */
  reset() {
    this.patterns.clear();
  }
}

export default PatternDetector;
