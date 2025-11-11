/**
 * Cross Reference Engine (Phase B)
 *
 * Performs cross-document analysis, identifying discrepancies, contradictions,
 * and inconsistencies across multiple legal documents.
 *
 * @version 1.0.0
 * @jurisdiction Victoria, Australia
 */

export class CrossReferenceEngine {
  constructor() {
    this.documents = [];
    this.crossReferences = [];
    this.discrepancies = [];
  }

  /**
   * Add a document to the cross-reference analysis
   * @param {Object} document - Document object with text, name, and metadata
   */
  addDocument(document) {
    this.documents.push({
      id: this.documents.length + 1,
      name: document.name || `Document ${this.documents.length + 1}`,
      text: document.text,
      metadata: document.metadata || {},
      dates: this.extractDates(document.text),
      times: this.extractTimes(document.text),
      locations: this.extractLocations(document.text),
      persons: this.extractPersons(document.text),
      events: this.extractEvents(document.text)
    });
  }

  /**
   * Extract dates from text
   * @param {string} text - Document text
   * @returns {Array} Array of date objects
   */
  extractDates(text) {
    const dates = [];
    const datePatterns = [
      /\b(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})\b/g,
      /\b(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})\b/gi,
      /\b(\d{4}-\d{2}-\d{2})\b/g
    ];

    datePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        dates.push({
          value: match[0],
          position: match.index,
          context: text.substring(Math.max(0, match.index - 50), match.index + 50)
        });
      }
    });

    return dates;
  }

  /**
   * Extract times from text
   * @param {string} text - Document text
   * @returns {Array} Array of time objects
   */
  extractTimes(text) {
    const times = [];
    const timePattern = /\b(\d{1,2}:\d{2}(?::\d{2})?\s*(?:am|pm|AM|PM|hours)?)\b/g;

    let match;
    while ((match = timePattern.exec(text)) !== null) {
      times.push({
        value: match[0],
        position: match.index,
        context: text.substring(Math.max(0, match.index - 50), match.index + 50)
      });
    }

    return times;
  }

  /**
   * Extract locations from text
   * @param {string} text - Document text
   * @returns {Array} Array of location objects
   */
  extractLocations(text) {
    const locations = [];
    const locationPatterns = [
      /\b(\d+\s+[A-Z][a-z]+\s+(?:Street|St|Road|Rd|Avenue|Ave|Drive|Dr|Court|Ct))\b/g,
      /\b((?:City|Town|Suburb)\s+of\s+[A-Z][a-z]+)\b/g,
      /\b([A-Z][a-z]+,\s+Victoria)\b/g
    ];

    locationPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        locations.push({
          value: match[0],
          position: match.index,
          context: text.substring(Math.max(0, match.index - 50), match.index + 50)
        });
      }
    });

    return locations;
  }

  /**
   * Extract person names and references
   * @param {string} text - Document text
   * @returns {Array} Array of person objects
   */
  extractPersons(text) {
    const persons = [];
    const personPatterns = [
      /\b((?:Mr|Mrs|Ms|Miss|Dr|Officer|Constable|Sergeant|Detective|Inspector)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g,
      /\b(accused|defendant|informant|witness|driver|passenger)\b/gi
    ];

    personPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        persons.push({
          value: match[0],
          position: match.index,
          context: text.substring(Math.max(0, match.index - 50), match.index + 50)
        });
      }
    });

    return persons;
  }

  /**
   * Extract key events from text
   * @param {string} text - Document text
   * @returns {Array} Array of event objects
   */
  extractEvents(text) {
    const events = [];
    const eventPatterns = [
      /\b(stopped|arrested|tested|breathaly[zs]ed|charged|detained|questioned|searched)\b/gi,
      /\b(accident|collision|crash|incident)\b/gi,
      /\b(test\s+(?:was\s+)?conducted|sample\s+(?:was\s+)?taken|reading\s+(?:was\s+)?obtained)\b/gi
    ];

    eventPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        events.push({
          value: match[0],
          position: match.index,
          context: text.substring(Math.max(0, match.index - 50), match.index + 50)
        });
      }
    });

    return events;
  }

  /**
   * Perform cross-document analysis
   * @returns {Object} Cross-reference analysis results
   */
  analyze() {
    if (this.documents.length < 2) {
      return {
        status: 'insufficient_documents',
        message: 'At least 2 documents required for cross-reference analysis',
        documentCount: this.documents.length
      };
    }

    const results = {
      documentCount: this.documents.length,
      dateDiscrepancies: this.compareDates(),
      timeDiscrepancies: this.compareTimes(),
      locationDiscrepancies: this.compareLocations(),
      eventSequenceDiscrepancies: this.compareEventSequences(),
      overallConsistency: 'unknown'
    };

    // Calculate overall consistency
    const totalDiscrepancies =
      results.dateDiscrepancies.length +
      results.timeDiscrepancies.length +
      results.locationDiscrepancies.length +
      results.eventSequenceDiscrepancies.length;

    if (totalDiscrepancies === 0) {
      results.overallConsistency = 'consistent';
    } else if (totalDiscrepancies <= 3) {
      results.overallConsistency = 'minor_discrepancies';
    } else if (totalDiscrepancies <= 7) {
      results.overallConsistency = 'moderate_discrepancies';
    } else {
      results.overallConsistency = 'major_discrepancies';
    }

    return results;
  }

  /**
   * Compare dates across documents
   * @returns {Array} Date discrepancies
   */
  compareDates() {
    const discrepancies = [];
    const datesByValue = new Map();

    // Group dates by normalized value
    this.documents.forEach(doc => {
      doc.dates.forEach(date => {
        const normalized = this.normalizeDate(date.value);
        if (!datesByValue.has(normalized)) {
          datesByValue.set(normalized, []);
        }
        datesByValue.get(normalized).push({
          docId: doc.id,
          docName: doc.name,
          originalValue: date.value,
          context: date.context
        });
      });
    });

    // Check for conflicting dates
    if (datesByValue.size > 1) {
      discrepancies.push({
        type: 'Multiple Dates',
        severity: 'HIGH',
        description: `Found ${datesByValue.size} different dates across documents`,
        details: Array.from(datesByValue.entries()).map(([normalized, occurrences]) => ({
          date: normalized,
          occurrences: occurrences
        }))
      });
    }

    return discrepancies;
  }

  /**
   * Compare times across documents
   * @returns {Array} Time discrepancies
   */
  compareTimes() {
    const discrepancies = [];
    const timesByValue = new Map();

    this.documents.forEach(doc => {
      doc.times.forEach(time => {
        const normalized = this.normalizeTime(time.value);
        if (!timesByValue.has(normalized)) {
          timesByValue.set(normalized, []);
        }
        timesByValue.get(normalized).push({
          docId: doc.id,
          docName: doc.name,
          originalValue: time.value,
          context: time.context
        });
      });
    });

    // Check for time differences greater than 5 minutes
    const times = Array.from(timesByValue.keys());
    for (let i = 0; i < times.length; i++) {
      for (let j = i + 1; j < times.length; j++) {
        const diff = Math.abs(this.timeToMinutes(times[i]) - this.timeToMinutes(times[j]));
        if (diff > 5) {
          discrepancies.push({
            type: 'Time Discrepancy',
            severity: 'HIGH',
            description: `Time difference of ${diff} minutes between documents`,
            details: {
              time1: times[i],
              time2: times[j],
              documents: [
                ...timesByValue.get(times[i]),
                ...timesByValue.get(times[j])
              ]
            }
          });
        }
      }
    }

    return discrepancies;
  }

  /**
   * Compare locations across documents
   * @returns {Array} Location discrepancies
   */
  compareLocations() {
    const discrepancies = [];
    const locationsByValue = new Map();

    this.documents.forEach(doc => {
      doc.locations.forEach(location => {
        const normalized = location.value.toLowerCase().trim();
        if (!locationsByValue.has(normalized)) {
          locationsByValue.set(normalized, []);
        }
        locationsByValue.get(normalized).push({
          docId: doc.id,
          docName: doc.name,
          originalValue: location.value,
          context: location.context
        });
      });
    });

    if (locationsByValue.size > 1) {
      discrepancies.push({
        type: 'Multiple Locations',
        severity: 'MEDIUM',
        description: `Found ${locationsByValue.size} different locations across documents`,
        details: Array.from(locationsByValue.entries()).map(([normalized, occurrences]) => ({
          location: normalized,
          occurrences: occurrences
        }))
      });
    }

    return discrepancies;
  }

  /**
   * Compare event sequences across documents
   * @returns {Array} Event sequence discrepancies
   */
  compareEventSequences() {
    const discrepancies = [];

    // This is a simplified version - full implementation would use more sophisticated
    // natural language processing and timeline construction

    if (this.documents.length >= 2) {
      const doc1Events = this.documents[0].events.map(e => e.value.toLowerCase());
      const doc2Events = this.documents[1].events.map(e => e.value.toLowerCase());

      // Check for events in one document but not the other
      doc1Events.forEach(event => {
        if (!doc2Events.includes(event)) {
          discrepancies.push({
            type: 'Missing Event',
            severity: 'MEDIUM',
            description: `Event "${event}" mentioned in ${this.documents[0].name} but not in ${this.documents[1].name}`,
            details: {
              event: event,
              inDocument: this.documents[0].name,
              missingFrom: this.documents[1].name
            }
          });
        }
      });
    }

    return discrepancies;
  }

  /**
   * Normalize date string for comparison
   * @param {string} dateStr - Date string
   * @returns {string} Normalized date
   */
  normalizeDate(dateStr) {
    // This is a simplified normalization - full implementation would use proper date parsing
    return dateStr.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  /**
   * Normalize time string for comparison
   * @param {string} timeStr - Time string
   * @returns {string} Normalized time
   */
  normalizeTime(timeStr) {
    return timeStr.toLowerCase().replace(/\s+/g, '').trim();
  }

  /**
   * Convert time string to minutes since midnight
   * @param {string} timeStr - Time string
   * @returns {number} Minutes since midnight
   */
  timeToMinutes(timeStr) {
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (!match) return 0;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);

    // Handle PM times
    if (timeStr.toLowerCase().includes('pm') && hours < 12) {
      hours += 12;
    }

    return hours * 60 + minutes;
  }

  /**
   * Clear all documents and reset engine
   */
  reset() {
    this.documents = [];
    this.crossReferences = [];
    this.discrepancies = [];
  }
}

export default CrossReferenceEngine;
