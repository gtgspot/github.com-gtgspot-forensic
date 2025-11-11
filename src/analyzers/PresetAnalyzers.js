/**
 * Preset Analyzers Module
 *
 * Contains all 8 preset analysis methods for the Forensic Legal Analyzer.
 * Each preset performs specialized analysis on legal documents.
 *
 * @version 1.0.0
 * @jurisdiction Victoria, Australia
 */

import { VictorianStatuteAnalyzer } from './VictorianStatuteAnalyzer.js';

// Initialize the statute analyzer
const statuteAnalyzer = new VictorianStatuteAnalyzer();
let analyzerInitialized = false;

/**
 * Initialize the statute analyzer (call once on app load)
 */
export async function initializePresetAnalyzers() {
  if (!analyzerInitialized) {
    await statuteAnalyzer.init();
    analyzerInitialized = true;
  }
}

/**
 * Base class for document analysis
 */
class DocumentAnalyzer {
  constructor(text) {
    this.text = text;
    this.words = text.split(/\s+/);
    this.lines = text.split('\n');
  }

  getLocation(index) {
    const beforeText = this.text.substring(0, index);
    const lineNumber = beforeText.split('\n').length;
    const lines = beforeText.split('\n');
    const charInLine = lines[lines.length - 1].length;
    return `Line ${lineNumber}, Character ${charInLine}`;
  }

  getContext(index, chars) {
    const start = Math.max(0, index - chars);
    const end = Math.min(this.text.length, index + chars);
    const context = this.text.substring(start, end);
    return '...' + context.trim() + '...';
  }

  getLineNumber(index) {
    const beforeText = this.text.substring(0, index);
    return beforeText.split('\n').length;
  }
}

/**
 * Preset 1: Statutory Procedural Analysis
 * Analyzes statutory references, mandatory language, and procedural requirements
 */
export const Preset1_StatutoryProcedural = {
  name: 'Statutory Procedural Analysis',
  description: 'Identifies statutory references, mandatory language, dates, times, and procedural requirements',

  async analyze(documentText) {
    const analyzer = new DocumentAnalyzer(documentText);
    const findings = [];
    const statutoryRefs = new Set();
    const mandatoryLanguage = [];
    const keyTerms = new Set();

    // Extract all statutory references using the statute analyzer
    const references = statuteAnalyzer.extractReferences(documentText);
    references.forEach(ref => {
      statutoryRefs.add(ref);
      findings.push({
        type: 'Statutory Reference',
        severity: 'MEDIUM',
        description: `Found statutory reference: ${ref}`,
        location: 'Multiple locations',
        context: ref
      });
    });

    // Identify governing acts
    const governingActs = statuteAnalyzer.identifyGoverningActs(references);
    governingActs.forEach(act => {
      findings.push({
        type: 'Governing Legislation',
        severity: 'HIGH',
        description: `Identified governing Act: ${act.fullName}`,
        location: 'Document',
        context: `Category: ${act.category}, Matching sections: ${act.matchingSections.join(', ')}`
      });
    });

    // Find mandatory procedural language
    const mandatoryPatterns = [
      /\b(must|shall|required to|mandatory|obliged to|duty to)\b/gi
    ];

    mandatoryPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(documentText)) !== null) {
        const term = match[0];
        keyTerms.add(term.toLowerCase());
        mandatoryLanguage.push({
          term: term,
          location: analyzer.getLocation(match.index),
          context: analyzer.getContext(match.index, 50)
        });
      }
    });

    if (mandatoryLanguage.length > 0) {
      findings.push({
        type: 'Mandatory Procedural Language',
        severity: 'HIGH',
        description: `Found ${mandatoryLanguage.length} instances of mandatory procedural language`,
        location: mandatoryLanguage[0].location,
        context: mandatoryLanguage[0].context
      });
    }

    // Find dates and times
    const datePattern = /\b(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/gi;
    const timePattern = /\b(\d{1,2}:\d{2}(?::\d{2})?\s*(?:am|pm|AM|PM)?)/g;

    let match;
    while ((match = datePattern.exec(documentText)) !== null) {
      keyTerms.add('date');
      findings.push({
        type: 'Temporal Reference - Date',
        severity: 'MEDIUM',
        description: `Date found: ${match[0]}`,
        location: analyzer.getLocation(match.index),
        context: analyzer.getContext(match.index, 50)
      });
    }

    while ((match = timePattern.exec(documentText)) !== null) {
      keyTerms.add('time');
      findings.push({
        type: 'Temporal Reference - Time',
        severity: 'MEDIUM',
        description: `Time found: ${match[0]}`,
        location: analyzer.getLocation(match.index),
        context: analyzer.getContext(match.index, 50)
      });
    }

    // Check for jurisdictional references
    const jurisdictionCheck = /\b(Victoria|Victorian|Magistrates'?\s*Court|County\s*Court|Supreme\s*Court)/gi;
    if (!jurisdictionCheck.test(documentText)) {
      findings.push({
        type: 'Missing Jurisdictional Reference',
        severity: 'HIGH',
        description: 'No clear jurisdictional reference found in document',
        location: 'N/A',
        context: 'Document should specify Victorian jurisdiction'
      });
    }

    return {
      presetName: this.name,
      wordCount: analyzer.words.filter(w => w.length > 0).length,
      lineCount: analyzer.lines.length,
      keyTerms: Array.from(keyTerms),
      statutoryReferences: Array.from(statutoryRefs),
      governingActs: governingActs,
      findings: findings
    };
  }
};

