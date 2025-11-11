/**
 * Statute Parser Utility
 *
 * Parses and extracts statutory references from legal text.
 *
 * @version 1.0.0
 */

export class StatuteParser {
  constructor() {
    this.sectionPatterns = [
      /\bsection\s+(\d+[A-Z]*(?:\(\d+\))?(?:\([a-z]\))?)/gi,
      /\bs\.\s*(\d+[A-Z]*(?:\(\d+\))?(?:\([a-z]\))?)/gi,
      /\bs\s+(\d+[A-Z]*(?:\(\d+\))?(?:\([a-z]\))?)/gi,
      /\bsec\.\s*(\d+[A-Z]*(?:\(\d+\))?(?:\([a-z]\))?)/gi
    ];

    this.actPatterns = [
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+Act\s+\d{4}(?:\s+\(Vic\))?)/g,
      /\b(Road Safety Act 1986)/gi,
      /\b(Evidence Act 2008)/gi,
      /\b(Criminal Procedure Act 2009)/gi,
      /\b(Charter of Human Rights and Responsibilities Act 2006)/gi
    ];
  }

  /**
   * Parse all statutory references from text
   * @param {string} text - Document text
   * @returns {Object} Parsed statutory references
   */
  parse(text) {
    return {
      sections: this.extractSections(text),
      acts: this.extractActs(text),
      combined: this.combineReferences(text)
    };
  }

  /**
   * Extract section references
   * @param {string} text - Document text
   * @returns {Array} Section references
   */
  extractSections(text) {
    const sections = new Set();

    this.sectionPatterns.forEach(pattern => {
      let match;
      const regex = new RegExp(pattern);
      while ((match = regex.exec(text)) !== null) {
        sections.add(match[0]);
      }
    });

    return Array.from(sections).sort();
  }

  /**
   * Extract Act references
   * @param {string} text - Document text
   * @returns {Array} Act references
   */
  extractActs(text) {
    const acts = new Set();

    this.actPatterns.forEach(pattern => {
      let match;
      const regex = new RegExp(pattern);
      while ((match = regex.exec(text)) !== null) {
        acts.add(match[0]);
      }
    });

    return Array.from(acts);
  }

  /**
   * Combine Act and section references
   * @param {string} text - Document text
   * @returns {Array} Combined references
   */
  combineReferences(text) {
    const combined = [];
    const acts = this.extractActs(text);
    const sections = this.extractSections(text);

    // Try to match sections with acts
    sections.forEach(section => {
      const sectionNum = section.match(/\d+[A-Z]*/)?.[0];

      if (sectionNum) {
        combined.push({
          section: section,
          sectionNumber: sectionNum,
          possibleActs: acts,
          fullReference: acts.length > 0 ? `${acts[0]} ${section}` : section
        });
      }
    });

    return combined;
  }

  /**
   * Normalize section reference
   * @param {string} reference - Section reference
   * @returns {string} Normalized reference
   */
  normalizeSection(reference) {
    // Extract just the number and subsections
    const match = reference.match(/(\d+[A-Z]*(?:\(\d+\))?(?:\([a-z]\))?)/);
    return match ? match[1] : reference;
  }

  /**
   * Check if text contains specific section
   * @param {string} text - Document text
   * @param {string} sectionNumber - Section to check for
   * @returns {boolean} True if section found
   */
  containsSection(text, sectionNumber) {
    const pattern = new RegExp(`\\b(?:section|s\\.|s\\s)\\s*${sectionNumber}\\b`, 'i');
    return pattern.test(text);
  }
}

export default StatuteParser;
