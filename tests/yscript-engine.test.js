/**
 * YScript Engine Test Suite
 *
 * Comprehensive tests for the YScript Rules-as-Code Engine
 *
 * @version 1.0.0
 * @jurisdiction Victoria, Australia
 */

import { YScriptEngine } from '../src/engines/YScriptEngine.js';
import {
  AllStatutoryRules,
  RoadSafetyActRules,
  getCriticalRules
} from '../src/engines/StatutoryRules.js';

/**
 * Test Runner
 */
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.results = [];
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🧪 YScript Engine Test Suite');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    for (const test of this.tests) {
      try {
        await test.fn();
        this.passed++;
        this.results.push({ name: test.name, status: 'PASS', error: null });
        console.log(`✓ ${test.name}`);
      } catch (error) {
        this.failed++;
        this.results.push({ name: test.name, status: 'FAIL', error: error.message });
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
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }

  assertNotNull(value, message) {
    if (value === null || value === undefined) {
      throw new Error(message || 'Expected non-null value');
    }
  }

  assertTrue(condition, message) {
    if (condition !== true) {
      throw new Error(message || 'Expected true');
    }
  }

  assertFalse(condition, message) {
    if (condition !== false) {
      throw new Error(message || 'Expected false');
    }
  }
}

// Test Runner Instance
const runner = new TestRunner();

// ============================================================================
// UNIT TESTS - Core Engine Functionality
// ============================================================================

runner.test('Engine initializes correctly', () => {
  const engine = new YScriptEngine();
  runner.assertNotNull(engine, 'Engine should be created');
  runner.assertEqual(engine.rules.size, 0, 'Engine should start with no rules');
  runner.assertTrue(Array.isArray(engine.evaluationHistory), 'History should be array');
});

runner.test('Engine registers single rule successfully', () => {
  const engine = new YScriptEngine();
  const testRule = RoadSafetyActRules[0];

  const success = engine.registerRule(testRule);
  runner.assertTrue(success, 'Rule registration should succeed');
  runner.assertEqual(engine.rules.size, 1, 'Engine should have 1 rule');

  const retrievedRule = engine.getRule(testRule.ruleId);
  runner.assertNotNull(retrievedRule, 'Rule should be retrievable');
  runner.assertEqual(retrievedRule.ruleId, testRule.ruleId, 'Rule IDs should match');
});

runner.test('Engine registers multiple rules successfully', () => {
  const engine = new YScriptEngine();
  const results = engine.registerRules(RoadSafetyActRules);

  runner.assertEqual(results.total, RoadSafetyActRules.length, 'Should process all rules');
  runner.assertEqual(results.successful, RoadSafetyActRules.length, 'All rules should succeed');
  runner.assertEqual(results.failed, 0, 'No rules should fail');
  runner.assertEqual(engine.rules.size, RoadSafetyActRules.length, 'All rules should be stored');
});

runner.test('Engine rejects invalid rule - missing ruleId', () => {
  const engine = new YScriptEngine();
  const invalidRule = {
    statute: 'Test Act',
    section: '1',
    // missing ruleId
    type: 'TEST',
    condition: { element: 'test', keywords: ['test'], required: true },
    evaluation: {
      onSuccess: { result: 'COMPLIANT', message: 'Test' },
      onFailure: { result: 'NON_COMPLIANT', message: 'Test' }
    }
  };

  const success = engine.registerRule(invalidRule);
  runner.assertFalse(success, 'Invalid rule should fail to register');
  runner.assertEqual(engine.rules.size, 0, 'No rules should be stored');
});

runner.test('Engine evaluates compliant document correctly', () => {
  const engine = new YScriptEngine();
  engine.registerRules(RoadSafetyActRules);

  const compliantDoc = `
    On 15 January 2024, I had reason to believe that the driver had consumed alcohol
    and had driven a motor vehicle. I observed the driver had bloodshot eyes and
    was unsteady on his feet. There was a strong smell of alcohol on his breath.
  `;

  const result = engine.evaluateRule('RSA_s49_1_reason_to_believe', compliantDoc);

  runner.assertNotNull(result, 'Result should be returned');
  runner.assertTrue(result.compliant, 'Document should be compliant');
  runner.assertEqual(result.ruleId, 'RSA_s49_1_reason_to_believe', 'Rule ID should match');
  runner.assertNotNull(result.evidence, 'Evidence should be extracted');
});