/**
 * Preset 2: Contextual Analysis
 * Analyzes temporal markers, conditional statements, authority references, and sequences
 */
export const Preset2_Contextual = {
  name: 'Contextual Analysis',
  description: 'Identifies temporal markers, conditional statements, authority references, and event sequences',

  analyze(documentText) {
    const analyzer = new DocumentAnalyzer(documentText);
    const findings = [];
    const keyTerms = new Set();

    // Temporal markers
    const temporalPatterns = [
      { pattern: /\b(before|prior to|preceding)\b/gi, type: 'Temporal Marker - Before' },
      { pattern: /\b(after|following|subsequent to)\b/gi, type: 'Temporal Marker - After' },
      { pattern: /\b(during|whilst|while|throughout)\b/gi, type: 'Temporal Marker - During' },
      { pattern: /\b(at the time|at that time|at this time)\b/gi, type: 'Temporal Marker - At Time' }
    ];

    temporalPatterns.forEach(({pattern, type}) => {
      let match;
      while ((match = pattern.exec(documentText)) !== null) {
        keyTerms.add(match[0].toLowerCase());
        findings.push({
          type: type,
          severity: 'MEDIUM',
          description: `Temporal marker found: "${match[0]}"`,
          location: analyzer.getLocation(match.index),
          context: analyzer.getContext(match.index, 50)
        });
      }
    });

    // Conditional statements
    const conditionalPatterns = [
      { pattern: /\b(if|where|when)\b/gi, type: 'Conditional - If/Where/When' },
      { pattern: /\b(unless|except|save)\b/gi, type: 'Conditional - Exception' },
      { pattern: /\b(provided that|on condition that)\b/gi, type: 'Conditional - Provision' }
    ];

    conditionalPatterns.forEach(({pattern, type}) => {
      let match;
      while ((match = pattern.exec(documentText)) !== null) {
        keyTerms.add(match[0].toLowerCase());
        findings.push({
          type: type,
          severity: 'MEDIUM',
          description: `Conditional statement: "${match[0]}"`,
          location: analyzer.getLocation(match.index),
          context: analyzer.getContext(match.index, 50)
        });
      }
    });

    // Authority references
    const authorityPattern = /\b(officer|constable|police|informant|member|sergeant|detective|inspector)\b/gi;
    let match;
    while ((match = authorityPattern.exec(documentText)) !== null) {
      keyTerms.add(match[0].toLowerCase());
      findings.push({
        type: 'Authority Reference',
        severity: 'MEDIUM',
        description: `Authority figure mentioned: "${match[0]}"`,
        location: analyzer.getLocation(match.index),
        context: analyzer.getContext(match.index, 50)
      });
    }

    // Sequence markers
    const sequencePattern = /\b(first|firstly|second|secondly|third|thirdly|then|next|finally|subsequently)\b/gi;
    while ((match = sequencePattern.exec(documentText)) !== null) {
      keyTerms.add('sequence-marker');
      findings.push({
        type: 'Sequence Marker',
        severity: 'LOW',
        description: `Event sequence indicator: "${match[0]}"`,
        location: analyzer.getLocation(match.index),
        context: analyzer.getContext(match.index, 50)
      });
    }

    return {
      presetName: this.name,
      wordCount: analyzer.words.filter(w => w.length > 0).length,
      lineCount: analyzer.lines.length,
      keyTerms: Array.from(keyTerms),
      findings: findings
    };
  }
};

