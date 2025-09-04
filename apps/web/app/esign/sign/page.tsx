'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function SignPage() {
  const router = useRouter();
  // Start on the signature step so users can immediately see/draw their signature
  const [step, setStep] = useState<'upload' | 'sign' | 'complete'>('sign');
  const [documentName, setDocumentName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Default to auto-generated signature; user can switch to draw or initials
  const [signatureType, setSignatureType] = useState<
    'draw' | 'generate' | 'initials' | null
  >('generate');
  const [drawnSignature, setDrawnSignature] = useState<string | null>(null);
  const [generatedSignature, setGeneratedSignature] = useState<string | null>(
    null,
  );
  const [generatedInitials, setGeneratedInitials] = useState<string | null>(
    null,
  );
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Drawing functions for signature pad
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Ensure visible stroke on light background
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#111';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setDrawnSignature(canvas.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setDrawnSignature(null);
    }
  };

  const generateSignature = () => {
    if (!signerName.trim()) {
      // If name is cleared, clear the generated signature preview as well
      setGeneratedSignature(null);
      return;
    }

    // Create a canvas for generated signature
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // White background so black signature is visible in dark UI
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Signature text
      ctx.font = '36px cursive';
      ctx.fillStyle = '#111111';
      ctx.textAlign = 'center';
      ctx.fillText(signerName, canvas.width / 2, canvas.height / 2 + 10);
      setGeneratedSignature(canvas.toDataURL());
    }
  };

  const initialsFromName = (name: string) => {
    const raw = name.trim();
    if (!raw) return '';
    const parts = raw.split(/\s+/).filter(Boolean);
    if (parts.length > 1) {
      // Multi-word input: use first letter of each word
      return parts
        .map((p) => p[0] || '')
        .join('')
        .toUpperCase();
    }
    // Single-token input: treat as literal initials and show all letters typed
    return raw.replace(/[^A-Za-z]/g, '').toUpperCase();
  };

  const generateInitials = () => {
    const initials = initialsFromName(signerName);
    if (!initials) {
      setGeneratedInitials(null);
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // White background so black initials are visible in dark UI
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Adjust font size based on length to keep it legible
      const len = initials.length;
      let fontSize = 56;
      if (len >= 6) fontSize = 28;
      else if (len === 5) fontSize = 32;
      else if (len === 4) fontSize = 36;
      else if (len === 3) fontSize = 44;
      ctx.font = `bold ${fontSize}px Georgia, Times, serif`;
      ctx.fillStyle = '#111111';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initials, canvas.width / 2, canvas.height / 2);
      setGeneratedInitials(canvas.toDataURL());
    }
  };

  // Auto-generate signature preview as user types when in 'generate' mode
  useEffect(() => {
    if (signatureType === 'generate') {
      generateSignature();
    } else if (signatureType === 'initials') {
      generateInitials();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signerName, signatureType]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setDocumentName(file.name);
    } else {
      alert('Please select a PDF file');
    }
  };

  const proceedToSign = () => {
    if (!selectedFile) {
      alert('Please upload a document first');
      return;
    }
    setStep('sign');
  };

  const completeSignature = () => {
    if (!drawnSignature && !generatedSignature) {
      alert('Please create a signature first');
      return;
    }
    if (!signerName.trim() || !signerEmail.trim()) {
      alert('Please fill in all signer information');
      return;
    }
    setStep('complete');
  };

  const resetProcess = () => {
    setStep('upload');
    setDocumentName('');
    setSelectedFile(null);
    setSignatureType(null);
    setDrawnSignature(null);
    setGeneratedSignature(null);
    setGeneratedInitials(null);
    setSignerName('');
    setSignerEmail('');
    clearCanvas();
  };

  const deleteSignature = () => {
    // Remove any signature artifacts from this session
    setDrawnSignature(null);
    setGeneratedSignature(null);
    setGeneratedInitials(null);
    clearCanvas();
  };

  const cancelSignature = () => {
    // Discard progress and return to dashboard
    resetProcess();
    router.push('/esign');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-100">
                Create Signature
              </h1>
              <p className="text-sm text-gray-400">
                Upload document and add your signature
              </p>
            </div>
            <Link href="/esign" className="text-blue-400 hover:text-blue-300">
              ← Back to E-Sign
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div
                className={`flex items-center ${step === 'upload' ? 'text-blue-600' : step === 'sign' || step === 'complete' ? 'text-green-600' : 'text-gray-400'}`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step === 'upload' ? 'border-blue-600 bg-blue-600 text-white' : step === 'sign' || step === 'complete' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-700'}`}
                >
                  1
                </div>
                <span className="ml-2 text-sm font-medium">
                  Upload Document
                </span>
              </div>
              <div
                className={`w-16 h-px mx-4 ${step === 'sign' || step === 'complete' ? 'bg-green-600' : 'bg-gray-700'}`}
              ></div>
              <div
                className={`flex items-center ${step === 'sign' ? 'text-blue-600' : step === 'complete' ? 'text-green-600' : 'text-gray-400'}`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step === 'sign' ? 'border-blue-600 bg-blue-600 text-white' : step === 'complete' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-700'}`}
                >
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Add Signature</span>
              </div>
              <div
                className={`w-16 h-px mx-4 ${step === 'complete' ? 'bg-green-600' : 'bg-gray-700'}`}
              ></div>
              <div
                className={`flex items-center ${step === 'complete' ? 'text-green-600' : 'text-gray-400'}`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step === 'complete' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-700'}`}
                >
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Complete</span>
              </div>
            </div>
          </div>

          {/* Step 1: Upload Document (optional to do first) */}
          {step === 'upload' && (
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-100 mb-4">
                Upload Document
              </h2>

              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-100">
                      {selectedFile
                        ? selectedFile.name
                        : 'Upload a PDF document'}
                    </span>
                    <span className="mt-1 block text-sm text-gray-400">
                      PDF files only, up to 10MB
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>

              {selectedFile && (
                <div className="mt-4 p-4 bg-green-900/20 border border-green-800 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-300">
                        Document uploaded successfully: {selectedFile.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep('sign')}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 px-4 rounded-md transition-colors"
                >
                  Go to Signature
                </button>
                <button
                  onClick={proceedToSign}
                  disabled={!selectedFile}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Proceed to Signature
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Add Signature */}
          {step === 'sign' && (
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-100 mb-4">
                Add Your Signature
              </h2>

              {/* Signer Information */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="signer-name"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="signer-name"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="signer-email"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="signer-email"
                    value={signerEmail}
                    onChange={(e) => setSignerEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Signature Type Selection */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-100 mb-3">
                  Choose Signature Method
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setSignatureType('draw')}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      signatureType === 'draw'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg
                        className="h-6 w-6 text-blue-600 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      <div>
                        <h4 className="font-medium text-gray-100">
                          Draw Signature
                        </h4>
                        <p className="text-sm text-gray-400">
                          Use mouse or touch to draw
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setSignatureType('generate')}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      signatureType === 'generate'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg
                        className="h-6 w-6 text-green-600 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h2zM9 12l2 2 4-4"
                        />
                      </svg>
                      <div>
                        <h4 className="font-medium text-gray-100">
                          Auto-Generate
                        </h4>
                        <p className="text-sm text-gray-400">
                          Create from your typed name
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setSignatureType('initials')}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      signatureType === 'initials'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg
                        className="h-6 w-6 text-purple-600 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7 1 1 0 001 1h12a1 1 0 001-1 7 7 0 00-7-7z"
                        />
                      </svg>
                      <div>
                        <h4 className="font-medium text-gray-100">Initials</h4>
                        <p className="text-sm text-gray-400">
                          Auto-generate from your name
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Draw Signature */}
              {signatureType === 'draw' && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-100 mb-3">
                    Draw Your Signature
                  </h4>
                  <div className="border-2 border-gray-700 rounded-lg p-4 bg-gray-900">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={200}
                      className="border border-gray-800 rounded cursor-crosshair w-full touch-none bg-white"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                    <div className="mt-3 flex justify-between">
                      <button
                        onClick={clearCanvas}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Clear Signature
                      </button>
                      <p className="text-xs text-gray-400">
                        Click and drag to draw your signature
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Generate Signature (auto-updates as you type your name) */}
              {signatureType === 'generate' && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-100 mb-3">
                    Generate Signature
                  </h4>
                  <p className="text-sm text-gray-300 mb-3">
                    Type your name above. A signature preview is generated
                    automatically. You can also switch to &ldquo;Draw
                    Signature&rdquo;.
                  </p>
                  {generatedSignature && (
                    <div className="mt-4 p-4 border border-gray-800 rounded-lg bg-gray-900">
                      <p className="text-sm text-gray-300 mb-2">
                        Generated Signature:
                      </p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={generatedSignature}
                        alt="Generated Signature"
                        className="max-w-xs border border-gray-800 bg-white p-2 rounded"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Initials */}
              {signatureType === 'initials' && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-100 mb-3">
                    Initials
                  </h4>
                  <p className="text-sm text-gray-300 mb-3">
                    We auto-generate your initials from your name. You can
                    switch to Draw to handwrite if preferred.
                  </p>
                  {generatedInitials && (
                    <div className="mt-4 p-4 border border-gray-800 rounded-lg bg-gray-900 inline-block">
                      <p className="text-sm text-gray-300 mb-2">
                        Generated Initials:
                      </p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={generatedInitials}
                        alt="Generated Initials"
                        className="max-w-[200px] border border-gray-800 bg-white p-2 rounded"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep('upload')}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 px-4 rounded-md transition-colors"
                  >
                    Upload Document
                  </button>
                  {selectedFile && (
                    <span className="text-sm text-gray-300">
                      Selected: {selectedFile.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={deleteSignature}
                    disabled={
                      !drawnSignature &&
                      !generatedSignature &&
                      !generatedInitials
                    }
                    className="py-2 px-4 rounded-md transition-colors border border-red-700/60 text-red-300 hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete the current signature"
                  >
                    Delete Signature
                  </button>
                  <button
                    onClick={cancelSignature}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={completeSignature}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Complete Signature
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {step === 'complete' && (
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6 text-center">
              <div className="mb-6">
                <svg
                  className="mx-auto h-16 w-16 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">
                Signature Complete!
              </h2>
              <p className="text-gray-300 mb-6">
                Your document &ldquo;{documentName}&rdquo; has been successfully
                signed by {signerName}.
              </p>

              <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-800">
                <h3 className="font-medium text-gray-100 mb-2">
                  Signature Details:
                </h3>
                <div className="text-left text-sm text-gray-300 space-y-1">
                  <p>
                    <strong>Signer:</strong> {signerName}
                  </p>
                  <p>
                    <strong>Email:</strong> {signerEmail}
                  </p>
                  <p>
                    <strong>Document:</strong> {documentName}
                  </p>
                  <p>
                    <strong>Signed:</strong> {new Date().toLocaleString()}
                  </p>
                  <p>
                    <strong>Method:</strong>{' '}
                    {signatureType === 'draw'
                      ? 'Hand-drawn'
                      : signatureType === 'initials'
                        ? 'Initials (auto-generated)'
                        : 'Auto-generated'}
                  </p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetProcess}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
                >
                  Sign Another Document
                </button>
                <Link
                  href="/esign"
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-md transition-colors"
                >
                  Back to E-Sign Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
