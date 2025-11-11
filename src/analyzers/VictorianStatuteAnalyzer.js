/**
 * Victorian Statute Analyzer
 *
 * Core analyzer class for checking compliance with Victorian legislation.
 * Performs deep analysis of document text against statutory requirements.
 *
 * @version 1.0.0
 * @jurisdiction Victoria, Australia
 */

export class VictorianStatuteAnalyzer {
  constructor() {
    this.statutes = null;
    this.initialized = false;
  }

  /**
   * Initialize the analyzer by loading the statutes database
   * @returns {Promise<void>}
   */
  async init() {
    if (this.initialized) {
      return;
    }

    try {
      const response = await fetch('/src/data/victorianStatutes.json');
      if (!response.ok) {
        throw new Error(`Failed to load statutes: ${response.statusText}`);
      }
      this.statutes = await response.json();
      this.initialized = true;
      console.log('✓ Victorian Statute Analyzer initialized');
      console.log(`✓ Loaded ${Object.keys(this.statutes).length - 1} Acts`); // -1 for metadata
    } catch (error) {
      console.error('✗ Failed to initialize Victorian Statute Analyzer:', error);
      throw error;
    }
  }

  /**
   * Check if document text satisfies statutory requirements for a specific section
   * @param {string} documentText - The document text to analyze
   * @param {string} actName - The act name (e.g., "Road_Safety_Act_1986")
   * @param {string} sectionNumber - The section number (e.g., "49", "55D")
   * @returns {Object} Compliance check results
   */
  checkCompliance(documentText, actName, sectionNumber) {
    if (!this.initialized) {
      throw new Error('Analyzer not initialized. Call init() first.');
    }

    const act = this.statutes[actName];
    if (!act) {
      return {
        error: `Act not found: ${actName}`,
        available: Object.keys(this.statutes).filter(k => k !== 'metadata')
      };
    }

    const section = act.sections[sectionNumber];
    if (!section) {
      return {
        error: `Section not found: ${sectionNumber} in ${actName}`,
        available: Object.keys(act.sections)
      };
    }

    const results = {
      act: actName,
      actFullName: act.fullName,
      section: sectionNumber,
      sectionTitle: section.title,
      fullSection: section.fullSection,
      compliant: true,
      satisfied: [],
      missing: [],
      consequences: [],
      subsectionResults: {}
    };

    // Check each subsection
    if (section.subsections) {
      Object.entries(section.subsections).forEach(([subNum, subsection]) => {
        const subResults = this.checkSubsection(documentText, subsection, `${sectionNumber}(${subNum})`);
        results.subsectionResults[subNum] = subResults;

        if (!subResults.compliant) {
          results.compliant = false;
          results.missing.push(...subResults.missing);
          results.consequences.push(...subResults.consequences);
        } else {
          results.satisfied.push(...subResults.satisfied);
        }
      });
    }

    // Check paragraphs (for s.49)
    if (section.paragraphs) {
      const paragraphResults = this.checkParagraphs(documentText, section.paragraphs);
      results.paragraphResults = paragraphResults;
      results.satisfied.push(...paragraphResults.satisfied);
    }

    return results;
  }

  /**
   * Check compliance with a specific subsection
   * @param {string} text - Document text
   * @param {Object} subsection - Subsection data
   * @param {string} reference - Full reference (e.g., "49(1)")
   * @returns {Object} Subsection compliance results
   */
  checkSubsection(text, subsection, reference) {
    const results = {
      reference: reference,
      compliant: true,
      satisfied: [],
      missing: [],
      consequences: []
    };

    if (!subsection.elements) {
      return results;
    }

    subsection.elements.forEach(element => {
      const found = this.searchForElement(text, element);

      if (found.present) {
        results.satisfied.push({
          reference: reference,
          element: element.name,
          type: element.type,
          evidence: found.evidence
        });
      } else if (element.required) {
        results.compliant = false;
        results.missing.push({
          reference: reference,
          element: element.name,
          type: element.type,
          required: element.required,
          consequence: element.absence_consequence
        });
        if (element.absence_consequence) {
          results.consequences.push(element.absence_consequence);
        }
      }
    });

    return results;
  }

