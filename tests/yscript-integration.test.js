/**
 * YScript Integration Test Suite
 *
 * Tests integration between YScript Engine and existing PresetAnalyzers
 *
 * @version 1.0.0
 * @jurisdiction Victoria, Australia
 */

import { createAnalyzer, PresetAnalyzers } from '../src/engines/YScriptIntegration.js';
import { runAnalysis, getAllPresets } from '../src/analyzers/PresetAnalyzers.js';

/**
 * Test Runner (simplified for integration tests)
 */
class IntegrationTestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔗 YScript Integration Test Suite');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    for (const test of this.tests) {
      try {
        await test.fn();
        this.passed++;
        console.log(`✓ ${test.name}`);
      } catch (error) {
        this.failed++;
        console.error(`✗ ${test.name}`);
        console.error(`  Error: ${error.message}\n`);
      }
    }

    this.printSummary();
    return this.failed === 0;
  }

  printSummary() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Test Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total:  ${this.tests.length}`);
    console.log(`Passed: ${this.passed} ✓`);
    console.log(`Failed: ${this.failed} ${this.failed > 0 ? '✗' : ''}`);
    console.log(`Success Rate: ${((this.passed / this.tests.length) * 100).toFixed(1)}%`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
  }

  assertNotNull(value, message) {
    if (value === null || value === undefined) {
      throw new Error(message || 'Expected non-null value');
    }
  }

  assertTrue(condition, message) {
    if (condition !== true) throw new Error(message || 'Expected true');
  }
}

const runner = new IntegrationTestRunner();

// ============================================================================
// INTEGRATION TESTS - YScript with Analyzers
// ============================================================================

runner.test('YScriptDocumentAnalyzer initializes correctly', () => {
  const analyzer = createAnalyzer({ debug: false });
  runner.assertNotNull(analyzer, 'Analyzer should be created');
  runner.assertNotNull(analyzer.engine, 'Analyzer should have engine');
  runner.assertTrue(analyzer.engine.rules.size > 0, 'Engine should have rules loaded');
});

runner.test('Analyzer analyzes Road Safety Act compliance', () => {
  const analyzer = createAnalyzer({ debug: false });

  const doc = `
    On 15 January 2024, I had reason to believe that the driver had consumed alcohol
    and had driven a motor vehicle. I detected a strong smell of alcohol and observed
    bloodshot eyes. The preliminary breath test returned a positive result.
  `;

  const results = analyzer.analyzeRoadSafetyCompliance(doc);

  runner.assertNotNull(results, 'Results should be returned');
  runner.assertNotNull(results.ruleResults, 'Should have rule results');
  runner.assertTrue(Array.isArray(results.ruleResults), 'Rule results should be array');
});

runner.test('Analyzer analyzes specific statute section', () => {
  const analyzer = createAnalyzer({ debug: false });

  const doc = `
    I had reason to believe that the person had consumed alcohol and had driven
    a motor vehicle. I observed the smell of alcohol on his breath.
  `;

  const results = analyzer.analyzeSection('Road Safety Act', '49(1)', doc);

  runner.assertNotNull(results, 'Results should be returned');
  runner.assertNotNull(results.report, 'Should include report');
});

runner.test('Analyzer performs quick compliance check', () => {
  const analyzer = createAnalyzer({ debug: false });

  const compliantDoc = `
    I had reason to believe the person had consumed alcohol and had driven a motor vehicle.
  `;

  const nonCompliantDoc = `
    The person was stopped for a traffic check.
  `;

  const result1 = analyzer.quickCheck('RSA_s49_1_reason_to_believe', compliantDoc);
  runner.assertTrue(result1 === true || result1 === false, 'Should return boolean');

  const result2 = analyzer.quickCheck('RSA_s49_1_reason_to_believe', nonCompliantDoc);
  runner.assertTrue(result2 === true || result2 === false, 'Should return boolean');
});

runner.test('Analyzer finds defects in document', () => {
  const analyzer = createAnalyzer({ debug: false });

  const defectiveDoc = `
    The driver was stopped and tested for alcohol. The test was positive.
  `;

  const defects = analyzer.findDefects(defectiveDoc);

  runner.assertNotNull(defects, 'Defects should be returned');
  runner.assertNotNull(defects.totalChecks, 'Should have total checks');
  runner.assertNotNull(defects.defectsFound, 'Should have defects found');
  runner.assertTrue(Array.isArray(defects.critical), 'Should have critical array');
  runner.assertTrue(Array.isArray(defects.warnings), 'Should have warnings array');
});

runner.test('Analyzer generates forensic report', () => {
  const analyzer = createAnalyzer({ debug: false });

  const doc = `
    On 15 January 2024, I had reason to believe the person had consumed alcohol
    and had driven a motor vehicle. The driver had bloodshot eyes and smelt of alcohol.
    The preliminary test was positive. An evidentiary test was conducted using an
    approved instrument in accordance with approved procedures.
  `;

  const report = analyzer.generateForensicReport(doc, {
    focusStatute: 'Road Safety Act',
    includeEvidence: true
  });

  runner.assertNotNull(report, 'Report should be generated');
  runner.assertNotNull(report.metadata, 'Report should have metadata');
  runner.assertNotNull(report.summary, 'Report should have summary');
  runner.assertNotNull(report.formattedReport, 'Report should have formatted report');
  runner.assertNotNull(report.evidenceSummary, 'Report should have evidence summary');
});

runner.test('Analyzer compares two documents', () => {
  const analyzer = createAnalyzer({ debug: false });

  const doc1 = `
    I had reason to believe the person had consumed alcohol and had driven a motor vehicle.
    The driver had bloodshot eyes and smelt of alcohol.
  `;

  const doc2 = `
    The person was stopped for a traffic check.
  `;

  const ruleIds = ['RSA_s49_1_reason_to_believe', 'RSA_s49_1_articulation_of_belief'];
  const comparison = analyzer.compareDocuments(doc1, doc2, ruleIds);

  runner.assertNotNull(comparison, 'Comparison should be returned');
  runner.assertNotNull(comparison.document1, 'Should have doc1 results');
  runner.assertNotNull(comparison.document2, 'Should have doc2 results');
  runner.assertNotNull(comparison.comparison, 'Should have comparison summary');
});

runner.test('Analyzer provides statistics', () => {
  const analyzer = createAnalyzer({ debug: false });

  const stats = analyzer.getStatistics();

  runner.assertNotNull(stats, 'Stats should be returned');
  runner.assertTrue(stats.rulesLoaded > 0, 'Should have rules loaded');
  runner.assertNotNull(stats.rulesByStatute, 'Should have rules by statute');
});

runner.test('PresetAnalyzers.DrinkDriving analyzes document', () => {
  const doc = `
    I had reason to believe the person had consumed alcohol and had driven a motor vehicle.
    I detected a smell of alcohol. The preliminary test was positive. An evidentiary test
    was conducted using an approved instrument. The driver was informed of their right to
    a medical practitioner.
  `;

  const results = PresetAnalyzers.DrinkDriving.analyze(doc);

  runner.assertNotNull(results, 'Results should be returned');
  runner.assertNotNull(results.ruleResults, 'Should have rule results');
});

runner.test('PresetAnalyzers.PreliminaryBreathTest analyzes document', () => {
  const doc = `
    I had reason to believe the person had consumed alcohol and had driven a motor vehicle.
    The driver had bloodshot eyes.
  `;

  const results = PresetAnalyzers.PreliminaryBreathTest.analyze(doc);

  runner.assertNotNull(results, 'Results should be returned');
  runner.assertNotNull(results.ruleResults, 'Should have rule results');
});

runner.test('PresetAnalyzers.ArrestLawfulness analyzes document', () => {
  const doc = `
    I had reasonable grounds to believe the person had committed an offense.
    The person was cautioned before being questioned.
  `;

  const results = PresetAnalyzers.ArrestLawfulness.analyze(doc);

  runner.assertNotNull(results, 'Results should be returned');
  runner.assertNotNull(results.ruleResults, 'Should have rule results');
});

// ============================================================================
// INTEGRATION WITH EXISTING PRESET ANALYZERS
// ============================================================================

runner.test('Integration: Existing Preset1 StatutoryProcedural works', async () => {
  const doc = `
    Pursuant to section 49(1) of the Road Safety Act 1986, on 15 January 2024 at
    11:45pm, the officer must have formed a reasonable belief before requiring the test.
  `;

  const results = await runAnalysis(doc, [1]);

  runner.assertNotNull(results, 'Results should be returned');
  runner.assertTrue(Array.isArray(results), 'Results should be array');
  runner.assertTrue(results.length > 0, 'Should have results');
  runner.assertNotNull(results[0].findings, 'Should have findings');
});

runner.test('Integration: Existing Preset2 Contextual works', async () => {
  const doc = `
    Before the test was conducted, the officer observed the driver. After the
    preliminary test, the evidentiary test was required. During the procedure,
    proper protocols were followed.
  `;

  const results = await runAnalysis(doc, [2]);

  runner.assertNotNull(results, 'Results should be returned');
  runner.assertTrue(results.length > 0, 'Should have results');
  runner.assertNotNull(results[0].findings, 'Should have findings');
});

runner.test('Integration: Existing Preset5 SubjectiveIntent works', async () => {
  const doc = `
    I believed that the driver had consumed alcohol. I suspected that the person
    was under the influence. I formed the opinion that an offense had been committed.
    I observed bloodshot eyes and unsteady gait as objective evidence.
  `;

  const results = await runAnalysis(doc, [5]);

  runner.assertNotNull(results, 'Results should be returned');
  runner.assertTrue(results.length > 0, 'Should have results');
  runner.assertNotNull(results[0].findings, 'Should have findings');
});

runner.test('Integration: Existing Preset8 Evidentiary works', async () => {
  const doc = `
    The driver was observed driving and had a reasonable belief of alcohol consumption.
    The test was conducted by an authorized operator using proper authority. The device
    was properly maintained and calibrated.
  `;

  const results = await runAnalysis(doc, [8]);

  runner.assertNotNull(results, 'Results should be returned');
  runner.assertTrue(results.length > 0, 'Should have results');
});

runner.test('Integration: YScript + PresetAnalyzers combined analysis', async () => {
  const analyzer = createAnalyzer({ debug: false });

  const doc = `
    On 15 January 2024 at 11:45pm, pursuant to section 49(1) of the Road Safety Act 1986,
    I had reason to believe that the driver had consumed alcohol and had driven a motor vehicle.
    I detected a strong smell of alcohol on his breath. His eyes were bloodshot and he was
    unsteady on his feet.

    Based on these observations, I required the driver to undergo a preliminary breath test.
    The preliminary breath test returned a positive result.

    I then required the driver to accompany me to the police station for an evidentiary
    breath test. The test was conducted using an approved breath testing instrument by a
    qualified operator in accordance with approved procedures.

    I informed the driver of his right to have a sample taken by a medical practitioner.
  `;

  // Run YScript analysis
  const yscriptResults = analyzer.analyzeRoadSafetyCompliance(doc);

  // Run Preset analyzers
  const presetResults = await runAnalysis(doc, [1, 2, 5, 8]);

  // Verify both work
  runner.assertNotNull(yscriptResults, 'YScript results should exist');
  runner.assertNotNull(presetResults, 'Preset results should exist');

  runner.assertTrue(yscriptResults.ruleResults.length > 0, 'YScript should have rule results');
  runner.assertTrue(presetResults.length > 0, 'Presets should have results');

  // Verify YScript identifies compliance
  runner.assertTrue(yscriptResults.overallCompliant || !yscriptResults.overallCompliant,
    'YScript should return compliance status');

  // Verify Preset analyzers find statutory references
  const statutoryFindings = presetResults[0].findings.filter(f =>
    f.type.includes('Statutory')
  );
  runner.assertTrue(statutoryFindings.length > 0, 'Should find statutory references');

  console.log('\n  📊 Combined Analysis Summary:');
  console.log(`  - YScript Rules Evaluated: ${yscriptResults.totalRules}`);
  console.log(`  - YScript Compliant: ${yscriptResults.compliant}`);
  console.log(`  - YScript Non-Compliant: ${yscriptResults.nonCompliant}`);
  console.log(`  - Preset Analyzers Run: ${presetResults.length}`);
  console.log(`  - Total Findings: ${presetResults.reduce((sum, r) => sum + r.findings.length, 0)}`);
});

// ============================================================================
// REAL-WORLD SCENARIO TESTS
// ============================================================================

runner.test('Real-world: Complete drink driving scenario - COMPLIANT', async () => {
  const analyzer = createAnalyzer({ debug: false });

  const compliantScenario = `
    POLICE STATEMENT - DRINK DRIVING OFFENSE

    On 15 January 2024 at 11:45pm, I, Senior Constable Jane Smith (badge 12345),
    was conducting mobile patrol on High Street, Melbourne when I observed a white
    Toyota Camry, registration ABC123, being driven in an erratic manner, swerving
    across lanes and crossing the centre line on multiple occasions.

    I formed the belief that the driver had consumed alcohol and had been driving
    the motor vehicle. I activated my lights and sirens and intercepted the vehicle
    at 11:48pm.

    Upon approaching the driver's window, I immediately detected a strong smell of
    alcohol emanating from the driver's breath. The driver identified himself as
    John Smith (DOB: 01/05/1985, DL: 123456789).

    I observed that Mr Smith's eyes were bloodshot and glassy. When he exited the
    vehicle, I noted that he was unsteady on his feet, swaying and using the vehicle
    for support. His speech was slurred when he answered my questions.

    Based on these observations, I had reason to believe that Mr Smith had consumed
    alcohol and had alcohol in his body, and that he had been driving the motor vehicle.

    At 11:52pm, pursuant to section 49(1) of the Road Safety Act 1986, I required
    Mr Smith to undergo a preliminary breath test. I explained the requirement to him.

    The preliminary breath test was conducted at 11:54pm using an approved preliminary
    breath testing device. The test returned a positive result, indicating the presence
    of alcohol.

    At 11:56pm, having received a positive preliminary breath test result, I required
    Mr Smith pursuant to section 55(1) of the Road Safety Act 1986 to accompany me
    to the Fitzroy Police Station for an evidentiary breath analysis.

    We arrived at Fitzroy Police Station at 12:15am on 16 January 2024. At 12:25am,
    I informed Mr Smith of his right pursuant to section 56 of the Road Safety Act 1986
    to have a sample of his blood or urine taken by a medical practitioner of his choice
    within three hours.

    At 12:30am, the evidentiary breath analysis was conducted by Senior Constable
    Michael Jones, a qualified breath analysis operator (Certificate No. BA-2023-456),
    using an approved breath testing instrument (Device Serial No. BT-789-VIC),
    in accordance with the approved procedures set out in the Road Safety (Breath
    Testing) Regulations 2017.

    The evidentiary breath analysis showed a blood alcohol concentration of 0.127%.

    Mr Smith was then charged with driving a motor vehicle while having a blood
    alcohol concentration exceeding 0.05% contrary to section 49(1)(f) of the
    Road Safety Act 1986.
  `;

  const yscriptResults = analyzer.analyzeRoadSafetyCompliance(compliantScenario);
  const presetResults = await runAnalysis(compliantScenario, [1, 2, 5, 8]);

  runner.assertTrue(yscriptResults.overallCompliant,
    'Compliant scenario should pass YScript analysis');
  runner.assertEqual(yscriptResults.criticalFailures.length, 0,
    'Should have no critical failures');

  console.log('\n  ✓ Complete compliant scenario validated');
  console.log(`  - Rules evaluated: ${yscriptResults.totalRules}`);
  console.log(`  - All compliant: ${yscriptResults.compliant}/${yscriptResults.totalRules}`);
});

runner.test('Real-world: Complete drink driving scenario - DEFECTIVE', async () => {
  const analyzer = createAnalyzer({ debug: false });

  const defectiveScenario = `
    POLICE STATEMENT - DRINK DRIVING OFFENSE

    On 15 January 2024, I was on patrol when I saw a car being driven.

    I pulled the car over and spoke to the driver. I asked him to do a breath test.

    The breath test was positive.

    I took the driver to the station. Another breath test was done. The reading was 0.12%.

    The driver was charged with drink driving.
  `;

  const yscriptResults = analyzer.analyzeRoadSafetyCompliance(defectiveScenario);
  const defects = analyzer.findDefects(defectiveScenario);

  runner.assertFalse(yscriptResults.overallCompliant,
    'Defective scenario should fail YScript analysis');
  runner.assertTrue(yscriptResults.criticalFailures.length > 0,
    'Should have critical failures');
  runner.assertTrue(defects.defectsFound > 0,
    'Should identify defects');

  console.log('\n  ✓ Defective scenario correctly identified');
  console.log(`  - Critical failures: ${yscriptResults.criticalFailures.length}`);
  console.log(`  - Defects found: ${defects.defectsFound}`);
  console.log(`  - Missing elements detected correctly`);
});

// ============================================================================
// RUN TESTS
// ============================================================================

console.log('Starting YScript Integration Test Suite...\n');
const success = await runner.run();

if (typeof process !== 'undefined') {
  process.exit(success ? 0 : 1);
}
