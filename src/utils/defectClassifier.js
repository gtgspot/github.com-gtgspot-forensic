/**
 * Defect Classifier Utility
 *
 * Classifies and categorizes legal defects by type, severity,
 * and potential consequences.
 *
 * @version 1.0.0
 */

export class DefectClassifier {
  constructor() {
    this.defectTypes = {
      JURISDICTIONAL: {
        label: 'Jurisdictional Defect',
        severity: 'CRITICAL',
        description: 'Defect affecting court\'s jurisdiction or power to act'
      },
      PROCEDURAL: {
        label: 'Procedural Defect',
        severity: 'HIGH',
        description: 'Defect in procedure or process'
      },
      EVIDENTIARY: {
        label: 'Evidentiary Defect',
        severity: 'HIGH',
        description: 'Defect in evidence or admissibility'
      },
      STATUTORY: {
        label: 'Statutory Non-Compliance',
        severity: 'HIGH',
        description: 'Failure to comply with statutory requirements'
      },
      DISCLOSURE: {
        label: 'Disclosure Defect',
        severity: 'HIGH',
        description: 'Failure to disclose required material'
      },
      TEMPORAL: {
        label: 'Temporal Defect',
        severity: 'MEDIUM',
        description: 'Issue with dates, times, or sequences'
      },
      LINGUISTIC: {
        label: 'Linguistic Defect',
        severity: 'LOW',
        description: 'Ambiguous or unclear language'
      }
    };
  }

  /**
   * Classify a finding as a specific defect type
   * @param {Object} finding - Analysis finding
   * @returns {Object} Classified defect
   */
  classify(finding) {
    const defectType = this.determineType(finding);

    return {
      ...finding,
      defectType: defectType,
      defectLabel: this.defectTypes[defectType].label,
      recommendedSeverity: this.defectTypes[defectType].severity,
      classification: this.defectTypes[defectType].description,
      potentialConsequences: this.assessConsequences(defectType, finding)
    };
  }

  /**
   * Determine defect type from finding
   * @param {Object} finding - Analysis finding
   * @returns {string} Defect type
   */
  determineType(finding) {
    const type = (finding.type || '').toLowerCase();
    const description = (finding.description || '').toLowerCase();
    const combined = type + ' ' + description;

    if (combined.includes('jurisdiction') || combined.includes('authority') || combined.includes('power')) {
      return 'JURISDICTIONAL';
    }

    if (combined.includes('statutory') || combined.includes('compliance') || combined.includes('section')) {
      return 'STATUTORY';
    }

    if (combined.includes('evidence') || combined.includes('admissibility') || combined.includes('hearsay')) {
      return 'EVIDENTIARY';
    }

    if (combined.includes('disclosure') || combined.includes('brady') || combined.includes('material')) {
      return 'DISCLOSURE';
    }

    if (combined.includes('procedural') || combined.includes('procedure') || combined.includes('process')) {
      return 'PROCEDURAL';
    }

    if (combined.includes('date') || combined.includes('time') || combined.includes('temporal') || combined.includes('sequence')) {
      return 'TEMPORAL';
    }

    if (combined.includes('ambiguous') || combined.includes('unclear') || combined.includes('language')) {
      return 'LINGUISTIC';
    }

    // Default to procedural
    return 'PROCEDURAL';
  }

  /**
   * Assess potential consequences of a defect
   * @param {string} defectType - Type of defect
   * @param {Object} finding - Finding object
   * @returns {Array} Potential consequences
   */
  assessConsequences(defectType, finding) {
    const consequences = [];

    switch (defectType) {
      case 'JURISDICTIONAL':
        consequences.push('Proceedings may be void');
        consequences.push('Court lacks power to make orders');
        consequences.push('Charges may be dismissed');
        break;

      case 'STATUTORY':
        consequences.push('Evidence may be inadmissible');
        consequences.push('Charges may be dismissed');
        consequences.push('Procedural unfairness may result in stay');
        break;

      case 'EVIDENTIARY':
        consequences.push('Evidence may be excluded under s.137 or s.138');
        consequences.push('Prosecution case may be weakened');
        consequences.push('Reasonable doubt may arise');
        break;

      case 'DISCLOSURE':
        consequences.push('Brady violation - miscarriage of justice');
        consequences.push('Matter may be adjourned');
        consequences.push('Permanent stay may be granted');
        break;

      case 'PROCEDURAL':
        consequences.push('Procedural fairness issue');
        consequences.push('Matter may be adjourned');
        consequences.push('Evidence may be excluded');
        break;

      case 'TEMPORAL':
        consequences.push('Timeline inconsistencies may affect credibility');
        consequences.push('Reasonable doubt may arise');
        break;

      case 'LINGUISTIC':
        consequences.push('Interpretation issues may arise');
        consequences.push('Ambiguity may favor accused');
        break;
    }

    return consequences;
  }

  /**
   * Classify multiple findings
   * @param {Array} findings - Array of findings
   * @returns {Object} Classification results
   */
  classifyAll(findings) {
    const classified = findings.map(f => this.classify(f));

    const byType = {};
    const bySeverity = {
      CRITICAL: [],
      HIGH: [],
      MEDIUM: [],
      LOW: []
    };

    classified.forEach(defect => {
      // Group by type
      if (!byType[defect.defectType]) {
        byType[defect.defectType] = [];
      }
      byType[defect.defectType].push(defect);

      // Group by severity
      const severity = defect.recommendedSeverity || 'MEDIUM';
      if (bySeverity[severity]) {
        bySeverity[severity].push(defect);
      }
    });

    return {
      classified: classified,
      byType: byType,
      bySeverity: bySeverity,
      summary: {
        total: classified.length,
        critical: bySeverity.CRITICAL.length,
        high: bySeverity.HIGH.length,
        medium: bySeverity.MEDIUM.length,
        low: bySeverity.LOW.length
      }
    };
  }

  /**
   * Get defect type information
   * @param {string} type - Defect type
   * @returns {Object} Defect type info
   */
  getDefectInfo(type) {
    return this.defectTypes[type] || null;
  }
}

export default DefectClassifier;
