/**
 * Analysis Database
 *
 * IndexedDB wrapper for storing analysis results, document history,
 * and learning patterns.
 *
 * @version 1.0.0
 */

export class AnalysisDatabase {
  constructor() {
    this.dbName = 'ForensicAnalyzerDB';
    this.dbVersion = 1;
    this.db = null;
  }

  /**
   * Initialize the database
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Failed to open database');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✓ Analysis Database initialized');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains('analyses')) {
          const analysesStore = db.createObjectStore('analyses', { keyPath: 'id', autoIncrement: true });
          analysesStore.createIndex('timestamp', 'timestamp', { unique: false });
          analysesStore.createIndex('fileName', 'fileName', { unique: false });
        }

        if (!db.objectStoreNames.contains('documents')) {
          const documentsStore = db.createObjectStore('documents', { keyPath: 'id', autoIncrement: true });
          documentsStore.createIndex('timestamp', 'timestamp', { unique: false });
          documentsStore.createIndex('name', 'name', { unique: false });
        }

        if (!db.objectStoreNames.contains('patterns')) {
          const patternsStore = db.createObjectStore('patterns', { keyPath: 'id', autoIncrement: true });
          patternsStore.createIndex('type', 'type', { unique: false });
          patternsStore.createIndex('frequency', 'frequency', { unique: false });
        }
      };
    });
  }

  /**
   * Save an analysis result
   */
  async saveAnalysis(analysis) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['analyses'], 'readwrite');
      const store = transaction.objectStore('analyses');

      const analysisRecord = {
        ...analysis,
        timestamp: new Date().toISOString()
      };

      const request = store.add(analysisRecord);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all analyses
   */
  async getAllAnalyses() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['analyses'], 'readonly');
      const store = transaction.objectStore('analyses');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save a document
   */
  async saveDocument(document) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['documents'], 'readwrite');
      const store = transaction.objectStore('documents');

      const documentRecord = {
        ...document,
        timestamp: new Date().toISOString()
      };

      const request = store.add(documentRecord);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save a detected pattern
   */
  async savePattern(pattern) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['patterns'], 'readwrite');
      const store = transaction.objectStore('patterns');

      const request = store.add(pattern);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get patterns by type
   */
  async getPatternsByType(type) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['patterns'], 'readonly');
      const store = transaction.objectStore('patterns');
      const index = store.index('type');
      const request = index.getAll(type);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all data
   */
  async clearAll() {
    const storeNames = ['analyses', 'documents', 'patterns'];
    const promises = storeNames.map(storeName => {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    return Promise.all(promises);
  }
}

export default AnalysisDatabase;
