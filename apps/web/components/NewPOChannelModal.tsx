'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface NewPOChannelModalProps {
  open: boolean;
  onClose: () => void;
  defaultPO?: string;
  defaultDriverId?: string;
  defaultTripId?: string;
  onCreated: (id: string) => void;
}

export default function NewPOChannelModal({
  open,
  onClose,
  defaultPO = '',
  defaultDriverId = '',
  defaultTripId = '',
  onCreated
}: NewPOChannelModalProps) {
  const [po, setPO] = useState(defaultPO);
  const [driverId, setDriverId] = useState(defaultDriverId);
  const [tripId, setTripId] = useState(defaultTripId);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call to create channel
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock channel ID
      const channelId = `channel_${Date.now()}`;
      onCreated(channelId);
      
      // Reset form
      setPO('');
      setDriverId('');
      setTripId('');
      onClose();
    } catch (error) {
      console.error('Failed to create channel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Channel</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="po" className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Order
            </label>
            <input
              type="text"
              id="po"
              value={po}
              onChange={(e) => setPO(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter PO number"
              required
            />
          </div>

          <div>
            <label htmlFor="driverId" className="block text-sm font-medium text-gray-700 mb-1">
              Driver ID
            </label>
            <input
              type="text"
              id="driverId"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter driver ID"
              required
            />
          </div>

          <div>
            <label htmlFor="tripId" className="block text-sm font-medium text-gray-700 mb-1">
              Trip ID
            </label>
            <input
              type="text"
              id="tripId"
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter trip ID"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Channel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


