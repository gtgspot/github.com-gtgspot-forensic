#!/usr/bin/env python3
"""
Simple HTTP Server for Forensic Legal Analyzer
Serves ES6 modules with proper MIME types
Includes API endpoints for audio extraction and transcription
"""

import http.server
import socketserver
import os
import json
import tempfile
import subprocess
import shutil
import cgi
from functools import partial
from pathlib import Path
from urllib.parse import urlparse

PORT = 8000

# Check for required tools
FFMPEG_AVAILABLE = shutil.which('ffmpeg') is not None
WHISPER_AVAILABLE = shutil.which('whisper') is not None


class APIHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP Request Handler with API endpoints for audio processing"""

    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

        # Set proper MIME types for ES6 modules
        if self.path.endswith('.js') or self.path.endswith('.jsx'):
            self.send_header('Content-Type', 'application/javascript; charset=utf-8')
        elif self.path.endswith('.json'):
            self.send_header('Content-Type', 'application/json; charset=utf-8')

        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        """Handle POST requests for API endpoints"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        if path == '/api/extract-audio':
            self.handle_extract_audio()
        elif path == '/api/transcribe':
            self.handle_transcribe()
        elif path == '/api/status':
            self.handle_status()
        else:
            self.send_error(404, 'Endpoint not found')

    def handle_status(self):
        """Return server status and capabilities"""
        status = {
            'server': 'Forensic Legal Analyzer',
            'version': '2.1.0',
            'capabilities': {
                'ffmpeg': FFMPEG_AVAILABLE,
                'whisper': WHISPER_AVAILABLE,
                'audioExtraction': FFMPEG_AVAILABLE,
                'transcription': WHISPER_AVAILABLE
            }
        }
        self.send_json_response(status)

    def handle_extract_audio(self):
        """Extract audio from video file using FFmpeg"""
        if not FFMPEG_AVAILABLE:
            self.send_error_response(503, 'FFmpeg not installed. Install with: apt install ffmpeg')
            return

        try:
            # Parse multipart form data
            content_type = self.headers.get('Content-Type', '')
            if 'multipart/form-data' not in content_type:
                self.send_error_response(400, 'Expected multipart/form-data')
                return

            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={
                    'REQUEST_METHOD': 'POST',
                    'CONTENT_TYPE': content_type
                }
            )

            # Get uploaded file
            if 'file' not in form:
                self.send_error_response(400, 'No file uploaded')
                return

            file_item = form['file']
            if not file_item.file:
                self.send_error_response(400, 'Invalid file')
                return

            # Parse options
            options = {}
            if 'options' in form:
                options = json.loads(form['options'].value)

            # Create temp files
            with tempfile.NamedTemporaryFile(delete=False, suffix=self._get_extension(file_item.filename)) as input_file:
                input_file.write(file_item.file.read())
                input_path = input_file.name

            output_path = input_path + '.mp3'

            try:
                # Build FFmpeg command (speech-optimized)
                cmd = [
                    'ffmpeg', '-y',
                    '-i', input_path,
                    '-vn',                              # No video
                    '-ac', str(options.get('channels', 1)),  # Mono
                    '-ar', str(options.get('sampleRate', 16000)),  # 16kHz for Whisper
                    '-b:a', options.get('bitrate', '32k'),  # Low bitrate for speech
                    '-f', 'mp3',
                    output_path
                ]

                # Run FFmpeg
                result = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    timeout=300  # 5 minute timeout
                )

                if result.returncode != 0:
                    self.send_error_response(500, f'FFmpeg error: {result.stderr}')
                    return

                # Send extracted audio
                with open(output_path, 'rb') as audio_file:
                    audio_data = audio_file.read()

                self.send_response(200)
                self.send_header('Content-Type', 'audio/mpeg')
                self.send_header('Content-Length', len(audio_data))
                self.send_header('Content-Disposition', f'attachment; filename="extracted_audio.mp3"')
                self.end_headers()
                self.wfile.write(audio_data)

            finally:
                # Cleanup temp files
                if os.path.exists(input_path):
                    os.unlink(input_path)
                if os.path.exists(output_path):
                    os.unlink(output_path)

        except subprocess.TimeoutExpired:
            self.send_error_response(504, 'Audio extraction timed out')
        except Exception as e:
            self.send_error_response(500, f'Audio extraction failed: {str(e)}')

    def handle_transcribe(self):
        """Transcribe audio file using Whisper"""
        if not WHISPER_AVAILABLE:
            self.send_error_response(503, 'Whisper not installed. Install with: pip install openai-whisper')
            return

        try:
            # Parse multipart form data
            content_type = self.headers.get('Content-Type', '')
            if 'multipart/form-data' not in content_type:
                self.send_error_response(400, 'Expected multipart/form-data')
                return

            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={
                    'REQUEST_METHOD': 'POST',
                    'CONTENT_TYPE': content_type
                }
            )

            # Get uploaded file
            if 'file' not in form:
                self.send_error_response(400, 'No file uploaded')
                return

            file_item = form['file']
            if not file_item.file:
                self.send_error_response(400, 'Invalid file')
                return

            # Parse options
            options = {}
            if 'options' in form:
                options = json.loads(form['options'].value)

            model = options.get('model', 'base')
            language = options.get('language', 'en')

            # Create temp directory for output
            with tempfile.TemporaryDirectory() as temp_dir:
                # Save uploaded file
                input_path = os.path.join(temp_dir, file_item.filename or 'audio.mp3')
                with open(input_path, 'wb') as f:
                    f.write(file_item.file.read())

                # Build Whisper command
                cmd = [
                    'whisper',
                    input_path,
                    '--model', model,
                    '--language', language,
                    '--output_format', 'json',
                    '--output_dir', temp_dir
                ]

                # Run Whisper
                result = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    timeout=600  # 10 minute timeout
                )

                if result.returncode != 0:
                    self.send_error_response(500, f'Whisper error: {result.stderr}')
                    return

                # Find and read JSON output
                json_files = list(Path(temp_dir).glob('*.json'))
                if not json_files:
                    self.send_error_response(500, 'No transcription output generated')
                    return

                with open(json_files[0], 'r') as f:
                    whisper_output = json.load(f)

                # Format response
                response = {
                    'text': whisper_output.get('text', ''),
                    'segments': whisper_output.get('segments', []),
                    'language': whisper_output.get('language', language),
                    'duration': self._calculate_duration(whisper_output.get('segments', []))
                }

                self.send_json_response(response)

        except subprocess.TimeoutExpired:
            self.send_error_response(504, 'Transcription timed out')
        except Exception as e:
            self.send_error_response(500, f'Transcription failed: {str(e)}')

    def send_json_response(self, data, status=200):
        """Send JSON response"""
        response = json.dumps(data)
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(response))
        self.end_headers()
        self.wfile.write(response.encode('utf-8'))

    def send_error_response(self, status, message):
        """Send JSON error response"""
        self.send_json_response({'error': True, 'message': message}, status)

    def _get_extension(self, filename):
        """Get file extension from filename"""
        if filename:
            return os.path.splitext(filename)[1] or '.tmp'
        return '.tmp'

    def _calculate_duration(self, segments):
        """Calculate total duration from segments"""
        if not segments:
            return 0
        return max(seg.get('end', 0) for seg in segments)


