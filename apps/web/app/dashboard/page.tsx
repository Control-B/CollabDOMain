import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-100">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-gray-300">
                Real-time system overview and metrics
              </p>
            </div>
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Channels/Rooms */}
          <aside className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
              <h2 className="text-lg font-medium text-gray-100 mb-4">
                Active Channels
              </h2>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-800/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-200">
                      PO-2024-001
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-300 border border-green-800/60">
                      3 online
                    </span>
                  </div>
                  <p className="text-xs text-blue-300 mt-1">
                    Warehouse delivery
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-900 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-100">
                      Trip-TX-045
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-800/60">
                      1 online
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Long haul route</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-900 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-100">
                      General
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800/70 text-gray-200 border border-gray-700">
                      8 online
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Team discussions</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Metrics */}
          <section className="lg:col-span-6">
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-lg font-medium text-gray-100">
                  System Metrics
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-lg p-4 bg-blue-900/30 border border-blue-800/60">
                    <div className="text-2xl font-bold text-blue-400">24</div>
                    <div className="text-sm text-blue-300">
                      Active Documents
                    </div>
                  </div>
                  <div className="rounded-lg p-4 bg-green-900/30 border border-green-800/60">
                    <div className="text-2xl font-bold text-green-400">12</div>
                    <div className="text-sm text-green-300">
                      Pending Signatures
                    </div>
                  </div>
                  <div className="rounded-lg p-4 bg-purple-900/30 border border-purple-800/60">
                    <div className="text-2xl font-bold text-purple-400">
                      156
                    </div>
                    <div className="text-sm text-purple-300">
                      Messages Today
                    </div>
                  </div>
                  <div className="rounded-lg p-4 bg-red-900/30 border border-red-800/60">
                    <div className="text-2xl font-bold text-red-400">3</div>
                    <div className="text-sm text-red-300">Geofence Alerts</div>
                  </div>
                </div>

                {/* Recent Activity */}
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
                    <div className="flex items-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                      <div className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full"></div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-100">
                          Geofence alert: Driver checked in at Warehouse A
                        </p>
                        <p className="text-xs text-gray-400">8 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right Sidebar - Exceptions & Documents */}
          <aside className="lg:col-span-3">
            <div className="space-y-6">
              {/* Exceptions Queue */}
              <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <h2 className="text-lg font-medium text-gray-100 mb-4">
                  Exceptions Queue
                </h2>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-red-900/20 border border-red-800/50">
                    <div className="text-sm font-medium text-red-300">
                      PO Mismatch
                    </div>
                    <p className="text-xs text-red-300 mt-1">
                      Qty variance: +50 units
                    </p>
                    <div className="text-xs text-red-400 mt-1">
                      SKU: ABC-123
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-800/50">
                    <div className="text-sm font-medium text-yellow-300">
                      Signature Pending
                    </div>
                    <p className="text-xs text-yellow-300 mt-1">
                      Contract expires in 2 days
                    </p>
                    <div className="text-xs text-yellow-400 mt-1">
                      DOC-2024-067
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Documents */}
              <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <h2 className="text-lg font-medium text-gray-100 mb-4">
                  Recent Documents
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded hover:bg-gray-700/60">
                    <div>
                      <div className="text-sm font-medium text-gray-100">
                        invoice-2024-05.pdf
                      </div>
                      <div className="text-xs text-gray-400">2.1 MB</div>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-300 border border-green-800/60">
                      Signed
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded hover:bg-gray-700/60">
                    <div>
                      <div className="text-sm font-medium text-gray-100">
                        contract-001.docx
                      </div>
                      <div className="text-xs text-gray-400">1.8 MB</div>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-300 border border-yellow-800/60">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded hover:bg-gray-700/60">
                    <div>
                      <div className="text-sm font-medium text-gray-100">
                        shipment-log.xlsx
                      </div>
                      <div className="text-xs text-gray-400">856 KB</div>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-800/60">
                      Uploaded
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
