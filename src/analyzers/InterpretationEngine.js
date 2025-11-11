/**
 * Interpretation Engine (Phase C)
 *
 * Performs deep legal interpretation analysis, applying statutory interpretation
 * principles, identifying legal issues, and assessing compliance.
 *
 * @version 1.0.0
 * @jurisdiction Victoria, Australia
 */

import { VictorianStatuteAnalyzer } from './VictorianStatuteAnalyzer.js';

export class InterpretationEngine {
  constructor() {
    this.statuteAnalyzer = null;
    this.initialized = false;
  }

  /**
   * Initialize the interpretation engine
   */
  async init() {
    if (!this.initialized) {
      this.statuteAnalyzer = new VictorianStatuteAnalyzer();
      await this.statuteAnalyzer.init();
      this.initialized = true;
    }
  }

  /**
   * Perform comprehensive legal interpretation analysis
   * @param {string} documentText - Document text to analyze
   * @param {Object} options - Analysis options
   * @returns {Object} Interpretation results
   */
  async analyze(documentText, options = {}) {
    if (!this.initialized) {
      await this.init();
    }

    const results = {
      timestamp: new Date().toISOString(),
      documentLength: documentText.length,
      interpretations: [],
      legalIssues: [],
      complianceAssessment: {},
      recommendations: []
    };

    // 1. Identify statutory framework
    const statutoryReferences = this.statuteAnalyzer.extractReferences(documentText);
    const governingActs = this.statuteAnalyzer.identifyGoverningActs(statutoryReferences);

    results.statutoryFramework = {
      references: statutoryReferences,
      governingActs: governingActs
    };

    // 2. Apply interpretation principles
    results.interpretations.push(...this.applyInterpretationPrinciples(documentText));

    // 3. Identify legal issues
    results.legalIssues.push(...this.identifyLegalIssues(documentText, governingActs));

    // 4. Assess compliance
    results.complianceAssessment = await this.assessCompliance(documentText, governingActs);

    // 5. Generate recommendations
    results.recommendations = this.generateRecommendations(results);

    return results;
  }

  /**
   * Apply statutory interpretation principles
   * @param {string} text - Document text
   * @returns {Array} Interpretation findings
   */
  applyInterpretationPrinciples(text) {
    const interpretations = [];

    // Literal Interpretation
    interpretations.push({
      principle: 'Literal Interpretation',
      description: 'Plain meaning of words analysis',
      findings: this.literalInterpretation(text)
    });

    // Purposive Interpretation
    interpretations.push({
      principle: 'Purposive Interpretation',
      description: 'Legislative purpose and intent analysis',
      findings: this.purposiveInterpretation(text)
    });

    // Contextual Interpretation
    interpretations.push({
      principle: 'Contextual Interpretation',
      description: 'Context and circumstances analysis',
      findings: this.contextualInterpretation(text)
    });

    return interpretations;
  }

  /**
   * Literal interpretation analysis
   * @param {string} text - Document text
   * @returns {Array} Literal interpretation findings
   */
  literalInterpretation(text) {
    const findings = [];

    // Check for defined terms
    const definedTermsPattern = /\b([A-Za-z\s]+)\s+means\b/gi;
    let match;
    while ((match = definedTermsPattern.exec(text)) !== null) {
      findings.push({
        type: 'Defined Term',
        term: match[1].trim(),
        significance: 'Term has specific statutory meaning'
      });
    }

    // Check for ambiguous language
    const ambiguousTerms = ['reasonable', 'appropriate', 'sufficient', 'adequate', 'proper'];
    ambiguousTerms.forEach(term => {
      const pattern = new RegExp(`\\b${term}\\b`, 'gi');
      if (pattern.test(text)) {
        findings.push({
          type: 'Ambiguous Language',
          term: term,
          significance: 'Requires objective interpretation based on circumstances'
        });
      }
    });

    return findings;
  }

