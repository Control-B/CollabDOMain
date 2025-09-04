'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Envelope {
  id: string;
  documentName: string;
  documentId: string;
  recipients: string[];
  status: 'Completed' | 'Awaiting Signature' | 'Draft' | 'Cancelled';
  sent: string;
  recipientCount: number;
}

export default function ESignPage() {
  const router = useRouter();
  const [envelopes, setEnvelopes] = useState<Envelope[]>([
    {
      id: '1',
      documentName: 'Employment Agreement',
      documentId: 'HR-2024-001',
      recipients: ['john.doe@company.com'],
      status: 'Completed',
      sent: '2 hours ago',
      recipientCount: 1,
    },
    {
      id: '2',
      documentName: 'NDA Agreement',
      documentId: 'LEG-2024-045',
      recipients: ['partner@client.com'],
      status: 'Awaiting Signature',
      sent: '1 day ago',
      recipientCount: 1,
    },
    {
      id: '3',
      documentName: 'Service Agreement',
      documentId: 'SVC-2024-022',
      recipients: ['client@business.com', 'manager@business.com'],
      status: 'Draft',
      sent: '3 days ago',
      recipientCount: 2,
    },
  ]);

  const handleStartNewEnvelope = () => {
    // Navigate to signature creation page
    router.push('/esign/sign');
  };

  const handleBrowseTemplates = () => {
    alert('Template browser will be implemented soon!');
  };

  const handleViewAuditTrails = () => {
    alert('Audit trail viewer will be implemented soon!');
  };

  const handleView = (envelope: Envelope) => {
    alert(`Viewing envelope: ${envelope.documentName}`);
  };

  const handleDownload = (envelope: Envelope) => {
    alert(`Downloading: ${envelope.documentName}`);
  };

  const handleRemind = (envelope: Envelope) => {
    alert(`Sending reminder for: ${envelope.documentName}`);
  };

  const handleCancel = (envelopeId: string) => {
    if (confirm('Are you sure you want to cancel this envelope?')) {
      setEnvelopes((prev) =>
        prev.map((env) =>
          env.id === envelopeId
            ? { ...env, status: 'Cancelled' as const }
            : env,
        ),
      );
    }
  };

  const handleEdit = (envelope: Envelope) => {
    alert(`Editing envelope: ${envelope.documentName}`);
  };

  const handleSend = (envelopeId: string) => {
    setEnvelopes((prev) =>
      prev.map((env) =>
        env.id === envelopeId
          ? { ...env, status: 'Awaiting Signature' as const, sent: 'Just now' }
          : env,
      ),
    );
    alert('Envelope sent successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Awaiting Signature':
        return 'bg-yellow-100 text-yellow-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentIcon = (status: string) => {
    const baseClass = 'h-6 w-6';
    switch (status) {
      case 'Completed':
        return (
          <svg
            className={`${baseClass} text-green-600`}
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
      case 'Awaiting Signature':
        return (
          <svg
            className={`${baseClass} text-orange-600`}
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
            className={`${baseClass} text-blue-600`}
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
                Electronic Signature
              </h1>
              <p className="text-sm text-gray-400">
                Send, track, and manage digital signatures
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
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6 h-full flex flex-col">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-100">
                    Send for Signature
                  </h3>
                  <p className="text-sm text-gray-300">
                    Upload a document and request signatures
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <button
                  onClick={handleStartNewEnvelope}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Start New Envelope
                </button>
              </div>
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6 h-full flex flex-col">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-100">
                    Templates
                  </h3>
                  <p className="text-sm text-gray-300">
                    Use pre-configured templates
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <button
                  onClick={handleBrowseTemplates}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Browse Templates
                </button>
              </div>
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6 h-full flex flex-col">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-100">
                    Audit Trail
                  </h3>
                  <p className="text-sm text-gray-300">
                    View signature history and logs
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <button
                  onClick={handleViewAuditTrails}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  View Audit Trails
                </button>
              </div>
            </div>
          </div>

          {/* Envelopes List */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-medium text-gray-100">
                Recent Envelopes
              </h2>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Sent
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <svg
                              className="h-6 w-6 text-indigo-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-100">
                            Employment Agreement
                          </div>
                          <div className="text-sm text-gray-300">
                            HR-2024-001
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-100">
                        john.doe@company.com
                      </div>
                      <div className="text-sm text-gray-300">1 recipient</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-900/30 text-green-300">
                        Completed
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      2 hours ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-400 hover:text-blue-300 mr-3">
                        View
                      </button>
                      <button className="text-green-400 hover:text-green-300">
                        Download
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                            <svg
                              className="h-6 w-6 text-orange-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-100">
                            NDA Agreement
                          </div>
                          <div className="text-sm text-gray-300">
                            LEG-2024-045
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-100">
                        partner@client.com
                      </div>
                      <div className="text-sm text-gray-300">1 recipient</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-900/30 text-yellow-300">
                        Awaiting Signature
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      1 day ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-400 hover:text-blue-300 mr-3">
                        Remind
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        Cancel
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <svg
                              className="h-6 w-6 text-blue-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-100">
                            Service Agreement
                          </div>
                          <div className="text-sm text-gray-300">
                            SVC-2024-022
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-100">
                        client@business.com
                      </div>
                      <div className="text-sm text-gray-300">2 recipients</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-800 text-gray-300">
                        Draft
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      3 days ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-400 hover:text-blue-300 mr-3">
                        Edit
                      </button>
                      <button className="text-green-400 hover:text-green-300">
                        Send
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