/**
 * Preset 3: Jurisprudential Analysis
 * Analyzes common law references, legal principles, case citations, and Latin maxims
 */
export const Preset3_Jurisprudential = {
  name: 'Jurisprudential Analysis',
  description: 'Identifies common law concepts, legal principles, case citations, and Latin legal terms',

  analyze(documentText) {
    const analyzer = new DocumentAnalyzer(documentText);
    const findings = [];
    const keyTerms = new Set();
    const statutoryRefs = new Set();

    // Common law references
    const commonLawPattern = /\b(common law|precedent|stare decisis|ratio decidendi|obiter dicta)\b/gi;
    let match;
    while ((match = commonLawPattern.exec(documentText)) !== null) {
      keyTerms.add(match[0].toLowerCase());
      findings.push({
        type: 'Common Law Reference',
        severity: 'MEDIUM',
        description: `Common law concept: "${match[0]}"`,
        location: analyzer.getLocation(match.index),
        context: analyzer.getContext(match.index, 50)
      });
    }

    // Legal principles
    const principlePatterns = [
      /\b(natural justice|procedural fairness|reasonable doubt|burden of proof)\b/gi,
      /\b(presumption of innocence|right to silence|fair hearing)\b/gi
    ];

    principlePatterns.forEach(pattern => {
      while ((match = pattern.exec(documentText)) !== null) {
        keyTerms.add(match[0].toLowerCase());
        findings.push({
          type: 'Legal Principle',
          severity: 'HIGH',
          description: `Legal principle identified: "${match[0]}"`,
          location: analyzer.getLocation(match.index),
          context: analyzer.getContext(match.index, 50)
        });
      }
    });

    // Case citations
    const caseCitationPattern = /\b([A-Z][a-z]+\s+v\.?\s+[A-Z][a-z]+(?:\s+\[\d{4}\])?)/g;
    while ((match = caseCitationPattern.exec(documentText)) !== null) {
      keyTerms.add('case-citation');
      statutoryRefs.add(match[0]);
      findings.push({
        type: 'Case Citation',
        severity: 'MEDIUM',
        description: `Case law reference: ${match[0]}`,
        location: analyzer.getLocation(match.index),
        context: analyzer.getContext(match.index, 50)
      });
    }

    // Latin maxims
    const latinMaxims = [
      'actus reus', 'mens rea', 'ultra vires', 'bona fide', 'prima facie',
      'res judicata', 'habeas corpus', 'certiorari', 'mandamus', 'de facto',
      'de jure', 'inter alia', 'ex parte', 'in camera', 'subpoena duces tecum'
    ];

    latinMaxims.forEach(maxim => {
      const pattern = new RegExp('\\b' + maxim + '\\b', 'gi');
      while ((match = pattern.exec(documentText)) !== null) {
        keyTerms.add(maxim);
        findings.push({
          type: 'Latin Maxim',
          severity: 'LOW',
          description: `Latin legal term: "${match[0]}"`,
          location: analyzer.getLocation(match.index),
          context: analyzer.getContext(match.index, 50)
        });
      }
    });

    return {
      presetName: this.name,
      wordCount: analyzer.words.filter(w => w.length > 0).length,
      lineCount: analyzer.lines.length,
      keyTerms: Array.from(keyTerms),
      statutoryReferences: Array.from(statutoryRefs),
      findings: findings
    };
  }
};

