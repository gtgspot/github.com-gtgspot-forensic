/**
 * Timeline Manager
 *
 * Manages chronological tracking of events, dates, and times
 * across legal documents for timeline reconstruction.
 *
 * @version 1.0.0
 */

export class TimelineManager {
  constructor() {
    this.events = [];
    this.dates = [];
    this.times = [];
  }

  /**
   * Add an event to the timeline
   * @param {Object} event - Event object
   */
  addEvent(event) {
    this.events.push({
      ...event,
      id: this.events.length + 1,
      addedAt: new Date().toISOString()
    });
  }

  /**
   * Extract timeline from document text
   * @param {string} text - Document text
   * @param {string} source - Source document name
   * @returns {Object} Extracted timeline
   */
  extractTimeline(text, source = 'Document') {
    const timeline = {
      source: source,
      dates: this.extractDates(text),
      times: this.extractTimes(text),
      events: this.extractEvents(text)
    };

    // Store extracted items
    timeline.dates.forEach(d => this.dates.push({ ...d, source }));
    timeline.times.forEach(t => this.times.push({ ...t, source }));
    timeline.events.forEach(e => this.addEvent({ ...e, source }));

    return timeline;
  }

  /**
   * Extract dates from text
   * @param {string} text - Document text
   * @returns {Array} Extracted dates
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
          normalized: this.normalizeDate(match[0])
        });
      }
    });

    return dates;
  }

  /**
   * Extract times from text
   * @param {string} text - Document text
   * @returns {Array} Extracted times
   */
  extractTimes(text) {
    const times = [];
    const timePattern = /\b(\d{1,2}:\d{2}(?::\d{2})?\s*(?:am|pm|AM|PM|hours)?)\b/g;

    let match;
    while ((match = timePattern.exec(text)) !== null) {
      times.push({
        value: match[0],
        position: match.index,
        normalized: this.normalizeTime(match[0])
      });
    }

    return times;
  }

  /**
   * Extract events from text
   * @param {string} text - Document text
   * @returns {Array} Extracted events
   */
  extractEvents(text) {
    const events = [];
    const eventPatterns = [
      { pattern: /\b(stopped|arrested|detained|apprehended)\b/gi, type: 'Arrest/Detention' },
      { pattern: /\b(test(?:ed)?|breathaly[sz](?:ed)?|sample taken)\b/gi, type: 'Testing' },
      { pattern: /\b(charged|summonsed|issued|served)\b/gi, type: 'Charging' },
      { pattern: /\b(accident|collision|crash)\b/gi, type: 'Incident' },
      { pattern: /\b(observed|witnessed|saw)\b/gi, type: 'Observation' }
    ];

    eventPatterns.forEach(({ pattern, type }) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        events.push({
          type: type,
          description: match[0],
          position: match.index,
          context: text.substring(Math.max(0, match.index - 50), match.index + 50)
        });
      }
    });

    return events;
  }

  /**
   * Build chronological timeline
   * @returns {Array} Chronologically sorted events
   */
  buildChronologicalTimeline() {
    const timeline = [];

    // Combine dates, times, and events
    this.dates.forEach(date => {
      timeline.push({
        type: 'Date',
        value: date.value,
        normalized: date.normalized,
        source: date.source,
        position: date.position
      });
    });

    this.times.forEach(time => {
      timeline.push({
        type: 'Time',
        value: time.value,
        normalized: time.normalized,
        source: time.source,
        position: time.position
      });
    });

    this.events.forEach(event => {
      timeline.push({
        type: 'Event',
        eventType: event.type,
        description: event.description,
        source: event.source,
        position: event.position,
        context: event.context
      });
    });

    // Sort by position within source documents
    return timeline.sort((a, b) => {
      if (a.source !== b.source) {
        return a.source.localeCompare(b.source);
      }
      return (a.position || 0) - (b.position || 0);
    });
  }

  /**
   * Detect timeline discrepancies
   * @returns {Array} Detected discrepancies
   */
  detectDiscrepancies() {
    const discrepancies = [];

    // Group dates by source
    const datesBySource = new Map();
    this.dates.forEach(date => {
      if (!datesBySource.has(date.source)) {
        datesBySource.set(date.source, []);
      }
      datesBySource.get(date.source).push(date);
    });

    // Check for conflicting dates
    if (datesBySource.size > 1) {
      const allDates = Array.from(datesBySource.values()).flat();
      const uniqueDates = [...new Set(allDates.map(d => d.normalized))];

      if (uniqueDates.length > 1) {
        discrepancies.push({
          type: 'Date Conflict',
          severity: 'HIGH',
          description: `Multiple different dates found: ${uniqueDates.join(', ')}`,
          sources: Array.from(datesBySource.keys())
        });
      }
    }

    return discrepancies;
  }

  /**
   * Normalize date for comparison
   * @param {string} dateStr - Date string
   * @returns {string} Normalized date
   */
  normalizeDate(dateStr) {
    // Simplified normalization - in production, use proper date parsing
    return dateStr.toLowerCase().replace(/\s+/g, '-').trim();
  }

  /**
   * Normalize time for comparison
   * @param {string} timeStr - Time string
   * @returns {string} Normalized time
   */
  normalizeTime(timeStr) {
    // Simplified normalization
    return timeStr.toLowerCase().replace(/\s+/g, '').trim();
  }

  /**
   * Clear timeline
   */
  clear() {
    this.events = [];
    this.dates = [];
    this.times = [];
  }

  /**
   * Get timeline summary
   * @returns {Object} Timeline summary
   */
  getSummary() {
    return {
      totalEvents: this.events.length,
      totalDates: this.dates.length,
      totalTimes: this.times.length,
      sources: [...new Set([
        ...this.events.map(e => e.source),
        ...this.dates.map(d => d.source),
        ...this.times.map(t => t.source)
      ])]
    };
  }
}

export default TimelineManager;
