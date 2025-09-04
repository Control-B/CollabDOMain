import Link from 'next/link';

export default function OpsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-100">
                Operations & Analytics
              </h1>
              <p className="text-sm text-gray-300">
                OS&S rules, system metrics, and recent activity — in one place
              </p>
            </div>
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Top summary cards (mix of OSS quick stats and Dashboard metrics) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <svg
                className="h-8 w-8 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-100">47</p>
                <p className="text-sm text-gray-400">Active Rules</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <svg
                className="h-8 w-8 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-100">1,234</p>
                <p className="text-sm text-gray-400">Rule Executions Today</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div>
                <div className="text-2xl font-bold text-purple-400">156</div>
                <div className="text-sm text-purple-300">Messages Today</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div>
                <div className="text-2xl font-bold text-red-400">3</div>
                <div className="text-sm text-red-300">Geofence Alerts</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* OSS: Active Rules */}
          <section className="lg:col-span-6 bg-gray-900/60 border border-gray-800 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-100">
                Active Rules
              </h2>
              <button className="text-blue-400 hover:text-blue-300 text-sm">
                + Create Rule
              </button>
            </div>
            <div className="p-6 space-y-4">
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
            </div>
          </section>

          {/* Dashboard: System Metrics + Recent Activity */}
          <section className="lg:col-span-6 bg-gray-900/60 border border-gray-800 rounded-lg">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-lg font-medium text-gray-100">
                System Metrics
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg p-4 bg-blue-900/30 border border-blue-800/60">
                  <div className="text-2xl font-bold text-blue-400">24</div>
                  <div className="text-sm text-blue-300">Active Documents</div>
                </div>
                <div className="rounded-lg p-4 bg-green-900/30 border border-green-800/60">
                  <div className="text-2xl font-bold text-green-400">12</div>
                  <div className="text-sm text-green-300">
                    Pending Signatures
                  </div>
                </div>
              </div>
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-100 mb-3">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full"></div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-100">
                        Document &quot;Invoice-2024-05&quot; uploaded
                      </p>
                      <p className="text-xs text-gray-400">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-100">
                        Envelope finalized for Contract-001
                      </p>
                      <p className="text-xs text-gray-400">5 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Recent Rule Executions (table) */}
        <section className="bg-gray-900/60 border border-gray-800 rounded-lg mt-2">
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
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