runner.test('Engine evaluates non-compliant document correctly', () => {
  const engine = new YScriptEngine();
  engine.registerRules(RoadSafetyActRules);

  const nonCompliantDoc = `
    On 15 January 2024, I pulled over a driver and asked them to do a breath test.
    The test was positive.
  `;

  const result = engine.evaluateRule('RSA_s49_1_reason_to_believe', nonCompliantDoc);

  runner.assertNotNull(result, 'Result should be returned');
  runner.assertFalse(result.compliant, 'Document should be non-compliant');
  runner.assertNotNull(result.missing, 'Missing requirements should be listed');
  runner.assertTrue(result.missing.length > 0, 'Should have missing requirements');
});

runner.test('Engine handles AND operator correctly', () => {
  const engine = new YScriptEngine();
  engine.registerRules(RoadSafetyActRules);

  // Document with all AND requirements
  const allRequirements = `
    I had reason to believe that the person had consumed alcohol and had driven a motor vehicle.
  `;

  const result1 = engine.evaluateRule('RSA_s49_1_reason_to_believe', allRequirements);
  runner.assertTrue(result1.compliant, 'Should be compliant when all AND conditions met');

  // Document missing one AND requirement
  const missingRequirement = `
    I had reason to believe that the person had consumed alcohol.
  `;

  const result2 = engine.evaluateRule('RSA_s49_1_reason_to_believe', missingRequirement);
  runner.assertFalse(result2.compliant, 'Should be non-compliant when AND condition missing');
});

runner.test('Engine handles OR operator correctly', () => {
  const engine = new YScriptEngine();
  engine.registerRules(RoadSafetyActRules);

  // Document with one OR option
  const withSmell = `
    I had reason to believe that the person had consumed alcohol and had driven a motor vehicle.
    I detected a strong smell of alcohol on his breath.
  `;

  const result1 = engine.evaluateRule('RSA_s49_1_articulation_of_belief', withSmell);
  runner.assertTrue(result1.compliant, 'Should be compliant with one OR option');

  // Document with different OR option
  const withBloodshotEyes = `
    I had reason to believe that the person had consumed alcohol and had driven a motor vehicle.
    The driver had bloodshot eyes.
  `;

  const result2 = engine.evaluateRule('RSA_s49_1_articulation_of_belief', withBloodshotEyes);
  runner.assertTrue(result2.compliant, 'Should be compliant with different OR option');
});

runner.test('Engine handles IF-THEN operator correctly', () => {
  const engine = new YScriptEngine();

  // Create test rule with IF-THEN
  const ifThenRule = {
    ruleId: 'TEST_IF_THEN',
    statute: 'Test Act',
    section: '1',
    type: 'TEST',
    condition: {
      operator: 'IF-THEN',
      antecedent: {
        element: 'arrest',
        keywords: ['arrested', 'arrest'],
        required: true
      },
      consequent: {
        element: 'caution',
        keywords: ['cautioned', 'caution'],
        required: true
      }
    },
    evaluation: {
      onSuccess: { result: 'COMPLIANT', message: 'IF-THEN satisfied' },
      onFailure: { result: 'NON_COMPLIANT', message: 'IF-THEN violated', severity: 'HIGH' }
    }
  };

  engine.registerRule(ifThenRule);

  // Test: IF false -> vacuously true
  const noArrest = 'The person was questioned but not arrested.';
  const result1 = engine.evaluateRule('TEST_IF_THEN', noArrest);
  runner.assertTrue(result1.compliant, 'Should be compliant when antecedent false (vacuously true)');

  // Test: IF true AND THEN true -> satisfied
  const arrestedAndCautioned = 'The person was arrested and cautioned.';
  const result2 = engine.evaluateRule('TEST_IF_THEN', arrestedAndCautioned);
  runner.assertTrue(result2.compliant, 'Should be compliant when both antecedent and consequent true');

  // Test: IF true AND THEN false -> violated
  const arrestedNoCaution = 'The person was arrested.';
  const result3 = engine.evaluateRule('TEST_IF_THEN', arrestedNoCaution);
  runner.assertFalse(result3.compliant, 'Should be non-compliant when antecedent true but consequent false');
});

runner.test('Engine extracts evidence with confidence scores', () => {
  const engine = new YScriptEngine();
  engine.registerRules(RoadSafetyActRules);

  const doc = `
    I detected a strong smell of alcohol on his breath. His eyes were bloodshot
    and he was unsteady on his feet. He was swerving across lanes.
  `;

  const result = engine.evaluateRule('RSA_s49_1_articulation_of_belief', doc);

  runner.assertNotNull(result.evidence, 'Evidence should be extracted');
  runner.assertTrue(result.evidence.length > 0, 'Should have evidence items');

  const firstEvidence = result.evidence[0];
  runner.assertNotNull(firstEvidence.term, 'Evidence should have term');
  runner.assertNotNull(firstEvidence.sentence, 'Evidence should have sentence');
  runner.assertNotNull(firstEvidence.confidence, 'Evidence should have confidence');
  runner.assertTrue(firstEvidence.confidence >= 0 && firstEvidence.confidence <= 1,
    'Confidence should be between 0 and 1');
});

