/**
 * Text Extractor Utility
 *
 * Extracts text from various file formats (PDF, DOCX, images, plain text).
 * Uses Tesseract.js for OCR, PDF.js for PDFs, and Mammoth for DOCX.
 *
 * @version 1.0.0
 */

export class TextExtractor {
  constructor() {
    // Document formats
    this.documentFormats = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'image/jpg'
    ];

    // Audio formats (for transcription)
    this.audioFormats = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/x-wav',
      'audio/ogg',
      'audio/webm',
      'audio/m4a',
      'audio/x-m4a',
      'audio/aac',
      'audio/flac'
    ];

    // Video formats (extract audio then transcribe)
    this.videoFormats = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-matroska'
    ];

    this.supportedFormats = [
      ...this.documentFormats,
      ...this.audioFormats,
      ...this.videoFormats
    ];
  }

  /**
   * Check if file is audio
   * @param {string} mimeType - MIME type
   * @returns {boolean} True if audio
   */
  isAudio(mimeType) {
    return mimeType.startsWith('audio/');
  }

  /**
   * Check if file is video
   * @param {string} mimeType - MIME type
   * @returns {boolean} True if video
   */
  isVideo(mimeType) {
    return mimeType.startsWith('video/');
  }

  /**
   * Check if file is audio or video
   * @param {string} mimeType - MIME type
   * @returns {boolean} True if audio/video
   */
  isAudioVideo(mimeType) {
    return this.isAudio(mimeType) || this.isVideo(mimeType);
  }

  /**
   * Extract text from a file
   * @param {File} file - File object
   * @param {Function} onProgress - Optional progress callback for audio/video
   * @returns {Promise<string>} Extracted text
   */
  async extractText(file, onProgress = null) {
    if (!this.isSupported(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }

    const fileType = file.type;

    // Handle audio/video files with AudioExtractor
    if (this.isAudioVideo(fileType)) {
      return await this.extractFromAudioVideo(file, onProgress);
    }

    if (fileType === 'text/plain') {
      return await this.extractFromText(file);
    } else if (fileType === 'application/pdf') {
      return await this.extractFromPDF(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await this.extractFromDOCX(file);
    } else if (fileType.startsWith('image/')) {
      return await this.extractFromImage(file);
    }

    throw new Error(`No extractor available for ${fileType}`);
  }

  /**
   * Check if file type is supported
   * @param {string} mimeType - MIME type
   * @returns {boolean} True if supported
   */
  isSupported(mimeType) {
    return this.supportedFormats.includes(mimeType) ||
           mimeType.startsWith('audio/') ||
           mimeType.startsWith('video/');
  }

  /**
   * Extract text from plain text file
   * @param {File} file - Text file
   * @returns {Promise<string>} Extracted text
   */
  async extractFromText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  /**
   * Extract text from PDF file
   * @param {File} file - PDF file
   * @returns {Promise<string>} Extracted text
   */
  async extractFromPDF(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }

      return fullText;
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  /**
   * Extract text from DOCX file
   * @param {File} file - DOCX file
   * @returns {Promise<string>} Extracted text
   */
  async extractFromDOCX(file) {
    try {
      if (typeof mammoth === 'undefined') {
        throw new Error('Mammoth.js not loaded');
      }

      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
      return result.value;
    } catch (error) {
      console.error('DOCX extraction error:', error);
      throw new Error('Failed to extract text from DOCX');
    }
  }

  /**
   * Extract text from image using OCR
   * @param {File} file - Image file
   * @returns {Promise<string>} Extracted text
   */
  async extractFromImage(file) {
    try {
      if (typeof Tesseract === 'undefined') {
        throw new Error('Tesseract.js not loaded');
      }

      const { data: { text } } = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: m => console.log(m)
        }
      );

      return text;
    } catch (error) {
      console.error('OCR extraction error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  /**
   * Extract text from audio/video file via transcription
   * @param {File} file - Audio or video file
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<string>} Transcribed text
   */
  async extractFromAudioVideo(file, onProgress = null) {
    try {
      // Dynamically import AudioExtractor
      const { AudioExtractor } = await import('./audioExtractor.js');
      const audioExtractor = new AudioExtractor();

      const result = await audioExtractor.extractText(file, onProgress);

      // Return just the text for compatibility with existing code
      // The full result object (with segments, timestamps) is available
      // when calling AudioExtractor directly
      return result.text;
    } catch (error) {
      console.error('Audio/video transcription error:', error);
      throw new Error(`Failed to transcribe ${this.isVideo(file.type) ? 'video' : 'audio'}: ${error.message}`);
    }
  }
}

export default TextExtractor;