/**
 * Preset 4: Objective Textual Analysis
 * Analyzes ambiguous terms, undefined technical terms, complex sentences, and double negatives
 */
export const Preset4_ObjectiveTextual = {
  name: 'Objective Textual Analysis',
  description: 'Identifies ambiguous terms, undefined technical terms, complex sentences, and linguistic issues',

  analyze(documentText) {
    const analyzer = new DocumentAnalyzer(documentText);
    const findings = [];
    const keyTerms = new Set();

    // Ambiguous terms
    const ambiguousTerms = [
      'reasonable', 'appropriate', 'adequate', 'sufficient', 'proper',
      'may', 'might', 'could', 'approximately', 'about', 'around'
    ];

    ambiguousTerms.forEach(term => {
      const pattern = new RegExp('\\b' + term + '\\b', 'gi');
      let match;
      while ((match = pattern.exec(documentText)) !== null) {
        keyTerms.add(term);
        findings.push({
          type: 'Ambiguous Term',
          severity: 'MEDIUM',
          description: `Ambiguous/subjective term found: "${match[0]}" - requires objective definition`,
          location: analyzer.getLocation(match.index),
          context: analyzer.getContext(match.index, 50)
        });
      }
    });

    // Undefined technical terms
    const technicalTerms = [
      'preliminary test', 'oral fluid', 'prescribed concentration',
      'motor vehicle', 'public place', 'traffic offence'
    ];

    technicalTerms.forEach(term => {
      const pattern = new RegExp('\\b' + term + '\\b', 'gi');
      let match;
      if ((match = pattern.exec(documentText)) !== null) {
        keyTerms.add(term);

        // Check if term is defined in the document
        const definitionPattern = new RegExp(term + '\\s+means|' + term + '\\s+is defined', 'i');
        if (!definitionPattern.test(documentText)) {
          findings.push({
            type: 'Undefined Technical Term',
            severity: 'HIGH',
            description: `Technical term "${term}" used but not defined in document`,
            location: analyzer.getLocation(match.index),
            context: analyzer.getContext(match.index, 50)
          });
        }
      }
    });

    // Complex sentence structures
    const sentences = documentText.split(/[.!?]+/);
    sentences.forEach((sentence, idx) => {
      const wordCount = sentence.split(/\s+/).length;
      if (wordCount > 40) {
        keyTerms.add('complex-sentence');
        findings.push({
          type: 'Complex Sentence Structure',
          severity: 'LOW',
          description: `Sentence ${idx + 1} contains ${wordCount} words - may affect clarity`,
          location: `Sentence ${idx + 1}`,
          context: sentence.substring(0, 100) + '...'
        });
      }
    });

    // Double negatives
    const doubleNegPattern = /\b(not\s+un|not\s+in|no\s+lack|without\s+fail)/gi;
    let match;
    while ((match = doubleNegPattern.exec(documentText)) !== null) {
      keyTerms.add('double-negative');
      findings.push({
        type: 'Double Negative',
        severity: 'MEDIUM',
        description: `Potential double negative found: "${match[0]}" - affects plain meaning`,
        location: analyzer.getLocation(match.index),
        context: analyzer.getContext(match.index, 50)
      });
    }

    return {
      presetName: this.name,
      wordCount: analyzer.words.filter(w => w.length > 0).length,
      lineCount: analyzer.lines.length,
      keyTerms: Array.from(keyTerms),
      findings: findings
    };
  }
};