if __name__ == '__main__':
    Handler = partial(APIHandler, directory=os.getcwd())

    # Check tool availability
    tools_status = []
    if FFMPEG_AVAILABLE:
        tools_status.append("FFmpeg: Available")
    else:
        tools_status.append("FFmpeg: Not installed (run: apt install ffmpeg)")

    if WHISPER_AVAILABLE:
        tools_status.append("Whisper: Available")
    else:
        tools_status.append("Whisper: Not installed (run: pip install openai-whisper)")

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"""
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║       Forensic Legal Analyzer v2.1 - Development Server        ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

Server running at: http://localhost:{PORT}

Available endpoints:
   http://localhost:{PORT}/index-modular.html  (Modular Version)
   http://localhost:{PORT}/index.html          (Original Version)

API endpoints:
   POST /api/extract-audio   (Extract audio from video)
   POST /api/transcribe      (Transcribe audio with Whisper)
   POST /api/status          (Check server capabilities)

Audio processing tools:
   {chr(10).join('   ' + s for s in tools_status)}

Module locations:
   /src/main.jsx              (Main Application)
   /src/analyzers/            (Analysis Engines)
   /src/storage/              (Data Storage)
   /src/utils/                (Utilities)
   /src/data/                 (Statute Database)

Press Ctrl+C to stop the server
        """)

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServer stopped")
            pass