runner.test('Engine evaluates multiple rules and aggregates results', () => {
  const engine = new YScriptEngine();
  engine.registerRules(RoadSafetyActRules);

  const compliantDoc = `
    On 15 January 2024 at 11:45pm, I was on patrol when I observed a vehicle swerving.
    I formed the belief that the driver had consumed alcohol and had driven a motor vehicle.
    I detected a strong smell of alcohol on his breath and his eyes were bloodshot.
    The preliminary breath test returned a positive result.
    I required the driver to undergo an evidentiary breath test using an approved instrument.
    The test was conducted in accordance with approved procedures by a qualified operator.
    I informed the driver of his right to have a sample taken by a medical practitioner.
  `;

  const ruleIds = RoadSafetyActRules.map(r => r.ruleId);
  const results = engine.evaluateMultipleRules(ruleIds, compliantDoc);

  runner.assertNotNull(results, 'Results should be returned');
  runner.assertEqual(results.totalRules, ruleIds.length, 'Should evaluate all rules');
  runner.assertTrue(results.compliant >= 0, 'Should have compliant count');
  runner.assertTrue(results.nonCompliant >= 0, 'Should have non-compliant count');
  runner.assertEqual(results.compliant + results.nonCompliant + results.errors,
    results.totalRules, 'Counts should add up');
});

runner.test('Engine generates single rule report', () => {
  const engine = new YScriptEngine();
  engine.registerRules(RoadSafetyActRules);

  const doc = `
    I had reason to believe the person had consumed alcohol and had driven a motor vehicle.
  `;

  const result = engine.evaluateRule('RSA_s49_1_reason_to_believe', doc);
  const report = engine.generateReport(result);

  runner.assertNotNull(report, 'Report should be generated');
  runner.assertTrue(report.includes('YSCRIPT COMPLIANCE REPORT'), 'Report should have title');
  runner.assertTrue(report.includes(result.ruleId), 'Report should include rule ID');
  runner.assertTrue(report.includes(result.statute), 'Report should include statute');
});

runner.test('Engine generates multi-rule report', () => {
  const engine = new YScriptEngine();
  engine.registerRules(RoadSafetyActRules);

  const doc = `
    I had reason to believe the person had consumed alcohol and had driven a motor vehicle.
    The driver had bloodshot eyes and smelt of alcohol.
  `;

  const ruleIds = ['RSA_s49_1_reason_to_believe', 'RSA_s49_1_articulation_of_belief'];
  const results = engine.evaluateMultipleRules(ruleIds, doc);
  const report = engine.generateReport(results);

  runner.assertNotNull(report, 'Report should be generated');
  runner.assertTrue(report.includes('MULTI-RULE COMPLIANCE REPORT'), 'Report should have title');
  runner.assertTrue(report.includes('Total Rules Evaluated'), 'Report should include summary');
});

runner.test('Engine tracks evaluation history', () => {
  const engine = new YScriptEngine();
  engine.registerRules(RoadSafetyActRules);

  const doc1 = 'I had reason to believe the person had consumed alcohol and had driven a motor vehicle.';
  const doc2 = 'The person was stopped.';

  engine.evaluateRule('RSA_s49_1_reason_to_believe', doc1);
  engine.evaluateRule('RSA_s49_1_reason_to_believe', doc2);

  const history = engine.getHistory();
  runner.assertEqual(history.length, 2, 'Should have 2 history entries');
  runner.assertNotNull(history[0].timestamp, 'History should have timestamps');
  runner.assertNotNull(history[0].evaluationTime, 'History should have evaluation times');
});

runner.test('Engine exports and imports rules', () => {
  const engine1 = new YScriptEngine();
  engine1.registerRules(RoadSafetyActRules);

  const exported = engine1.exportRules();
  runner.assertNotNull(exported, 'Export should return JSON');

  const engine2 = new YScriptEngine();
  const importResults = engine2.importRules(exported);

  runner.assertEqual(importResults.successful, RoadSafetyActRules.length,
    'All rules should import successfully');
  runner.assertEqual(engine2.rules.size, engine1.rules.size,
    'Both engines should have same number of rules');
});

// ============================================================================
// INTEGRATION TESTS - Real Document Scenarios
// ============================================================================