/**
 * Preset 5: Subjective Intent Analysis
 * Analyzes stated beliefs, intentions, qualifiers, and subjective vs objective balance
 */
export const Preset5_SubjectiveIntent = {
  name: 'Subjective Intent Analysis',
  description: 'Identifies subjective beliefs, intentions, qualifying language, and objective vs subjective balance',

  analyze(documentText) {
    const analyzer = new DocumentAnalyzer(documentText);
    const findings = [];
    const keyTerms = new Set();

    // Stated intentions and beliefs
    const intentionPatterns = [
      { pattern: /\b(believed|believe|believing)\b/gi, type: 'Belief' },
      { pattern: /\b(suspected|suspect|suspecting)\b/gi, type: 'Suspicion' },
      { pattern: /\b(formed\s+(?:the\s+)?opinion|opinion|view)\b/gi, type: 'Opinion' },
      { pattern: /\b(thought|think|thinking)\b/gi, type: 'Thought' },
      { pattern: /\b(intended|intend|intending|intention)\b/gi, type: 'Intent' }
    ];

    intentionPatterns.forEach(({pattern, type}) => {
      let match;
      while ((match = pattern.exec(documentText)) !== null) {
        keyTerms.add(type.toLowerCase());
        findings.push({
          type: `Subjective ${type}`,
          severity: 'HIGH',
          description: `Subjective ${type.toLowerCase()} expressed: "${match[0]}" - requires objective basis`,
          location: analyzer.getLocation(match.index),
          context: analyzer.getContext(match.index, 50)
        });
      }
    });

    // Qualifiers (hedging language)
    const qualifierPatterns = [
      /\b(may have|might have|could have|possibly|perhaps|apparently)\b/gi,
      /\b(appeared to|seemed to|looked like)\b/gi,
      /\b(allegedly|purportedly|reportedly)\b/gi
    ];

    qualifierPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(documentText)) !== null) {
        keyTerms.add('qualifier');
        findings.push({
          type: 'Qualifier/Hedge',
          severity: 'MEDIUM',
          description: `Qualifying language: "${match[0]}" - indicates uncertainty`,
          location: analyzer.getLocation(match.index),
          context: analyzer.getContext(match.index, 50)
        });
      }
    });

    // Objective vs Subjective markers
    const objectivePattern = /\b(observed|witnessed|measured|recorded|documented|photographed)\b/gi;
    let objectiveCount = 0;
    let match;
    while ((match = objectivePattern.exec(documentText)) !== null) {
      objectiveCount++;
      keyTerms.add('objective-fact');
    }

    const subjectiveCount = findings.filter(f => f.type.includes('Subjective')).length;

    if (subjectiveCount > objectiveCount * 2) {
      findings.push({
        type: 'Subjective vs Objective Balance',
        severity: 'HIGH',
        description: `Document heavily weighted toward subjective statements (${subjectiveCount}) vs objective facts (${objectiveCount})`,
        location: 'Overall Document',
        context: 'Consider supporting subjective statements with objective evidence'
      });
    }

    return {
      presetName: this.name,
      wordCount: analyzer.words.filter(w => w.length > 0).length,
      lineCount: analyzer.lines.length,
      keyTerms: Array.from(keyTerms),
      findings: findings
    };
  }
};

/**
 * Preset 6: Purposive Analysis
 * Analyzes purpose statements, policy objectives, mischief addressed, and legislative intent
 */
