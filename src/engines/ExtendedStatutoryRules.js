/**
 * Extended Statutory Rules Library
 *
 * Additional machine-executable rule definitions for Victorian statutes.
 * Extends the base StatutoryRules with more comprehensive coverage.
 *
 * @version 1.0.0
 * @jurisdiction Victoria, Australia
 * @module ExtendedStatutoryRules
 */

/**
 * Criminal Procedure Act 2009 - Additional Rules
 */
export const CriminalProcedureActRules = [
  /**
   * CPA s.464 - Caution and Rights
   */
  {
    ruleId: "CPA_s464_caution_rights",
    statute: "Criminal Procedure Act 2009",
    section: "464",
    type: "MANDATORY_PROCEDURAL",
    description: "Person must be cautioned and informed of rights before interview",

    condition: {
      operator: "AND",
      requirements: [
        {
          element: "caution_administered",
          keywords: [
            "cautioned",
            "administered caution",
            "gave caution",
            "you are not obliged to say anything",
            "right to remain silent"
          ],
          required: true,
          type: "CAUTION"
        },
        {
          element: "rights_explained",
          keywords: [
            "informed of rights",
            "explained rights",
            "right to contact lawyer",
            "right to legal advice",
            "right to telephone call"
          ],
          required: true,
          type: "RIGHTS_NOTIFICATION"
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "COMPLIANT",
        message: "Proper caution and rights notification given per s.464"
      },
      onFailure: {
        result: "NON_COMPLIANT",
        severity: "CRITICAL",
        consequence: "Interview may be inadmissible - failure to comply with s.464",
        remedy: "Apply to exclude interview evidence under s.90 Evidence Act",
        legalPrinciple: "Statutory rights must be communicated before interview"
      }
    }
  },

  /**
   * CPA s.360 - Disclosure Obligations
   */
  {
    ruleId: "CPA_s360_disclosure",
    statute: "Criminal Procedure Act 2009",
    section: "360",
    type: "MANDATORY_PROCEDURAL",
    description: "Prosecution must disclose material to defense",

    condition: {
      operator: "OR",
      requirements: [
        {
          element: "disclosure_made",
          keywords: [
            "disclosed to defense",
            "disclosed to defence",
            "provided to defense",
            "provided to defence",
            "disclosure statement",
            "hand-up brief"
          ],
          required: false,
          type: "DISCLOSURE"
        },
        {
          element: "disclosure_timeline",
          keywords: [
            "within 42 days",
            "within time",
            "timely disclosure",
            "disclosed on time"
          ],
          required: false,
          type: "TIMING"
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "COMPLIANT",
        message: "Disclosure obligations satisfied per s.360"
      },
      onFailure: {
        result: "NON_COMPLIANT",
        severity: "HIGH",
        consequence: "Prosecution may not have complied with disclosure obligations",
        remedy: "Apply for adjournment or stay of proceedings",
        legalPrinciple: "Fair trial requires timely and complete disclosure"
      }
    }
  }
];

/**
 * Bail Act 1977 - Rules
 */
export const BailActRules = [
  /**
   * Bail Act s.4 - Presumption in favor of bail
   */
  {
    ruleId: "BAIL_s4_presumption",
    statute: "Bail Act 1977",
    section: "4",
    type: "INTERPRETIVE",
    description: "Accused entitled to bail unless show cause applies",

    condition: {
      operator: "NOT",
      requirements: [
        {
          element: "show_cause_offenses",
          operator: "OR",
          options: [
            "show cause offense",
            "Schedule 2 offense",
            "indictable offense whilst on bail",
            "serious offense whilst on parole"
          ],
          required: false,
          type: "SHOW_CAUSE_TRIGGER"
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "COMPLIANT",
        message: "Presumption in favor of bail applies - no show cause required"
      },
      onFailure: {
        result: "NON_COMPLIANT",
        severity: "MEDIUM",
        message: "Show cause requirement may apply - accused must show why bail not refused",
        legalPrinciple: "Liberty favored unless specific circumstances engaged"
      }
    }
  },

  /**
   * Bail Act s.5 - Unacceptable risk test
   */
  {
    ruleId: "BAIL_s5_unacceptable_risk",
    statute: "Bail Act 1977",
    section: "5",
    type: "DISCRETIONARY_ASSESSMENT",
    description: "Court must assess unacceptable risk factors",

    condition: {
      operator: "OR",
      requirements: [
        {
          element: "risk_factors",
          operator: "OR",
          options: [
            "fail to appear",
            "commit further offense",
            "endanger safety",
            "interfere with witnesses",
            "obstruct justice"
          ],
          required: false,
          type: "RISK_ASSESSMENT"
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "NON_COMPLIANT",
        message: "Unacceptable risk factors identified - bail may be refused",
        severity: "HIGH"
      },
      onFailure: {
        result: "COMPLIANT",
        message: "No unacceptable risk factors identified - bail appropriate"
      }
    }
  }
];

/**
 * Sentencing Act 1991 - Rules
 */
export const SentencingActRules = [
  /**
   * Sentencing Act s.5 - Purposes of sentencing
   */
  {
    ruleId: "SENT_s5_purposes",
    statute: "Sentencing Act 1991",
    section: "5",
    type: "INTERPRETIVE",
    description: "Court must consider statutory purposes of sentencing",

    condition: {
      operator: "OR",
      requirements: [
        {
          element: "sentencing_purposes",
          operator: "OR",
          options: [
            "just punishment",
            "deterrence",
            "rehabilitation",
            "denunciation",
            "protection of community"
          ],
          required: false,
          type: "PURPOSE"
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "COMPLIANT",
        message: "Sentencing purposes articulated per s.5"
      },
      onFailure: {
        result: "NON_COMPLIANT",
        severity: "MEDIUM",
        consequence: "Sentencing reasons may not adequately address statutory purposes",
        remedy: "Ground for appeal - inadequate reasons",
        legalPrinciple: "Sentencing must be principled and purposive"
      }
    }
  },

  /**
   * Sentencing Act s.6AAA - Community impact statement
   */
  {
    ruleId: "SENT_s6AAA_victim_impact",
    statute: "Sentencing Act 1991",
    section: "6AAA",
    type: "DISCRETIONARY_CONSIDERATION",
    description: "Court may consider victim impact statement",

    condition: {
      element: "victim_impact_statement",
      keywords: [
        "victim impact statement",
        "community impact statement",
        "impact on victim",
        "harm to victim"
      ],
      required: false,
      type: "VICTIM_IMPACT"
    },

    evaluation: {
      onSuccess: {
        result: "COMPLIANT",
        message: "Victim impact statement considered per s.6AAA"
      },
      onFailure: {
        result: "COMPLIANT",
        message: "No victim impact statement - not mandatory"
      }
    }
  }
];

/**
 * Evidence Act 2008 - Additional Rules
 */
export const EvidenceActAdditionalRules = [
  /**
   * Evidence Act s.137 - Prejudicial evidence
   */
  {
    ruleId: "EVIDENCE_s137_prejudice",
    statute: "Evidence Act 2008",
    section: "137",
    type: "DISCRETIONARY_EXCLUSION",
    description: "Court must exclude if probative value outweighed by unfair prejudice",

    condition: {
      operator: "OR",
      requirements: [
        {
          element: "prejudicial_effect",
          keywords: [
            "unfair prejudice",
            "prejudicial effect",
            "prejudices the defendant",
            "unfairly prejudicial"
          ],
          required: false,
          type: "PREJUDICE"
        },
        {
          element: "probative_value",
          keywords: [
            "probative value",
            "limited probative value",
            "minimal probative value"
          ],
          required: false,
          type: "PROBATIVE_VALUE"
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "NON_COMPLIANT",
        message: "Evidence may be unfairly prejudicial - s.137 discretion engaged",
        severity: "HIGH"
      },
      onFailure: {
        result: "COMPLIANT",
        message: "No issue with prejudicial effect identified"
      }
    }
  },

  /**
   * Evidence Act s.90 - Reliability of admissions
   */
  {
    ruleId: "EVIDENCE_s90_reliability",
    statute: "Evidence Act 2008",
    section: "90",
    type: "DISCRETIONARY_EXCLUSION",
    description: "Court may exclude unreliable admissions",

    condition: {
      operator: "OR",
      requirements: [
        {
          element: "reliability_concerns",
          keywords: [
            "unreliable",
            "questionable circumstances",
            "inducement",
            "oppressive questioning",
            "mental impairment",
            "intoxication",
            "duress"
          ],
          required: false,
          type: "RELIABILITY"
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "NON_COMPLIANT",
        message: "Admission may be unreliable - s.90 discretion engaged",
        severity: "CRITICAL"
      },
      onFailure: {
        result: "COMPLIANT",
        message: "No reliability concerns identified"
      }
    }
  },

  /**
   * Evidence Act s.65 - Hearsay rule
   */
  {
    ruleId: "EVIDENCE_s65_hearsay",
    statute: "Evidence Act 2008",
    section: "65",
    type: "MANDATORY_EXCLUSION",
    description: "Hearsay evidence inadmissible unless exception applies",

    condition: {
      operator: "AND",
      requirements: [
        {
          element: "hearsay_evidence",
          keywords: [
            "told me",
            "said to me",
            "stated to me",
            "informed me",
            "reported that",
            "according to"
          ],
          required: true,
          type: "HEARSAY_INDICATOR"
        },
        {
          operator: "NOT",
          requirements: [
            {
              element: "hearsay_exception",
              operator: "OR",
              options: [
                "business records",
                "contemporaneous statement",
                "res gestae",
                "dying declaration",
                "admission by party"
              ],
              required: false,
              type: "EXCEPTION"
            }
          ]
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "NON_COMPLIANT",
        severity: "CRITICAL",
        consequence: "Evidence appears to be hearsay without exception",
        remedy: "Object to admissibility - exclude hearsay evidence",
        legalPrinciple: "Hearsay generally inadmissible unless exception applies"
      },
      onFailure: {
        result: "COMPLIANT",
        message: "No hearsay issue or exception applies"
      }
    }
  }
];

/**
 * Search Warrants Act 2023 - Rules
 */
export const SearchWarrantsActRules = [
  /**
   * SWA s.10 - Grounds for search warrant
   */
  {
    ruleId: "SWA_s10_grounds",
    statute: "Search Warrants Act 2023",
    section: "10",
    type: "MANDATORY_PREREQUISITE",
    description: "Authorised officer must have reasonable grounds for search warrant",

    condition: {
      operator: "AND",
      requirements: [
        {
          element: "reasonable_grounds",
          keywords: [
            "reasonable grounds",
            "reasonable grounds to believe",
            "grounds to suspect"
          ],
          required: true,
          type: "GROUNDS"
        },
        {
          element: "thing_described",
          operator: "OR",
          options: [
            "thing relevant to offense",
            "evidence of offense",
            "thing used in commission",
            "proceeds of crime"
          ],
          required: true,
          type: "THING_SOUGHT"
        },
        {
          element: "premises_specified",
          keywords: [
            "premises",
            "at the address",
            "located at",
            "on the property"
          ],
          required: true,
          type: "LOCATION"
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "COMPLIANT",
        message: "Grounds for search warrant properly established per s.10"
      },
      onFailure: {
        result: "NON_COMPLIANT",
        severity: "CRITICAL",
        consequence: "Search warrant may be invalid - insufficient grounds",
        remedy: "Challenge validity of search warrant - exclude evidence obtained",
        legalPrinciple: "Search warrant requires reasonable grounds and specificity"
      }
    }
  },

  /**
   * SWA s.36 - Execution of warrant
   */
  {
    ruleId: "SWA_s36_execution",
    statute: "Search Warrants Act 2023",
    section: "36",
    type: "MANDATORY_PROCEDURAL",
    description: "Warrant must be executed in accordance with Act",

    condition: {
      operator: "AND",
      requirements: [
        {
          element: "announcement",
          keywords: [
            "announced presence",
            "announced authority",
            "identified as police",
            "stated purpose"
          ],
          required: true,
          type: "ANNOUNCEMENT"
        },
        {
          element: "warrant_shown",
          keywords: [
            "showed warrant",
            "produced warrant",
            "provided copy of warrant"
          ],
          required: true,
          type: "WARRANT_PRODUCTION"
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "COMPLIANT",
        message: "Warrant executed in accordance with s.36 requirements"
      },
      onFailure: {
        result: "NON_COMPLIANT",
        severity: "HIGH",
        consequence: "Warrant may have been improperly executed",
        remedy: "Challenge execution - may affect admissibility of evidence",
        legalPrinciple: "Strict compliance with execution procedures required"
      }
    }
  }
];

/**
 * Crimes Act 1958 - Additional Rules
 */
export const CrimesActAdditionalRules = [
  /**
   * Crimes Act s.464A - Identification parade
   */
  {
    ruleId: "CRIMES_s464A_identification",
    statute: "Crimes Act 1958",
    section: "464A",
    type: "MANDATORY_PROCEDURAL",
    description: "Identification parade must be conducted fairly",

    condition: {
      operator: "AND",
      requirements: [
        {
          element: "parade_composition",
          keywords: [
            "similar appearance",
            "appropriate foils",
            "fair composition",
            "similar characteristics"
          ],
          required: true,
          type: "FAIRNESS"
        },
        {
          element: "warnings_given",
          keywords: [
            "warned",
            "cautioned",
            "may not be present",
            "no obligation to identify"
          ],
          required: true,
          type: "WARNINGS"
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "COMPLIANT",
        message: "Identification parade conducted fairly per s.464A"
      },
      onFailure: {
        result: "NON_COMPLIANT",
        severity: "CRITICAL",
        consequence: "Identification evidence may be unreliable or inadmissible",
        remedy: "Challenge identification evidence - exclude or reduce weight",
        legalPrinciple: "Identification evidence must be obtained fairly"
      }
    }
  }
];

/**
 * All Extended Statutory Rules Combined
 */
export const AllExtendedStatutoryRules = [
  ...CriminalProcedureActRules,
  ...BailActRules,
  ...SentencingActRules,
  ...EvidenceActAdditionalRules,
  ...SearchWarrantsActRules,
  ...CrimesActAdditionalRules
];

/**
 * Get rule count by statute
 */
export function getExtendedRuleStatistics() {
  const stats = {
    "Criminal Procedure Act 2009": CriminalProcedureActRules.length,
    "Bail Act 1977": BailActRules.length,
    "Sentencing Act 1991": SentencingActRules.length,
    "Evidence Act 2008": EvidenceActAdditionalRules.length,
    "Search Warrants Act 2023": SearchWarrantsActRules.length,
    "Crimes Act 1958 (Additional)": CrimesActAdditionalRules.length,
    "Total Extended Rules": AllExtendedStatutoryRules.length
  };

  return stats;
}

/**
 * Default export
 */
export default {
  CriminalProcedureActRules,
  BailActRules,
  SentencingActRules,
  EvidenceActAdditionalRules,
  SearchWarrantsActRules,
  CrimesActAdditionalRules,
  AllExtendedStatutoryRules,
  getExtendedRuleStatistics
};
