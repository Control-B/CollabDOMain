import Link from 'next/link';

export default function OSSPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-100">
                OSS Rules Engine
              </h1>
              <p className="text-sm text-gray-400">
                Manage and monitor rule-based operations and workflows
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
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-100">47</p>
                  <p className="text-sm text-gray-400">Active Rules</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6">
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
                  <p className="text-2xl font-semibold text-gray-100">1,234</p>
                  <p className="text-sm text-gray-400">Executions Today</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-100">2</p>
                  <p className="text-sm text-gray-400">Failed Rules</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM6 9.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm2.5 5.5a1 1 0 100-2 1 1 0 000 2zm4.5-1a1 1 0 11-2 0 1 1 0 012 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-100">98.7%</p>
                  <p className="text-sm text-gray-400">Success Rate</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Rules */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-100">
                    Active Rules
                  </h2>
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    + Create Rule
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="border border-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium text-gray-100">
                        Document Auto-Approval
                      </h3>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-900/30 text-green-300">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      Auto-approve documents under $1000
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Last execution: 2 min ago</span>
                      <span>Success: 100%</span>
                    </div>
                  </div>

                  <div className="border border-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium text-gray-100">
                        Geofence Violations
                      </h3>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-900/30 text-green-300">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      Alert on unauthorized location access
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Last execution: 5 min ago</span>
                      <span>Success: 98%</span>
                    </div>
                  </div>

                  <div className="border border-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium text-gray-100">
                        Signature Reminders
                      </h3>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-900/30 text-green-300">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      Send reminders for pending signatures
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Last execution: 1 hour ago</span>
                      <span>Success: 100%</span>
                    </div>
                  </div>

                  <div className="border border-red-800 rounded-lg p-4 bg-red-900/20">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium text-gray-100">
                        Data Backup Validation
                      </h3>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-900/30 text-red-300">
                        Failed
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      Verify daily backup integrity
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Last execution: 3 hours ago</span>
                      <span>Success: 0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rule Categories */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-lg font-medium text-gray-100">
                  Rule Categories
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
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
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-100">
                          Document Processing
                        </p>
                        <p className="text-xs text-gray-400">
                          Automated document workflows
                        </p>
                      </div>
                    </div>
                    <span className="bg-blue-900/30 text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      12 rules
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-800 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-100">
                          Location Monitoring
                        </p>
                        <p className="text-xs text-gray-400">
                          Geofence and tracking rules
                        </p>
                      </div>
                    </div>
                    <span className="bg-green-900/30 text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      8 rules
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-900/20 border border-purple-800 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-100">
                          E-Signature Workflows
                        </p>
                        <p className="text-xs text-gray-400">
                          Signature and approval automation
                        </p>
                      </div>
                    </div>
                    <span className="bg-purple-900/30 text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      15 rules
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
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
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-100">
                          System Monitoring
                        </p>
                        <p className="text-xs text-gray-400">
                          Health checks and alerts
                        </p>
                      </div>
                    </div>
                    <span className="bg-yellow-900/30 text-yellow-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      12 rules
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Executions */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg mt-6">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-medium text-gray-100">
                Recent Rule Executions
              </h2>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Rule Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Trigger
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Executed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      Document Auto-Approval
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      New document uploaded
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-900/30 text-green-300">
                        Success
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      2 minutes ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      1.2s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-400 hover:text-blue-300">
                        View Log
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      Geofence Violation Alert
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      Location boundary crossed
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-900/30 text-green-300">
                        Success
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      5 minutes ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      0.8s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-400 hover:text-blue-300">
                        View Log
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      Data Backup Validation
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      Scheduled execution
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-900/30 text-red-300">
                        Failed
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      3 hours ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      15.3s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-red-400 hover:text-red-300">
                        Debug
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
