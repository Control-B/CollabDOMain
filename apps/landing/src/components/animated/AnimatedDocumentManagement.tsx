'use client';

import { useEffect, useState } from 'react';

export default function AnimatedDocumentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const documents = [
    {
      id: 1,
      name: 'BOL_12345.pdf',
      type: 'Bill of Lading',
      status: 'Signed',
      date: '2024-09-14',
    },
    {
      id: 2,
      name: 'POD_TRK001.pdf',
      type: 'Proof of Delivery',
      status: 'Pending',
      date: '2024-09-14',
    },
    {
      id: 3,
      name: 'Invoice_ABC123.pdf',
      type: 'Invoice',
      status: 'Approved',
      date: '2024-09-13',
    },
    {
      id: 4,
      name: 'Gate_Pass_789.pdf',
      type: 'Gate Pass',
      status: 'Active',
      date: '2024-09-13',
    },
  ];

  useEffect(() => {
    const searchInterval = setInterval(() => {
      const queries = ['BOL', 'Invoice', 'POD', 'Gate'];
      setSearchQuery(queries[Math.floor(Math.random() * queries.length)]);
      setTimeout(() => setSearchQuery(''), 2000);
    }, 5000);

    const uploadInterval = setInterval(() => {
      setShowUpload(true);
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
              setShowUpload(false);
              setUploadProgress(0);
            }, 1000);
            return 100;
          }
          return prev + 20;
        });
      }, 200);
    }, 8000);

    return () => {
      clearInterval(searchInterval);
      clearInterval(uploadInterval);
    };
  }, []);

  // Cycle attention panel
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

  const filteredDocs = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg h-96 flex flex-col relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Document Manager</h3>
              <p className="text-sm opacity-90">{documents.length} documents</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                title="Upload document"
                aria-label="Upload document"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              readOnly
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-500 bg-gray-50"
            />
          </div>
        </div>

        {/* Attention panel (Documents) */}
        <div
          aria-hidden="true"
          className={`absolute left-4 bottom-24 md:bottom-20 w-[80%] max-w-lg z-10 pointer-events-none transform transition-all duration-500 ${
            showPanel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400/60 to-orange-500/60 blur-lg opacity-80 animate-pulse-subtle" />
          <div className="relative bg-gradient-to-r from-amber-500 to-orange-600/90 text-white rounded-xl p-3 md:p-4 shadow-2xl ring-1 ring-white/10">
            <div className="text-sm md:text-base font-semibold tracking-wide animate-slide-up">
              All docs, one place
            </div>
            <ul className="mt-2 text-xs md:text-sm text-white/90 list-disc list-inside space-y-1">
              <li className="animate-slide-up">Instant search</li>
              <li className="animate-slide-up-delayed">
                Auto-sync across teams
              </li>
              <li className="animate-slide-up-more-delayed">Version history</li>
            </ul>
          </div>
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-4 space-y-3">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                  selectedDoc === doc.id
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } animate-slide-in-left`}
                onClick={() =>
                  setSelectedDoc(selectedDoc === doc.id ? null : doc.id)
                }
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-amber-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500">{doc.type}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        doc.status === 'Signed'
                          ? 'bg-green-100 text-green-800'
                          : doc.status === 'Approved'
                          ? 'bg-blue-100 text-blue-800'
                          : doc.status === 'Active'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {doc.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{doc.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Progress */}
        {showUpload && (
          <div className="p-4 border-t border-gray-100 bg-blue-50 animate-slide-in-left">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Uploading scan_receipt.pdf
                </p>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-blue-600 h-2 rounded-full transition-all duration-200 progress-${uploadProgress}`}
                  ></div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="text-sm text-gray-600">{uploadProgress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Total: {documents.length} files</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full opacity-80"></div>
                <span>Synced</span>
              </span>
              <span>Updated just now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
