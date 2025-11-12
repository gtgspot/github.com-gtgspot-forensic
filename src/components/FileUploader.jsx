/**
 * File Uploader Component
 *
 * React component for uploading and processing legal documents.
 * Supports drag-and-drop, multiple file formats, and real-time status updates.
 *
 * @version 1.0.0
 */

import React, { useState, useRef } from 'react';

export const FileUploader = ({ onFileProcessed, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const supportedFormats = [
    '.pdf', '.docx', '.txt', '.png', '.jpg', '.jpeg'
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file) => {
    setIsProcessing(true);
    setProgress(0);
    setUploadedFile(file);

    try {
      // Simulate progress
      setProgress(20);

      // Import TextExtractor dynamically
      const { TextExtractor } = await import('../utils/textExtractor.js');
      const extractor = new TextExtractor();

      setProgress(40);

      // Check if file type is supported
      if (!extractor.isSupported(file.type)) {
        throw new Error(`Unsupported file type: ${file.type}`);
      }

      setProgress(60);

      // Extract text
      const text = await extractor.extractText(file);

      setProgress(100);

      // Callback with processed file
      if (onFileProcessed) {
        onFileProcessed({
          name: file.name,
          type: file.type,
          size: file.size,
          text: text,
          uploadedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('File processing error:', error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-uploader">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={supportedFormats.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {!isProcessing && !uploadedFile && (
          <>
            <div className="upload-icon">📄</div>
            <div className="upload-text">Drag & drop file here</div>
            <div className="upload-hint">or click to browse</div>
            <div className="upload-formats">
              Supports: PDF, DOCX, TXT, PNG, JPG
            </div>
          </>
        )}

        {isProcessing && (
          <div className="processing-state">
            <div className="spinner"></div>
            <div className="processing-text">Processing {uploadedFile?.name}...</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-text">{progress}%</div>
          </div>
        )}

        {!isProcessing && uploadedFile && (
          <div className="success-state">
            <div className="success-icon">✅</div>
            <div className="success-text">File processed successfully!</div>
            <div className="file-info">
              {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
            </div>
            <button
              className="upload-another-btn"
              onClick={(e) => {
                e.stopPropagation();
                setUploadedFile(null);
              }}
            >
              Upload Another File
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .file-uploader {
          width: 100%;
        }

        .upload-area {
          border: 3px dashed #cbd5e0;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fff;
        }

        .upload-area:hover {
          border-color: #667eea;
          background: #f7fafc;
        }

        .upload-area.dragging {
          border-color: #48bb78;
          background: #f0fff4;
        }

        .upload-area.processing {
          cursor: default;
        }

        .upload-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .upload-text {
          color: #4a5568;
          font-size: 16px;
          margin-bottom: 10px;
          font-weight: 500;
        }

        .upload-hint {
          color: #a0aec0;
          font-size: 14px;
          margin-bottom: 15px;
        }

        .upload-formats {
          color: #718096;
          font-size: 13px;
          margin-top: 10px;
        }

        .processing-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .spinner {
          border: 4px solid #e2e8f0;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .processing-text {
          color: #4a5568;
          font-size: 14px;
        }

        .progress-bar {
          width: 100%;
          max-width: 300px;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
        }

        .progress-text {
          color: #718096;
          font-size: 12px;
        }

        .success-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .success-icon {
          font-size: 48px;
        }

        .success-text {
          color: #48bb78;
          font-size: 16px;
          font-weight: 600;
        }

        .file-info {
          color: #718096;
          font-size: 14px;
        }

        .upload-another-btn {
          margin-top: 10px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .upload-another-btn:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default FileUploader;