  /**
   * Purposive interpretation analysis
   * @param {string} text - Document text
   * @returns {Array} Purposive interpretation findings
   */
  purposiveInterpretation(text) {
    const findings = [];

    // Check for purpose statements
    const purposePatterns = [
      /\b(purpose|object|objective|aim)\s+(?:of|is|was)\b/gi,
      /\b(in order to|so as to|for the purpose of)\b/gi,
      /\b(prevent|deter|ensure|protect|safeguard)\b/gi
    ];

    purposePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        findings.push({
          type: 'Purpose Indicator',
          text: match[0],
          significance: 'Indicates legislative intent and purpose'
        });
      }
    });

    return findings;
  }

  /**
   * Contextual interpretation analysis
   * @param {string} text - Document text
   * @returns {Array} Contextual interpretation findings
   */
  contextualInterpretation(text) {
    const findings = [];

    // Check for contextual qualifiers
    const contextualPatterns = [
      /\b(in\s+the\s+circumstances|given\s+the\s+circumstances)\b/gi,
      /\b(in\s+this\s+case|in\s+the\s+present\s+case)\b/gi,
      /\b(having\s+regard\s+to|taking\s+into\s+account)\b/gi
    ];

    contextualPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        findings.push({
          type: 'Contextual Qualifier',
          text: match[0],
          significance: 'Indicates context-dependent interpretation required'
        });
      }
    });

    return findings;
  }

  /**
   * Identify legal issues in the document
   * @param {string} text - Document text
   * @param {Array} governingActs - Governing Acts
   * @returns {Array} Legal issues identified
   */
  identifyLegalIssues(text, governingActs) {
    const issues = [];

    // Check for procedural defects
    if (!/\b(inform|advised|told|explained).*\b(requirement|right|obligation)\b/gi.test(text)) {
      issues.push({
        category: 'Procedural Defect',
        severity: 'HIGH',
        description: 'No evidence person was informed of requirements or rights',
        statute: 'General procedural fairness'
      });
    }

    // Check for reasonable belief issues
    if (/\breasonable\s+belief\b/gi.test(text)) {
      const beliefTest = this.statuteAnalyzer.analyzeReasonableBeliefTest(text);
      if (!beliefTest.compliant) {
        issues.push({
          category: 'Reasonable Belief Test Failure',
          severity: 'CRITICAL',
          description: 'Reasonable belief test not satisfied - George v Rockett (1990) two-limb test',
          statute: 'Road Safety Act 1986 s.49(1)(g)',
          details: beliefTest.issues
        });
      }
    }

    // Check for authority issues
    if (!/\b(authoriz|authoris|authority)\b/gi.test(text) && governingActs.some(act => act.actName === 'Road_Safety_Act_1986')) {
      issues.push({
        category: 'Authority Defect',
        severity: 'CRITICAL',
        description: 'No evidence of proper authority to conduct test',
        statute: 'Road Safety Act 1986 s.55D'
      });
    }

    // Check for hearsay issues
    const hearsayIndicators = ['told', 'said', 'stated', 'reported', 'informed'];
    hearsayIndicators.forEach(indicator => {
      const pattern = new RegExp(`\\b${indicator}\\b`, 'gi');
      if (pattern.test(text)) {
        issues.push({
          category: 'Potential Hearsay',
          severity: 'MEDIUM',
          description: `Hearsay indicator "${indicator}" found - check for exceptions`,
          statute: 'Evidence Act 2008 Chapter 3'
        });
      }
    });

    return issues;
  }

  /**
   * Assess compliance with governing legislation
   * @param {string} text - Document text
   * @param {Array} governingActs - Governing Acts
   * @returns {Object} Compliance assessment
   */
  async assessCompliance(text, governingActs) {
    const assessment = {
      overallCompliance: 'unknown',
      actCompliance: [],
      criticalIssues: 0,
      highIssues: 0,
      mediumIssues: 0,
      lowIssues: 0
    };

    // Assess compliance with each governing act
    for (const act of governingActs) {
      const actAssessment = {
        actName: act.fullName,
        sections: [],
        compliant: true,
        issues: []
      };

      // Check compliance with each section
      for (const sectionNum of act.matchingSections) {
        try {
          const complianceCheck = this.statuteAnalyzer.checkCompliance(text, act.actName, sectionNum);

          actAssessment.sections.push({
            section: sectionNum,
            compliant: complianceCheck.compliant,
            satisfied: complianceCheck.satisfied,
            missing: complianceCheck.missing
          });

          if (!complianceCheck.compliant) {
            actAssessment.compliant = false;
            actAssessment.issues.push(...complianceCheck.missing);
          }
        } catch (error) {
          console.error(`Error checking compliance for ${act.actName} s.${sectionNum}:`, error);
        }
      }

      // Count issues by severity
      actAssessment.issues.forEach(issue => {
        if (issue.type && issue.type.includes('critical')) {
          assessment.criticalIssues++;
        } else if (issue.required) {
          assessment.highIssues++;
        } else {
          assessment.mediumIssues++;
        }
      });

      assessment.actCompliance.push(actAssessment);
    }

    // Determine overall compliance
    if (assessment.criticalIssues > 0) {
      assessment.overallCompliance = 'CRITICAL NON-COMPLIANCE';
    } else if (assessment.highIssues > 0) {
      assessment.overallCompliance = 'HIGH RISK NON-COMPLIANCE';
    } else if (assessment.mediumIssues > 0) {
      assessment.overallCompliance = 'PARTIAL COMPLIANCE';
    } else {
      assessment.overallCompliance = 'COMPLIANT';
    }

    return assessment;
  }

  /**
   * Generate recommendations based on analysis
   * @param {Object} results - Analysis results
   * @returns {Array} Recommendations
   */
  generateRecommendations(results) {
    const recommendations = [];

    // Recommendations based on legal issues
    if (results.legalIssues.length > 0) {
      const criticalIssues = results.legalIssues.filter(i => i.severity === 'CRITICAL');
      if (criticalIssues.length > 0) {
        recommendations.push({
          priority: 'CRITICAL',
          category: 'Legal Issues',
          recommendation: `Address ${criticalIssues.length} critical legal issue(s) immediately`,
          details: criticalIssues.map(i => i.description)
        });
      }
    }

    // Recommendations based on compliance
    if (results.complianceAssessment.criticalIssues > 0) {
      recommendations.push({
        priority: 'CRITICAL',
        category: 'Compliance',
        recommendation: 'Critical statutory non-compliance detected - seek legal advice',
        details: ['Document does not satisfy mandatory statutory requirements']
      });
    }

    // Recommendations based on interpretations
    const ambiguousTerms = results.interpretations
      .flatMap(i => i.findings)
      .filter(f => f.type === 'Ambiguous Language');

    if (ambiguousTerms.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Clarity',
        recommendation: 'Define or clarify ambiguous terms',
        details: ambiguousTerms.map(t => `Term "${t.term}" requires objective definition`)
      });
    }

    return recommendations;
  }
}

export default InterpretationEngine;