  /**
   * Check which paragraph of s.49(1) applies
   * @param {string} text - Document text
   * @param {Object} paragraphs - Paragraphs data
   * @returns {Object} Paragraph analysis
   */
  checkParagraphs(text, paragraphs) {
    const results = {
      satisfied: [],
      applicableParagraphs: []
    };

    Object.entries(paragraphs).forEach(([letter, paragraph]) => {
      const keywords = paragraph.keywords || [];
      let matchCount = 0;
      const foundKeywords = [];

      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${this.escapeRegex(keyword)}\\b`, 'gi');
        if (regex.test(text)) {
          matchCount++;
          foundKeywords.push(keyword);
        }
      });

      if (matchCount > 0) {
        results.applicableParagraphs.push({
          paragraph: letter,
          reference: paragraph.reference,
          description: paragraph.description,
          matchCount: matchCount,
          foundKeywords: foundKeywords
        });

        results.satisfied.push({
          reference: paragraph.reference,
          description: paragraph.description,
          evidence: foundKeywords
        });
      }
    });

    return results;
  }

  /**
   * Search for an element in text
   * @param {string} text - Document text
   * @param {Object} element - Element to search for
   * @returns {Object} Search results
   */
  searchForElement(text, element) {
    const textLower = text.toLowerCase();
    const results = {
      present: false,
      evidence: [],
      matches: []
    };

    // Search for keywords
    if (element.keywords) {
      element.keywords.forEach(keyword => {
        const regex = new RegExp(`.{0,100}${this.escapeRegex(keyword)}.{0,100}`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          results.present = true;
          results.evidence.push(...matches.map(m => m.trim()));
          results.matches.push(keyword);
        }
      });
    }

    // Search for specific grounds list
    if (element.grounds_list) {
      element.grounds_list.forEach(ground => {
        if (textLower.includes(ground.toLowerCase())) {
          results.present = true;
          results.evidence.push(ground);
          results.matches.push(ground);
        }
      });
    }

    // Search for options (any one is sufficient)
    if (element.options) {
      element.options.forEach(option => {
        if (textLower.includes(option.toLowerCase())) {
          results.present = true;
          results.evidence.push(option);
          results.matches.push(option);
        }
      });
    }

    // Special handling for test frameworks (e.g., reasonable belief test)
    if (element.test_framework) {
      const testResult = this.evaluateTestFramework(text, element.test_framework);
      results.present = testResult.passed;
      results.evidence.push(...testResult.evidence);
      results.testFrameworkResult = testResult;
    }

    // Remove duplicates
    results.evidence = [...new Set(results.evidence)];
    results.matches = [...new Set(results.matches)];

    return results;
  }

  /**
   * Evaluate a test framework (e.g., two-limb reasonable belief test)
   * @param {string} text - Document text
   * @param {Object} framework - Test framework definition
   * @returns {Object} Test framework evaluation
   */
  evaluateTestFramework(text, framework) {
    const result = {
      name: framework.name,
      authority: framework.authority,
      passed: false,
      evidence: [],
      limbResults: {}
    };

    if (framework.limbs) {
      let allLimbsPassed = true;

      Object.entries(framework.limbs).forEach(([limbName, limb]) => {
        const limbResult = {
          name: limb.name,
          description: limb.description,
          passed: false,
          foundIndicators: [],
          insufficientIndicators: []
        };

        // Check for required indicators
        if (limb.indicators) {
          limb.indicators.forEach(indicator => {
            const regex = new RegExp(`\\b${this.escapeRegex(indicator)}\\b`, 'gi');
            if (regex.test(text)) {
              limbResult.passed = true;
              limbResult.foundIndicators.push(indicator);
            }
          });
        }

        // Check for insufficient indicators (should NOT be present)
        if (limb.insufficient_indicators) {
          limb.insufficient_indicators.forEach(indicator => {
            const regex = new RegExp(`\\b${this.escapeRegex(indicator)}\\b`, 'gi');
            if (regex.test(text)) {
              limbResult.passed = false;
              limbResult.insufficientIndicators.push(indicator);
            }
          });
        }

        result.limbResults[limbName] = limbResult;

        if (!limbResult.passed && limb.required) {
          allLimbsPassed = false;
        }

        if (limbResult.foundIndicators.length > 0) {
          result.evidence.push(`${limbName}: ${limbResult.foundIndicators.join(', ')}`);
        }
      });

      result.passed = allLimbsPassed;
    }

    return result;
  }

  /**
   * Extract all statutory references from text
   * @param {string} text - Document text
   * @returns {Array<string>} Array of statutory references found
   */
  extractReferences(text) {
    const patterns = [
      /section\s+\d+[A-Z]?(?:\(\d+\))?(?:\([a-z]\))?/gi,
      /s\.\s*\d+[A-Z]?(?:\(\d+\))?(?:\([a-z]\))?/gi,
      /s\s+\d+[A-Z]?(?:\(\d+\))?(?:\([a-z]\))?/gi,
      /sec\.\s*\d+[A-Z]?(?:\(\d+\))?(?:\([a-z]\))?/gi
    ];

    const found = new Set();
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(m => found.add(m.trim()));
      }
    });

    return Array.from(found).sort();
  }

  /**
   * Identify which Acts govern this document based on statutory references
   * @param {Array<string>} references - Statutory references found in document
   * @returns {Array<Object>} Array of applicable Acts
   */
  identifyGoverningActs(references) {
    const acts = [];
    const actMatches = new Map();

    references.forEach(ref => {
      const sectionNum = this.extractSectionNumber(ref);

      // Check each act in database
      Object.entries(this.statutes).forEach(([actName, actData]) => {
        if (actName === 'metadata') return;

        if (actData.sections && actData.sections[sectionNum]) {
          if (!actMatches.has(actName)) {
            actMatches.set(actName, {
              actName: actName,
              fullName: actData.fullName,
              shortName: actData.shortName,
              category: actData.category,
              matchingSections: []
            });
          }
          actMatches.get(actName).matchingSections.push(sectionNum);
        }
      });
    });

    return Array.from(actMatches.values());
  }

  /**
   * Extract section number from a statutory reference
   * @param {string} reference - Statutory reference (e.g., "s.49(1)(g)")
   * @returns {string|null} Section number (e.g., "49")
   */
  extractSectionNumber(reference) {
    const match = reference.match(/(\d+[A-Z]?)/);
    return match ? match[1] : null;
  }

  /**
   * Analyze document for reasonable belief test compliance (George v Rockett)
   * @param {string} text - Document text
   * @returns {Object} Reasonable belief test analysis
   */
  analyzeReasonableBeliefTest(text) {
    const result = {
      testName: 'Reasonable Belief Test',
      authority: 'George v Rockett (1990) 170 CLR 104',
      subjective: {
        found: false,
        indicators: [],
        evidence: []
      },
      objective: {
        found: false,
        indicators: [],
        evidence: [],
        insufficientIndicators: []
      },
      compliant: false,
      issues: []
    };

    // Subjective element indicators
    const subjectiveIndicators = [
      'believed', 'believe', 'believing',
      'suspected', 'suspect', 'suspecting',
      'formed the belief', 'formed the opinion', 'formed the view',
      'formed a suspicion', 'my belief', 'my suspicion'
    ];

    subjectiveIndicators.forEach(indicator => {
      const regex = new RegExp(`\\b${this.escapeRegex(indicator)}\\b`, 'gi');
      const matches = text.match(new RegExp(`.{0,80}${this.escapeRegex(indicator)}.{0,80}`, 'gi'));
      if (matches) {
        result.subjective.found = true;
        result.subjective.indicators.push(indicator);
        result.subjective.evidence.push(...matches.map(m => m.trim()));
      }
    });

    // Objective element indicators
    const objectiveIndicators = [
      'observed', 'witnessed', 'saw', 'noted', 'detected',
      'measured', 'recorded', 'smelled', 'heard', 'photographed'
    ];

    objectiveIndicators.forEach(indicator => {
      const regex = new RegExp(`\\b${this.escapeRegex(indicator)}\\b`, 'gi');
      const matches = text.match(new RegExp(`.{0,80}${this.escapeRegex(indicator)}.{0,80}`, 'gi'));
      if (matches) {
        result.objective.found = true;
        result.objective.indicators.push(indicator);
        result.objective.evidence.push(...matches.map(m => m.trim()));
      }
    });

    // Insufficient grounds indicators
    const insufficientIndicators = [
      'appeared nervous', 'seemed nervous', 'looked nervous',
      'acted suspiciously', 'seemed suspicious',
      'gut feeling', 'hunch', 'instinct'
    ];

    insufficientIndicators.forEach(indicator => {
      const regex = new RegExp(`\\b${this.escapeRegex(indicator)}\\b`, 'gi');
      if (regex.test(text)) {
        result.objective.insufficientIndicators.push(indicator);
      }
    });

    // Determine compliance
    result.compliant = result.subjective.found &&
                       result.objective.found &&
                       result.objective.insufficientIndicators.length === 0;

    // Generate issues
    if (!result.subjective.found) {
      result.issues.push({
        severity: 'critical',
        type: 'Missing Subjective Element',
        description: 'Subjective element of reasonable belief test not established - officer must demonstrate genuine formation of belief',
        consequence: 'Test may be invalid - no evidence officer actually formed the belief'
      });
    }

    if (!result.objective.found) {
      result.issues.push({
        severity: 'critical',
        type: 'Missing Objective Element',
        description: 'Objective element of reasonable belief test not satisfied - belief must be based on specific, articulable facts',
        consequence: 'Test may be invalid - no objectively reasonable grounds for belief'
      });
    }

    if (result.objective.insufficientIndicators.length > 0) {
      result.issues.push({
        severity: 'high',
        type: 'Insufficient Grounds Detected',
        description: `Belief appears to be based on insufficient grounds: ${result.objective.insufficientIndicators.join(', ')}`,
        consequence: 'Reasonable belief cannot be based on mere hunch, nervousness, or subjective feeling'
      });
    }

    return result;
  }

  /**
   * Escape special regex characters
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Get all available Acts in the database
   * @returns {Array<Object>} Array of Acts
   */
  getAvailableActs() {
    return Object.entries(this.statutes)
      .filter(([key]) => key !== 'metadata')
      .map(([key, value]) => ({
        key: key,
        fullName: value.fullName,
        shortName: value.shortName,
        category: value.category
      }));
  }

  /**
   * Get sections for a specific Act
   * @param {string} actName - Act name
   * @returns {Array<Object>} Array of sections
   */
  getSectionsForAct(actName) {
    const act = this.statutes[actName];
    if (!act || !act.sections) {
      return [];
    }

    return Object.entries(act.sections).map(([num, section]) => ({
      number: num,
      fullSection: section.fullSection,
      title: section.title
    }));
  }
}

// Export for use in modules
export default VictorianStatuteAnalyzer;
