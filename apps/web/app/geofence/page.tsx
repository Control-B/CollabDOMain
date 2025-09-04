import Link from 'next/link';

export default function GeofencePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-100">Geofencing</h1>
              <p className="text-sm text-gray-400">
                Monitor location-based check-ins and events
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
                    className="h-8 w-8 text-green-600"
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
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-100">24</p>
                  <p className="text-sm text-gray-400">Active Zones</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-100">156</p>
                  <p className="text-sm text-gray-400">Check-ins Today</p>
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
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-100">3</p>
                  <p className="text-sm text-gray-400">Alerts</p>
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
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-100">89</p>
                  <p className="text-sm text-gray-400">Active Users</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Check-ins */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-lg font-medium text-gray-100">
                  Recent Check-ins
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-800 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        JD
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-100">
                          John Doe
                        </p>
                        <p className="text-xs text-gray-400">
                          Headquarters Office
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">2 min ago</p>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-900/30 text-green-300">
                        In Zone
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        AS
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-100">
                          Alice Smith
                        </p>
                        <p className="text-xs text-gray-400">
                          Warehouse District
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">5 min ago</p>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-900/30 text-blue-300">
                        Checked In
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        BJ
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-100">
                          Bob Johnson
                        </p>
                        <p className="text-xs text-gray-400">Client Site A</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">12 min ago</p>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-900/30 text-yellow-300">
                        Boundary Alert
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-800 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        MG
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-100">
                          Mike Garcia
                        </p>
                        <p className="text-xs text-gray-400">Remote Location</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">18 min ago</p>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-900/30 text-red-300">
                        Outside Zone
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Geofence Zones */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-100">
                    Geofence Zones
                  </h2>
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    + Add Zone
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="border border-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium text-gray-100">
                        Headquarters Office
                      </h3>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-900/30 text-green-300">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      Downtown Business District
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Radius: 200m</span>
                      <span>12 users inside</span>
                    </div>
                  </div>

                  <div className="border border-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium text-gray-100">
                        Warehouse District
                      </h3>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-900/30 text-green-300">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      Industrial Zone North
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Radius: 500m</span>
                      <span>8 users inside</span>
                    </div>
                  </div>

                  <div className="border border-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium text-gray-100">
                        Client Site A
                      </h3>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-900/30 text-yellow-300">
                        Monitoring
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      Temporary project location
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Radius: 150m</span>
                      <span>3 users inside</span>
                    </div>
                  </div>

                  <div className="border border-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium text-gray-100">
                        Remote Hub B
                      </h3>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-800 text-gray-300">
                        Inactive
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      Secondary office location
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Radius: 300m</span>
                      <span>0 users inside</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg mt-6">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-medium text-gray-100">
                Live Map View
              </h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-800 rounded-lg h-64 flex items-center justify-center border border-gray-700">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-100">
                    Interactive Map
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Real-time location tracking and geofence visualization
                  </p>
                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                    Load Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
