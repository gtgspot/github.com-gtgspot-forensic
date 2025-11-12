/**
 * React Components Index
 *
 * Central export point for all React components.
 * Allows easy importing: import { FileUploader, AnalysisResults } from './components'
 *
 * @version 1.0.0
 */

export { FileUploader } from './FileUploader.jsx';
export { AnalysisResults } from './AnalysisResults.jsx';
export { DefectTimeline } from './DefectTimeline.jsx';
export { CrossReferenceMatrix } from './CrossReferenceMatrix.jsx';
export { PatternInsights } from './PatternInsights.jsx';

// Default export of all components as object
export default {
  FileUploader,
  AnalysisResults,
  DefectTimeline,
  CrossReferenceMatrix,
  PatternInsights
};
