/**
 * Audio Extractor Utility
 *
 * Extracts audio from video files and transcribes speech to text.
 * Uses server-side FFmpeg for audio extraction and Whisper for transcription.
 *
 * @version 1.0.0
 */

export class AudioExtractor {
  constructor(options = {}) {
    this.serverUrl = options.serverUrl || '';
    this.whisperModel = options.whisperModel || 'base';
    this.language = options.language || 'en';

    // Supported audio formats for direct transcription
    this.audioFormats = [
      'audio/mpeg',        // .mp3
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

    // Supported video formats for audio extraction
    this.videoFormats = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',   // .mov
      'video/x-msvideo',   // .avi
      'video/x-matroska'   // .mkv
    ];

    this.supportedFormats = [...this.audioFormats, ...this.videoFormats];
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
   * Check if file is a video (needs audio extraction)
   * @param {string} mimeType - MIME type
   * @returns {boolean} True if video
   */
  isVideo(mimeType) {
    return mimeType.startsWith('video/');
  }

  /**
   * Check if file is audio (direct transcription)
   * @param {string} mimeType - MIME type
   * @returns {boolean} True if audio
   */
  isAudio(mimeType) {
    return mimeType.startsWith('audio/');
  }

  /**
   * Extract audio from video file
   * @param {File} file - Video file
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Blob>} Extracted audio as MP3 blob
   */
  async extractAudioFromVideo(file, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify({
      format: 'mp3',
      channels: 1,       // Mono for speech
      sampleRate: 16000, // 16kHz optimal for Whisper
      bitrate: '32k'     // Speech-optimized
    }));

    try {
      if (onProgress) onProgress({ stage: 'uploading', progress: 0 });

      const response = await fetch(`${this.serverUrl}/api/extract-audio`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Audio extraction failed');
      }

      if (onProgress) onProgress({ stage: 'extracting', progress: 50 });

      const audioBlob = await response.blob();

      if (onProgress) onProgress({ stage: 'complete', progress: 100 });

      return audioBlob;
    } catch (error) {
      console.error('Audio extraction error:', error);
      throw new Error(`Failed to extract audio: ${error.message}`);
    }
  }

  /**
   * Transcribe audio file to text
   * @param {File|Blob} audio - Audio file or blob
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} Transcription result with text and metadata
   */
  async transcribeAudio(audio, onProgress = null) {
    const formData = new FormData();
    formData.append('file', audio, audio.name || 'audio.mp3');
    formData.append('options', JSON.stringify({
      model: this.whisperModel,
      language: this.language,
      outputFormat: 'all'  // Get all output formats
    }));

    try {
      if (onProgress) onProgress({ stage: 'uploading', progress: 0 });

      const response = await fetch(`${this.serverUrl}/api/transcribe`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Transcription failed');
      }

      if (onProgress) onProgress({ stage: 'transcribing', progress: 50 });

      const result = await response.json();

      if (onProgress) onProgress({ stage: 'complete', progress: 100 });

      return result;
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    }
  }

  /**
   * Extract text from audio/video file (main entry point)
   * @param {File} file - Audio or video file
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} Transcription result
   */
  async extractText(file, onProgress = null) {
    if (!this.isSupported(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }

    let audioSource = file;

    // If video, extract audio first
    if (this.isVideo(file.type)) {
      if (onProgress) onProgress({ stage: 'extracting_audio', progress: 0 });

      const audioBlob = await this.extractAudioFromVideo(file, (p) => {
        if (onProgress) {
          onProgress({
            stage: 'extracting_audio',
            progress: p.progress * 0.3  // 0-30%
          });
        }
      });

      audioSource = new File([audioBlob], `${file.name}.mp3`, { type: 'audio/mpeg' });
    }

    // Transcribe audio
    if (onProgress) onProgress({ stage: 'transcribing', progress: 30 });

    const result = await this.transcribeAudio(audioSource, (p) => {
      if (onProgress) {
        onProgress({
          stage: 'transcribing',
          progress: 30 + (p.progress * 0.7)  // 30-100%
        });
      }
    });

    return {
      text: result.text,
      segments: result.segments || [],
      language: result.language || this.language,
      duration: result.duration,
      sourceFile: file.name,
      sourceType: file.type,
      transcribedAt: new Date().toISOString()
    };
  }

  /**
   * Format transcription with timestamps
   * @param {Object} result - Transcription result
   * @returns {string} Formatted transcript with timestamps
   */
  formatWithTimestamps(result) {
    if (!result.segments || result.segments.length === 0) {
      return result.text;
    }

    return result.segments.map(segment => {
      const start = this.formatTime(segment.start);
      const end = this.formatTime(segment.end);
      return `[${start} --> ${end}] ${segment.text}`;
    }).join('\n');
  }

  /**
   * Format seconds to timestamp string
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time (HH:MM:SS)
   */
  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Get file info without processing
   * @param {File} file - Audio or video file
   * @returns {Promise<Object>} File metadata
   */
  async getFileInfo(file) {
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      isAudio: this.isAudio(file.type),
      isVideo: this.isVideo(file.type),
      isSupported: this.isSupported(file.type)
    };
  }
}

export default AudioExtractor;