runner.test('Integration: Compliant drink driving document', () => {
  const engine = new YScriptEngine();
  engine.registerRules(RoadSafetyActRules);

  const compliantDoc = `
    On 15 January 2024 at 11:45pm, I was on patrol on High Street, Melbourne
    when I observed a white Toyota Camry registration ABC123 being driven erratically,
    swerving across lanes.

    I intercepted the vehicle and spoke with the driver, John Smith. I immediately
    detected a strong smell of alcohol on his breath. His eyes were bloodshot and
    he was unsteady on his feet.

    I formed the belief that Mr Smith had consumed alcohol and had been driving
    a motor vehicle. I therefore had reason to believe that he had alcohol in his
    body and had driven a motor vehicle.

    Based on these observations, I required Mr Smith to undergo a preliminary breath
    test pursuant to section 49(1) of the Road Safety Act 1986. The preliminary
    breath test returned a positive result.

    I then required Mr Smith to accompany me to the police station for an evidentiary
    breath test. The test was conducted using an approved breath testing instrument
    by a qualified operator in accordance with approved procedures.

    I informed Mr Smith of his right to have a sample taken by a medical practitioner.
    The evidentiary breath test showed a blood alcohol reading of 0.12%.
  `;

  const ruleIds = RoadSafetyActRules.map(r => r.ruleId);
  const results = engine.evaluateMultipleRules(ruleIds, compliantDoc);

  runner.assertTrue(results.overallCompliant, 'Document should be overall compliant');
  runner.assertEqual(results.criticalFailures.length, 0, 'Should have no critical failures');
});

runner.test('Integration: Non-compliant drink driving document (missing articulation)', () => {
  const engine = new YScriptEngine();
  engine.registerRules(RoadSafetyActRules);

  const nonCompliantDoc = `
    On 15 January 2024 at 11:45pm, I was on patrol on High Street, Melbourne.

    I saw John Smith driving and I decided to pull him over. I asked him to do
    a breath test. The test came back positive for alcohol.

    I took him to the station for another breath test. The reading was 0.12%.

    Mr Smith was charged with driving with excess blood alcohol.
  `;

  const ruleIds = RoadSafetyActRules.map(r => r.ruleId);
  const results = engine.evaluateMultipleRules(ruleIds, nonCompliantDoc);

  runner.assertFalse(results.overallCompliant, 'Document should be non-compliant');
  runner.assertTrue(results.nonCompliant > 0, 'Should have non-compliant rules');
  runner.assertTrue(results.criticalFailures.length > 0, 'Should have critical failures');
});

runner.test('Integration: Critical rules identification', () => {
  const criticalRules = getCriticalRules();

  runner.assertTrue(criticalRules.length > 0, 'Should have critical rules');

  criticalRules.forEach(rule => {
    runner.assertEqual(rule.evaluation.onFailure.severity, 'CRITICAL',
      'Critical rule should have CRITICAL severity');
  });
});

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

runner.test('Performance: Engine evaluates rule in reasonable time', () => {
  const engine = new YScriptEngine();
  engine.registerRules(RoadSafetyActRules);

  const doc = `
    I had reason to believe that the person had consumed alcohol and had driven
    a motor vehicle. I observed bloodshot eyes and unsteady gait.
  `;

  const start = Date.now();
  const result = engine.evaluateRule('RSA_s49_1_reason_to_believe', doc);
  const duration = Date.now() - start;

  runner.assertTrue(duration < 100, `Evaluation should be fast (took ${duration}ms)`);
});

runner.test('Performance: Engine handles large documents efficiently', () => {
  const engine = new YScriptEngine();
  engine.registerRules(RoadSafetyActRules);

  // Generate large document
  let largeDoc = 'Background context. '.repeat(100);
  largeDoc += `
    I had reason to believe that the person had consumed alcohol and had driven
    a motor vehicle. I observed bloodshot eyes and detected smell of alcohol.
  `;
  largeDoc += 'Additional context. '.repeat(100);

  const start = Date.now();
  const result = engine.evaluateRule('RSA_s49_1_reason_to_believe', largeDoc);
  const duration = Date.now() - start;

  runner.assertTrue(duration < 500, `Large document evaluation should be reasonable (took ${duration}ms)`);
  runner.assertTrue(result.compliant, 'Should find evidence in large document');
});

// ============================================================================
// RUN TESTS
// ============================================================================

console.log('Starting YScript Engine Test Suite...\n');
const success = await runner.run();

// Export results for CI/CD
if (typeof process !== 'undefined') {
  process.exit(success ? 0 : 1);
}
