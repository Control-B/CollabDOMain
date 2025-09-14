'use client';

import { useEffect, useState } from 'react';

export default function AnimatedDigitalSigning() {
  const [signatureProgress, setSignatureProgress] = useState(0);
  const [documentStage, setDocumentStage] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (documentStage === 0) {
        setSignatureProgress((prev) => {
          if (prev >= 100) {
            setDocumentStage(1);
            setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
              setDocumentStage(0);
              return 0;
            }, 2000);
            return 100;
          }
          return prev + 10;
        });
      }
    }, 300);

    const resetInterval = setInterval(() => {
      setSignatureProgress(0);
      setDocumentStage(0);
      setShowSuccess(false);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(resetInterval);
    };
  }, [documentStage]);

  // Cycle panel visibility to avoid covering content
  useEffect(() => {
    const t1 = setTimeout(() => setShowPanel(true), 800);
    const t2 = setTimeout(() => setShowPanel(false), 4200);
    const cycle = setInterval(() => {
      setShowPanel(true);
      const hide = setTimeout(() => setShowPanel(false), 3500);
      return () => clearTimeout(hide);
    }, 10000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(cycle);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md h-96 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Digital Signing</h3>
              <p className="text-sm opacity-90">Delivery Receipt</p>
            </div>
            <div className="text-right">
              <div
                className={`text-xs px-2 py-1 rounded-full ${
                  showSuccess
                    ? 'bg-green-500/20 text-green-100'
                    : 'bg-white/20 text-white'
                }`}
              >
                {showSuccess ? 'Completed' : 'Pending'}
              </div>
            </div>
          </div>
        </div>

        {/* Attention panel (Signing) */}
        <div
          aria-hidden="true"
          className={`absolute left-8 top-20 right-8 z-10 pointer-events-none transform transition-all duration-500 ${
            showPanel ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
        >
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-rose-400/60 to-pink-500/60 blur-lg opacity-80 animate-pulse-subtle" />
          <div className="relative bg-gradient-to-r from-rose-500 to-pink-600/90 text-white rounded-xl p-3 md:p-4 shadow-2xl ring-1 ring-white/10">
            <div className="text-sm md:text-base font-semibold tracking-wide animate-slide-up">
              Fast, compliant e-sign
            </div>
            <ul className="mt-2 text-xs md:text-sm text-white/90 list-disc list-inside space-y-1">
              <li className="animate-slide-up">Sign anywhere</li>
              <li className="animate-slide-up-delayed">
                Audit trails built-in
              </li>
              <li className="animate-slide-up-more-delayed">Tamper evidence</li>
            </ul>
          </div>
        </div>

        {/* Document */}
        <div className="flex-1 p-6 bg-gray-50 relative overflow-hidden">
          {/* Document content */}
          <div className="bg-white rounded-lg shadow-sm h-full p-4 relative">
            {/* Document header */}
            <div className="border-b border-gray-200 pb-3 mb-4">
              <h4 className="font-semibold text-gray-800">
                Delivery Confirmation
              </h4>
              <p className="text-sm text-gray-500">
                Order #12345 - ContainerPlex LLC
              </p>
            </div>

            {/* Document lines */}
            <div className="space-y-2 mb-6">
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-4/5"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded w-5/6"></div>
            </div>

            {/* Signature area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-24 relative">
              <p className="text-sm text-gray-500 mb-2">Customer Signature:</p>

              {/* Animated signature */}
              <svg
                className="absolute bottom-2 left-4 w-32 h-12"
                viewBox="0 0 128 48"
              >
                <path
                  d="M 8 24 Q 20 8 32 24 T 56 20 Q 70 32 84 20 Q 98 8 120 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="100"
                  strokeDashoffset={100 - signatureProgress}
                  className="transition-all duration-300"
                />
              </svg>
            </div>

            {/* Progress indicator */}
            {signatureProgress > 0 && signatureProgress < 100 && (
              <div className="mt-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Capturing signature...</span>
                </div>
              </div>
            )}

            {/* Success checkmark */}
            {showSuccess && (
              <div className="absolute inset-0 bg-white/95 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 opacity-90">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                  <p className="text-green-600 font-semibold">
                    Signature Captured!
                  </p>
                  <p className="text-sm text-gray-500">
                    Document signed successfully
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Floating elements */}
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center animate-float">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
          </div>

          <div className="absolute bottom-4 left-4">
            <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center animate-float [animation-delay:1s]">
              <svg
                className="w-3 h-3 text-rose-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9,12L11,14L20,5L18.5,3.5L11,11L9.5,9.5L8,11L9,12M1,1V2C1,2.55 1.45,3 2,3H14L15,2V1H1M3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V7L19,5H3Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {showSuccess ? 'Document completed' : 'Tap to sign'}
            </div>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showSuccess
                    ? 'bg-green-500 text-white'
                    : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
                disabled={showSuccess}
                title={showSuccess ? 'Document signed' : 'Sign document'}
                aria-label={showSuccess ? 'Document signed' : 'Sign document'}
              >
                {showSuccess ? 'Signed ✓' : 'Sign'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
