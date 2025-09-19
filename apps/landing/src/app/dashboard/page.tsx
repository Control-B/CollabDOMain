'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Settings, LogOut } from 'lucide-react';
import CollabLogo from '@/components/CollabLogo';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Simulate getting user data
    setUser({
      name: 'Demo User',
      email: 'demo@dispatchar.com',
      company: 'Demo Logistics Co.',
    });
  }, []);

  const handleLogout = () => {
    // Simulate logout
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950">
      {/* Navigation */}
      <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <CollabLogo className="w-8 h-8 mr-3" />
              <span className="text-white font-bold text-xl">Dispatchar</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-gray-300">
                Welcome, {user?.name || 'User'}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-gray-300 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Dispatchar Dashboard
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your trucking collaboration platform is ready!
          </p>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700/50 rounded-xl p-6">
                <User className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Profile</h3>
                <p className="text-gray-400 text-sm">
                  Manage your account settings and preferences
                </p>
              </div>
              
              <div className="bg-gray-700/50 rounded-xl p-6">
                <Settings className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Settings</h3>
                <p className="text-gray-400 text-sm">
                  Configure your fleet and notification preferences
                </p>
              </div>
              
              <div className="bg-gray-700/50 rounded-xl p-6">
                <div className="w-8 h-8 bg-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">D</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Dispatchar</h3>
                <p className="text-gray-400 text-sm">
                  Access the full web application
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-gray-400 mb-4">
              This is a demo dashboard. In the full application, you would see:
            </p>
            <ul className="text-gray-300 text-left max-w-md mx-auto">
              <li>• Real-time fleet tracking</li>
              <li>• Driver communication</li>
              <li>• Document management</li>
              <li>• Geofencing alerts</li>
              <li>• Analytics and reporting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