export const Preset6_Purposive = {
  name: 'Purposive Analysis',
  description: 'Identifies purpose statements, policy objectives, mischief addressed, and legislative intent',

  analyze(documentText) {
    const analyzer = new DocumentAnalyzer(documentText);
    const findings = [];
    const keyTerms = new Set();

    // Purpose statements
    const purposePatterns = [
      { pattern: /\b(purpose of|object of|objective|aim|intent)\b/gi, type: 'Purpose Statement' },
      { pattern: /\b(in order to|so as to|for the purpose of)\b/gi, type: 'Purpose Clause' },
      { pattern: /\b(policy|public interest|community safety)\b/gi, type: 'Policy Objective' }
    ];

    purposePatterns.forEach(({pattern, type}) => {
      let match;
      while ((match = pattern.exec(documentText)) !== null) {
        keyTerms.add(type.toLowerCase());
        findings.push({
          type: type,
          severity: 'MEDIUM',
          description: `${type} identified: "${match[0]}"`,
          location: analyzer.getLocation(match.index),
          context: analyzer.getContext(match.index, 50)
        });
      }
    });

    // Mischief being addressed
    const mischiefPatterns = [
      /\b(prevent|prevention|deter|deterrence|protect|protection)\b/gi,
      /\b(ensure|ensuring|safeguard|safeguarding)\b/gi,
      /\b(risk|danger|harm|threat)\b/gi
    ];

    mischiefPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(documentText)) !== null) {
        keyTerms.add('mischief-addressed');
        findings.push({
          type: 'Mischief/Risk Addressed',
          severity: 'MEDIUM',
          description: `Risk/mischief language: "${match[0]}"`,
          location: analyzer.getLocation(match.index),
          context: analyzer.getContext(match.index, 50)
        });
      }
    });

    // Legislative intent indicators
    const intentPattern = /\b(legislature\s+intended|parliament\s+intended|legislative\s+intent)\b/gi;
    let match;
    while ((match = intentPattern.exec(documentText)) !== null) {
      keyTerms.add('legislative-intent');
      findings.push({
        type: 'Legislative Intent',
        severity: 'HIGH',
        description: `Legislative intent reference: "${match[0]}"`,
        location: analyzer.getLocation(match.index),
        context: analyzer.getContext(match.index, 50)
      });
    }

    return {
      presetName: this.name,
      wordCount: analyzer.words.filter(w => w.length > 0).length,
      lineCount: analyzer.lines.length,
      keyTerms: Array.from(keyTerms),
      findings: findings
    };
  }
};

/**
 * Preset 7: Comparative Cross-Reference
 * Performs cross-document comparison (requires multiple documents)
 */
export const Preset7_Comparative = {
  name: 'Comparative Cross-Reference',
  description: 'Compares facts, dates, times, and statements across multiple documents',

  analyze(documentText, allDocuments = []) {
    const analyzer = new DocumentAnalyzer(documentText);

    if (allDocuments.length <= 1) {
      return {
        presetName: this.name,
        wordCount: analyzer.words.filter(w => w.length > 0).length,
        lineCount: analyzer.lines.length,
        keyTerms: [],
        findings: [{
          type: 'Comparison Note',
          severity: 'LOW',
          description: 'Comparative analysis requires multiple documents. Upload additional documents for cross-reference analysis.',
          location: 'N/A',
          context: 'This preset will compare facts, dates, times, and statements across documents when multiple files are uploaded.'
        }]
      };
    }

    // TODO: Implement multi-document comparison logic
    return {
      presetName: this.name,
      wordCount: analyzer.words.filter(w => w.length > 0).length,
      lineCount: analyzer.lines.length,
      keyTerms: [],
      findings: []
    };
  }
};

/**
 * Preset 8: Evidentiary Standards (Victorian)
 * Analyzes compliance with Victorian evidentiary legislation
 */
