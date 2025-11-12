/**
 * React App Example
 *
 * Complete example showing how to integrate all Forensic Legal Analyzer
 * React components into a single application.
 *
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Import all components
import {
  FileUploader,
  AnalysisResults,
  DefectTimeline,
  CrossReferenceMatrix,
  PatternInsights
} from '../src/components/index.js';

// Import the main analyzer
import ForensicAnalyzer from '../src/main.jsx';

/**
 * Main App Component
 */
function ForensicAnalyzerApp() {
  const [currentFile, setCurrentFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [timeline, setTimeline] = useState(null);
  const [crossRef, setCrossRef] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // upload, results, timeline, crossref, patterns

  // Initialize the analyzer on mount
  useEffect(() => {
    const init = async () => {
      try {
        await ForensicAnalyzer.initialize();
        console.log('Forensic Analyzer initialized');

        // Load analysis history
        const history = await ForensicAnalyzer.getAnalysisHistory();
        setAnalysisHistory(history || []);
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to initialize analyzer');
      }
    };

    init();
  }, []);

  /**
   * Handle file upload and processing
   */
  const handleFileProcessed = async (fileData) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      setCurrentFile(fileData);

      // Add document to collection
      const newDocuments = [...documents, fileData];
      setDocuments(newDocuments);

      // Analyze the document
      const analysisResult = await ForensicAnalyzer.analyzeDocument(fileData.text, {
        presets: [1, 2, 3, 4, 5, 6, 7, 8], // All presets
        allDocuments: newDocuments
      });

      setAnalysis(analysisResult);

      // Extract timeline
      if (analysisResult.timeline) {
        setTimeline(analysisResult.timeline);
      }

      // Get patterns
      const detectedPatterns = await ForensicAnalyzer.getPatterns();
      setPatterns(detectedPatterns || []);

      // If multiple documents, run cross-reference
      if (newDocuments.length >= 2) {
        const crossRefResult = await ForensicAnalyzer.runCrossReference(newDocuments);
        setCrossRef(crossRefResult);
      }

      // Update history
      const history = await ForensicAnalyzer.getAnalysisHistory();
      setAnalysisHistory(history || []);

      // Switch to results tab
      setActiveTab('results');

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Handle file upload error
   */
  const handleFileError = (err) => {
    setError(err.message || 'File processing failed');
  };

  /**
   * Handle export
   */
  const handleExport = async (format) => {
    try {
      const fileName = `forensic-analysis-${Date.now()}.${format}`;
      await ForensicAnalyzer.exportAnalysis(format, fileName);
      console.log(`Exported to ${fileName}`);
    } catch (err) {
      console.error('Export error:', err);
      setError('Export failed');
    }
  };

  /**
   * Get findings for timeline
   */
  const getAllFindings = () => {
    if (!analysis || !analysis.phases || !analysis.phases.presetAnalysis) {
      return [];
    }

    const findings = [];
    analysis.phases.presetAnalysis.forEach(preset => {
      if (preset.findings) {
        preset.findings.forEach(finding => {
          findings.push({
            ...finding,
            presetName: preset.presetName
          });
        });
      }
    });

    return findings;
  };

  return (
    <div className="forensic-analyzer-app">
      {/* Header */}
      <header className="app-header">
        <h1>🔬 Forensic Legal Analyzer</h1>
        <p className="subtitle">Victorian Legal Document Analysis v2.0</p>
      </header>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
          <button className="error-close" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Loading Indicator */}
      {isAnalyzing && (
        <div className="loading-banner">
          <div className="spinner"></div>
          <span>Analyzing document...</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="app-tabs">
        <button
          className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload
        </button>
        <button
          className={`tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
          disabled={!analysis}
        >
          📋 Results {analysis && `(${analysis.summary?.totalFindings || 0})`}
        </button>
        <button
          className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
          disabled={!timeline && getAllFindings().length === 0}
        >
          📅 Timeline
        </button>
        <button
          className={`tab ${activeTab === 'crossref' ? 'active' : ''}`}
          onClick={() => setActiveTab('crossref')}
          disabled={documents.length < 2}
        >
          🔗 Cross-Reference {documents.length >= 2 && `(${documents.length} docs)`}
        </button>
        <button
          className={`tab ${activeTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveTab('patterns')}
          disabled={patterns.length === 0}
        >
          🧠 Patterns {patterns.length > 0 && `(${patterns.length})`}
        </button>
      </nav>

      {/* Main Content */}
      <main className="app-content">
        {activeTab === 'upload' && (
          <section className="tab-content">
            <FileUploader
              onFileProcessed={handleFileProcessed}
              onError={handleFileError}
            />

            {documents.length > 0 && (
              <div className="uploaded-documents">
                <h3>📁 Uploaded Documents ({documents.length})</h3>
                <ul className="document-list">
                  {documents.map((doc, idx) => (
                    <li key={idx} className="document-item">
                      <span className="doc-icon">📄</span>
                      <span className="doc-name">{doc.name}</span>
                      <span className="doc-size">({Math.round(doc.size / 1024)} KB)</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {activeTab === 'results' && (
          <section className="tab-content">
            <AnalysisResults
              analysis={analysis}
              onExport={handleExport}
            />
          </section>
        )}

        {activeTab === 'timeline' && (
          <section className="tab-content">
            <DefectTimeline
              timeline={timeline}
              findings={getAllFindings()}
            />
          </section>
        )}

        {activeTab === 'crossref' && (
          <section className="tab-content">
            <CrossReferenceMatrix
              crossRefData={crossRef}
              documents={documents}
            />
          </section>
        )}

        {activeTab === 'patterns' && (
          <section className="tab-content">
            <PatternInsights
              patterns={patterns}
              analysisHistory={analysisHistory}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Forensic Legal Analyzer v2.0.0 | Victorian Jurisdiction | Modular Architecture</p>
      </footer>

      <style jsx>{`
        .forensic-analyzer-app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .app-header {
          background: white;
          padding: 30px 20px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .app-header h1 {
          margin: 0;
          font-size: 28px;
          color: #2d3748;
        }

        .subtitle {
          margin: 5px 0 0;
          color: #718096;
          font-size: 14px;
        }

        .error-banner {
          background: #fed7d7;
          color: #742a2a;
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 2px solid #fc8181;
        }

        .error-icon {
          font-size: 20px;
        }

        .error-message {
          flex: 1;
          font-weight: 500;
        }

        .error-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #742a2a;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
        }

        .loading-banner {
          background: #bee3f8;
          color: #2c5282;
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          justify-content: center;
          font-weight: 500;
        }

        .spinner {
          border: 3px solid rgba(44, 82, 130, 0.3);
          border-top: 3px solid #2c5282;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .app-tabs {
          display: flex;
          background: white;
          padding: 0 20px;
          gap: 5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .tab {
          padding: 12px 20px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #718096;
          transition: all 0.2s ease;
        }

        .tab:hover:not(:disabled) {
          color: #667eea;
          background: #f7fafc;
        }

        .tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }

        .tab:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .app-content {
          flex: 1;
          padding: 30px 20px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        .tab-content {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .uploaded-documents {
          margin-top: 30px;
          padding: 20px;
          background: #f7fafc;
          border-radius: 8px;
        }

        .uploaded-documents h3 {
          margin: 0 0 15px;
          font-size: 16px;
          color: #2d3748;
        }

        .document-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .document-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: white;
          border-radius: 6px;
          font-size: 14px;
        }

        .doc-icon {
          font-size: 18px;
        }

        .doc-name {
          flex: 1;
          font-weight: 500;
          color: #2d3748;
        }

        .doc-size {
          color: #718096;
          font-size: 12px;
        }

        .app-footer {
          background: white;
          padding: 20px;
          text-align: center;
          color: #718096;
          font-size: 12px;
          box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
        }

        .app-footer p {
          margin: 0;
        }
      `}</style>
    </div>
  );
}

// Mount the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ForensicAnalyzerApp />);

export default ForensicAnalyzerApp;
