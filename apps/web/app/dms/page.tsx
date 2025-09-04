'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  addDocumentFromFile,
  deleteDocument,
  loadDocuments,
  replaceDocument,
  setDocumentPinned,
  type DocumentItem,
} from '../lib/documentsStore';
import DocumentEditorModal from '../components/DocumentEditorModal';

export default function DMSPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [editorDoc, setEditorDoc] = useState<DocumentItem | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<string | null>(null);

  useEffect(() => {
    setDocuments(loadDocuments());
  }, []);
  const [dragOver, setDragOver] = useState(false);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (replaceTarget) {
        replaceDocument(replaceTarget, files[0]);
        setDocuments(loadDocuments());
        setReplaceTarget(null);
      } else {
        handleFiles(Array.from(files));
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const files = event.dataTransfer.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      addDocumentFromFile(file);
      setDocuments(loadDocuments());
    });
  };

  const handleDownload = (doc: DocumentItem) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = doc.name;
    link.click();
    alert(`Downloading ${doc.name}...`);
  };

  const handleDelete = (docId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument(docId);
      setDocuments(loadDocuments());
    }
  };

  const handleEditFields = (doc: DocumentItem) => {
    setEditorDoc(doc);
  };

  const handleReplace = (docId: string) => {
    setReplaceTarget(docId);
    fileInputRef.current?.click();
  };

  const getFileIcon = (type: string) => {
    const iconClass = 'h-6 w-6';
    switch (type) {
      case 'pdf':
        return (
          <svg
            className={`${iconClass} text-red-600`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'docx':
      case 'doc':
        return (
          <svg
            className={`${iconClass} text-blue-600`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'xlsx':
      case 'xls':
        return (
          <svg
            className={`${iconClass} text-green-600`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            className={`${iconClass} text-gray-600`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-100">
                Document Management System
              </h1>
              <p className="text-sm text-gray-400">
                Upload, manage, and organize your documents
              </p>
            </div>
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Upload Section */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-medium text-gray-100">
                Upload Document
              </h2>
            </div>
            <div className="p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  dragOver
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="Upload documents"
                />
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
                  <p className="text-sm text-gray-300">
                    Drop files here or{' '}
                    <button
                      type="button"
                      className="font-medium text-blue-400 hover:text-blue-300"
                      onClick={handleBrowseClick}
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, DOC, DOCX, XLS, XLSX up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-medium text-gray-100">
                My Documents
              </h2>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Modified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div
                              className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                doc.type === 'pdf'
                                  ? 'bg-red-500/20'
                                  : doc.type === 'docx' || doc.type === 'doc'
                                    ? 'bg-blue-500/20'
                                    : doc.type === 'xlsx' || doc.type === 'xls'
                                      ? 'bg-green-500/20'
                                      : 'bg-gray-800'
                              }`}
                            >
                              {getFileIcon(doc.type)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-100">
                              {doc.name}
                            </div>
                            <div className="text-sm text-gray-300">
                              {doc.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {doc.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {doc.modified}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            doc.status === 'Uploaded'
                              ? 'bg-green-900/30 text-green-300'
                              : doc.status === 'Processing'
                                ? 'bg-yellow-900/30 text-yellow-300'
                                : 'bg-red-900/30 text-red-300'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setDocumentPinned(doc.id, !doc.pinned);
                            setDocuments(loadDocuments());
                          }}
                          className={`mr-3 ${doc.pinned ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-gray-300'}`}
                          title={doc.pinned ? 'Unpin' : 'Pin'}
                        >
                          {doc.pinned ? 'Unpin' : 'Pin'}
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="text-blue-400 hover:text-blue-300 mr-3"
                          disabled={doc.status === 'Processing'}
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleEditFields(doc)}
                          className="text-indigo-400 hover:text-indigo-300 mr-3"
                        >
                          Edit Fields
                        </button>
                        <button
                          onClick={() => handleReplace(doc.id)}
                          className="text-yellow-400 hover:text-yellow-300 mr-3"
                        >
                          Replace
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <DocumentEditorModal
            document={editorDoc}
            isOpen={!!editorDoc}
            onClose={() => setEditorDoc(null)}
            onSaved={() => setDocuments(loadDocuments())}
          />
        </div>
      </main>
    </div>
  );
}