export const Preset8_Evidentiary = {
  name: 'Evidentiary Standards (Victorian)',
  description: 'Checks compliance with Road Safety Act, Evidence Act, and Criminal Procedure Act requirements',

  async analyze(documentText) {
    const analyzer = new DocumentAnalyzer(documentText);
    const findings = [];
    const keyTerms = new Set();
    const statutoryRefs = new Set();

    // Section 49 preliminary test requirements
    const s49Requirements = [
      { term: 'driver', section: 's.49(1)(a)' },
      { term: 'in charge', section: 's.49(1)(b)' },
      { term: 'recently driving', section: 's.49(1)(c)' },
      { term: 'attempting to put in motion', section: 's.49(1)(d)' },
      { term: 'traffic offence', section: 's.49(1)(e)' },
      { term: 'accident', section: 's.49(1)(f)' },
      { term: 'reasonable belief.*alcohol', section: 's.49(1)(g)' }
    ];

    s49Requirements.forEach(({term, section}) => {
      const pattern = new RegExp(term, 'gi');
      let match;
      if ((match = pattern.exec(documentText)) !== null) {
        keyTerms.add(term);
        statutoryRefs.add(section);
        findings.push({
          type: `Road Safety Act ${section} Compliance Check`,
          severity: 'HIGH',
          description: `Potential ${section} trigger found: "${match[0]}"`,
          location: analyzer.getLocation(match.index),
          context: analyzer.getContext(match.index, 50)
        });
      }
    });

    // Check reasonable belief test if s.49(1)(g) applies
    if (/reasonable\s+belief/gi.test(documentText)) {
      const beliefTest = statuteAnalyzer.analyzeReasonableBeliefTest(documentText);

      if (!beliefTest.compliant) {
        beliefTest.issues.forEach(issue => {
          findings.push({
            type: issue.type,
            severity: issue.severity.toUpperCase(),
            description: issue.description,
            location: 'Document',
            context: issue.consequence
          });
        });
      }
    }

    // Section 55D authority and conditions
    const s55DPattern = /\b(authority|authorized|authorised|proper authority)\b/gi;
    let match;
    while ((match = s55DPattern.exec(documentText)) !== null) {
      keyTerms.add('authority');
      statutoryRefs.add('s.55D');
      findings.push({
        type: 'Road Safety Act s.55D - Authority Check',
        severity: 'HIGH',
        description: `Authority reference found - verify s.55D compliance: "${match[0]}"`,
        location: analyzer.getLocation(match.index),
        context: analyzer.getContext(match.index, 50)
      });
    }

    // Section 55E proper performance
    const s55EPattern = /\b(proper|properly|performance|performed|calibrat|maintain)\b/gi;
    while ((match = s55EPattern.exec(documentText)) !== null) {
      keyTerms.add('proper-performance');
      statutoryRefs.add('s.55E');
      findings.push({
        type: 'Road Safety Act s.55E - Proper Performance',
        severity: 'HIGH',
        description: `Performance/maintenance reference - s.55E compliance: "${match[0]}"`,
        location: analyzer.getLocation(match.index),
        context: analyzer.getContext(match.index, 50)
      });
    }

    // Evidence Act s.137 - Prejudicial evidence
    const prejudicePattern = /\b(prejudic|unfair|probative value)\b/gi;
    while ((match = prejudicePattern.exec(documentText)) !== null) {
      keyTerms.add('prejudice');
      statutoryRefs.add('Evidence Act s.137');
      findings.push({
        type: 'Evidence Act s.137 - Prejudicial Evidence',
        severity: 'HIGH',
        description: `Potential s.137 discretion trigger: "${match[0]}"`,
        location: analyzer.getLocation(match.index),
        context: analyzer.getContext(match.index, 50)
      });
    }

    // Evidence Act s.138 - Improperly obtained evidence
    const improperPattern = /\b(improperly|illegally|unlawfully obtained|breach|violation)\b/gi;
    while ((match = improperPattern.exec(documentText)) !== null) {
      keyTerms.add('improper-evidence');
      statutoryRefs.add('Evidence Act s.138');
      findings.push({
        type: 'Evidence Act s.138 - Improperly Obtained Evidence',
        severity: 'HIGH',
        description: `Potential s.138 discretion trigger: "${match[0]}"`,
        location: analyzer.getLocation(match.index),
        context: analyzer.getContext(match.index, 50)
      });
    }

    // Hearsay issues (Chapter 3)
    const hearsayPattern = /\b(hearsay|told|said|stated|reported|informed|represented)\b/gi;
    while ((match = hearsayPattern.exec(documentText)) !== null) {
      keyTerms.add('hearsay');
      statutoryRefs.add('Evidence Act Chapter 3');
      findings.push({
        type: 'Evidence Act Chapter 3 - Hearsay Issue',
        severity: 'MEDIUM',
        description: `Potential hearsay: "${match[0]}" - check exceptions`,
        location: analyzer.getLocation(match.index),
        context: analyzer.getContext(match.index, 50)
      });
    }

    // Business records exception (s.69)
    const businessRecordsPattern = /\b(business record|document|register|log|database)\b/gi;
    while ((match = businessRecordsPattern.exec(documentText)) !== null) {
      keyTerms.add('business-records');
      statutoryRefs.add('Evidence Act s.69');
      findings.push({
        type: 'Evidence Act s.69 - Business Records',
        severity: 'MEDIUM',
        description: `Potential business records exception: "${match[0]}"`,
        location: analyzer.getLocation(match.index),
        context: analyzer.getContext(match.index, 50)
      });
    }

    // Disclosure requirements
    const disclosurePattern = /\b(disclos|provide|furnish|supply).*\b(evidence|material|document)\b/gi;
    while ((match = disclosurePattern.exec(documentText)) !== null) {
      keyTerms.add('disclosure');
      statutoryRefs.add('Criminal Procedure Act Part 3.3');
      findings.push({
        type: 'Criminal Procedure Act Part 3.3 - Disclosure',
        severity: 'HIGH',
        description: `Disclosure obligation reference: "${match[0]}"`,
        location: analyzer.getLocation(match.index),
        context: analyzer.getContext(match.index, 50)
      });
    }

    return {
      presetName: this.name,
      wordCount: analyzer.words.filter(w => w.length > 0).length,
      lineCount: analyzer.lines.length,
      keyTerms: Array.from(keyTerms),
      statutoryReferences: Array.from(statutoryRefs),
      findings: findings
    };
  }
};

/**
 * Get all available presets
 */
export function getAllPresets() {
  return [
    { id: 1, ...Preset1_StatutoryProcedural },
    { id: 2, ...Preset2_Contextual },
    { id: 3, ...Preset3_Jurisprudential },
    { id: 4, ...Preset4_ObjectiveTextual },
    { id: 5, ...Preset5_SubjectiveIntent },
    { id: 6, ...Preset6_Purposive },
    { id: 7, ...Preset7_Comparative },
    { id: 8, ...Preset8_Evidentiary }
  ];
}

/**
 * Run analysis with selected presets
 */
export async function runAnalysis(documentText, selectedPresetIds = [1, 2, 3, 4, 5, 6, 7, 8], allDocuments = []) {
  // Ensure analyzer is initialized
  if (!analyzerInitialized) {
    await initializePresetAnalyzers();
  }

  const presets = getAllPresets();
  const results = [];

  for (const presetId of selectedPresetIds) {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      try {
        const result = await preset.analyze(documentText, allDocuments);
        results.push({
          presetId: presetId,
          presetName: preset.name,
          ...result
        });
      } catch (error) {
        results.push({
          presetId: presetId,
          presetName: preset.name,
          error: error.message
        });
      }
    }
  }

  return results;
}

export default {
  initializePresetAnalyzers,
  getAllPresets,
  runAnalysis,
  Preset1_StatutoryProcedural,
  Preset2_Contextual,
  Preset3_Jurisprudential,
  Preset4_ObjectiveTextual,
  Preset5_SubjectiveIntent,
  Preset6_Purposive,
  Preset7_Comparative,
  Preset8_Evidentiary
};
