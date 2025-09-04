'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  Truck,
  MapPin,
  Clock,
  Phone,
  Package,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Filter,
  Search,
  Download,
  RefreshCw,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

interface CheckInNotification {
  id: string;
  type: 'geofence_checkin';
  title: string;
  message: string;
  tripSheet: TripSheetSummary;
  location: LocationSummary;
  checkInDetails: CheckInDetails;
  recipients: any[];
  createdAt: string;
  isRead: boolean;
  channelCreated: boolean;
  channelId?: string;
}

interface TripSheetSummary {
  tripNumber: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  trailerNumber?: string;
  pickupLocationName: string;
  pickupAddress: string;
  pickupPoNumber: string;
  deliveryLocationName?: string;
  deliveryAddress?: string;
  loadDescription?: string;
  pickupAppointmentDate?: string;
  pickupAppointmentTime?: string;
  deliveryAppointmentDate?: string;
  deliveryAppointmentTime?: string;
}

interface LocationSummary {
  name: string;
  address: string;
  phone?: string;
}

interface CheckInDetails {
  checkInType: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  distanceFromCenter?: number;
}

interface FilterState {
  status: 'all' | 'unread' | 'read';
  checkInType: 'all' | 'pickup_arrival' | 'delivery_arrival';
  dateRange: '24h' | '7d' | '30d';
  search: string;
}

export const ShippingDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedNotification, setSelectedNotification] =
    useState<CheckInNotification | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    checkInType: 'all',
    dateRange: '24h',
    search: '',
  });

  // Fetch check-in notifications
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery<CheckInNotification[]>({
    queryKey: ['checkin-notifications', filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        status: filters.status,
        checkInType: filters.checkInType,
        dateRange: filters.dateRange,
        search: filters.search,
      });

      const response = await fetch(`/api/checkin-notifications?${params}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(
        `/api/checkin-notifications/${notificationId}/read`,
        {
          method: 'POST',
        },
      );
      if (!response.ok) throw new Error('Failed to mark as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkin-notifications'] });
    },
  });

  // Create channel from notification
  const createChannelMutation = useMutation({
    mutationFn: async (notification: CheckInNotification) => {
      const response = await fetch('/api/channels/create-from-checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationId: notification.id,
          channelName: `Trip-${notification.tripSheet.tripNumber}-${notification.location.name}`,
          description: `Communication channel for ${notification.tripSheet.tripNumber} at ${notification.location.name}`,
          tripNumber: notification.tripSheet.tripNumber,
          driverName: notification.tripSheet.driverName,
          locationName: notification.location.name,
        }),
      });

      if (!response.ok) throw new Error('Failed to create channel');
      return response.json();
    },
    onSuccess: (data, notification) => {
      toast.success(`Channel created: ${data.channelName}`);
      queryClient.invalidateQueries({ queryKey: ['checkin-notifications'] });

      // Navigate to the new channel
      window.open(`/channels/${data.channelId}`, '_blank');
    },
    onError: (error) => {
      toast.error('Failed to create channel');
      console.error('Channel creation error:', error);
    },
  });

  // Statistics
  const stats = useMemo(() => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const todayCount = notifications.filter((n) => {
      const today = new Date().toDateString();
      return new Date(n.createdAt).toDateString() === today;
    }).length;
    const channelsCreated = notifications.filter(
      (n) => n.channelCreated,
    ).length;

    return {
      total: notifications.length,
      unread: unreadCount,
      today: todayCount,
      channelsCreated,
    };
  }, [notifications]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      // Status filter
      if (filters.status === 'read' && !notification.isRead) return false;
      if (filters.status === 'unread' && notification.isRead) return false;

      // Check-in type filter
      if (
        filters.checkInType !== 'all' &&
        notification.checkInDetails.checkInType !== filters.checkInType
      )
        return false;

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = `
          ${notification.tripSheet.tripNumber}
          ${notification.tripSheet.driverName}
          ${notification.tripSheet.vehicleNumber}
          ${notification.location.name}
          ${notification.tripSheet.pickupPoNumber}
        `.toLowerCase();

        if (!searchableText.includes(searchTerm)) return false;
      }

      return true;
    });
  }, [notifications, filters]);

  const handleNotificationClick = (notification: CheckInNotification) => {
    setSelectedNotification(notification);

    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
  };

  const handleCreateChannel = (notification: CheckInNotification) => {
    createChannelMutation.mutate(notification);
  };

  const formatCheckInType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadgeColor = (notification: CheckInNotification) => {
    if (!notification.isRead) return 'bg-blue-100 text-blue-800';
    if (notification.channelCreated) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error Loading Dashboard
        </h3>
        <p className="text-gray-600 mb-4">
          Failed to load check-in notifications
        </p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Notifications List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Shipping Dashboard
          </h1>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">
                Total Notifications
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {stats.total}
              </div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-sm text-yellow-600 font-medium">Unread</div>
              <div className="text-2xl font-bold text-yellow-900">
                {stats.unread}
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Today</div>
              <div className="text-2xl font-bold text-green-900">
                {stats.today}
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">
                Channels Created
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {stats.channelsCreated}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by trip, driver, vehicle..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value as any,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Type
              </label>
              <select
                value={filters.checkInType}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    checkInType: e.target.value as any,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="pickup_arrival">Pickup Arrival</option>
                <option value="delivery_arrival">Delivery Arrival</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    dateRange: e.target.value as any,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="w-full mt-4 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Notifications
              </h3>
              <p className="text-gray-600">
                No check-in notifications match your current filters.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedNotification?.id === notification.id
                      ? 'bg-blue-50 border-r-4 border-blue-500'
                      : ''
                  } ${!notification.isRead ? 'bg-blue-25' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(notification)}`}
                    >
                      {formatCheckInType(
                        notification.checkInDetails.checkInType,
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDateTime(notification.createdAt)}
                    </span>
                  </div>

                  <h4
                    className={`font-medium mb-1 ${!notification.isRead ? 'text-blue-900' : 'text-gray-900'}`}
                  >
                    {notification.tripSheet.tripNumber}
                  </h4>

                  <p className="text-sm text-gray-600 mb-2">
                    {notification.tripSheet.driverName} •{' '}
                    {notification.tripSheet.vehicleNumber}
                  </p>

                  <p className="text-sm text-gray-600 mb-2">
                    📍 {notification.location.name}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      PO: {notification.tripSheet.pickupPoNumber}
                    </span>

                    {notification.channelCreated && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Notification Details */}
      <div className="flex-1 flex flex-col">
        {selectedNotification ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Trip {selectedNotification.tripSheet.tripNumber} Check-In
                  </h2>
                  <p className="text-sm text-gray-600">
                    {formatCheckInType(
                      selectedNotification.checkInDetails.checkInType,
                    )}{' '}
                    • {formatDateTime(selectedNotification.createdAt)}
                  </p>
                </div>

                <div className="flex space-x-3">
                  {!selectedNotification.channelCreated && (
                    <button
                      onClick={() => handleCreateChannel(selectedNotification)}
                      disabled={createChannelMutation.isPending}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {createChannelMutation.isPending
                        ? 'Creating...'
                        : 'Create Channel'}
                    </button>
                  )}

                  <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trip Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-blue-600" />
                    Trip Information
                  </h3>

                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Driver
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {selectedNotification.tripSheet.driverName}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Phone
                      </dt>
                      <dd className="text-sm text-gray-900 flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-gray-400" />
                        <a
                          href={`tel:${selectedNotification.tripSheet.driverPhone}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {selectedNotification.tripSheet.driverPhone}
                        </a>
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Vehicle
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {selectedNotification.tripSheet.vehicleNumber}
                        {selectedNotification.tripSheet.trailerNumber && (
                          <span className="text-gray-600">
                            {' '}
                            • Trailer:{' '}
                            {selectedNotification.tripSheet.trailerNumber}
                          </span>
                        )}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        PO Number
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {selectedNotification.tripSheet.pickupPoNumber}
                      </dd>
                    </div>

                    {selectedNotification.tripSheet.loadDescription && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Load Description
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {selectedNotification.tripSheet.loadDescription}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Location Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-green-600" />
                    Location Information
                  </h3>

                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Location
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {selectedNotification.location.name}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Address
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {selectedNotification.location.address}
                      </dd>
                    </div>

                    {selectedNotification.location.phone && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Phone
                        </dt>
                        <dd className="text-sm text-gray-900 flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          <a
                            href={`tel:${selectedNotification.location.phone}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {selectedNotification.location.phone}
                          </a>
                        </dd>
                      </div>
                    )}

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Check-in Time
                      </dt>
                      <dd className="text-sm text-gray-900 flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {formatDateTime(
                          selectedNotification.checkInDetails.timestamp,
                        )}
                      </dd>
                    </div>

                    {selectedNotification.checkInDetails.distanceFromCenter && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Distance from Center
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {Math.round(
                            selectedNotification.checkInDetails
                              .distanceFromCenter,
                          )}{' '}
                          meters
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Pickup Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-orange-600" />
                    Pickup Information
                  </h3>

                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Pickup Location
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {selectedNotification.tripSheet.pickupLocationName}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Address
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {selectedNotification.tripSheet.pickupAddress}
                      </dd>
                    </div>

                    {selectedNotification.tripSheet.pickupAppointmentDate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Appointment
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {new Date(
                            selectedNotification.tripSheet.pickupAppointmentDate,
                          ).toLocaleDateString()}
                          {selectedNotification.tripSheet
                            .pickupAppointmentTime && (
                            <span>
                              {' '}
                              at{' '}
                              {
                                selectedNotification.tripSheet
                                  .pickupAppointmentTime
                              }
                            </span>
                          )}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Delivery Information */}
                {selectedNotification.tripSheet.deliveryLocationName && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                      Delivery Information
                    </h3>

                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Delivery Location
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {selectedNotification.tripSheet.deliveryLocationName}
                        </dd>
                      </div>

                      {selectedNotification.tripSheet.deliveryAddress && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Address
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {selectedNotification.tripSheet.deliveryAddress}
                          </dd>
                        </div>
                      )}

                      {selectedNotification.tripSheet
                        .deliveryAppointmentDate && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Appointment
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {new Date(
                              selectedNotification.tripSheet.deliveryAppointmentDate,
                            ).toLocaleDateString()}
                            {selectedNotification.tripSheet
                              .deliveryAppointmentTime && (
                              <span>
                                {' '}
                                at{' '}
                                {
                                  selectedNotification.tripSheet
                                    .deliveryAppointmentTime
                                }
                              </span>
                            )}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}
              </div>

              {/* Map placeholder */}
              <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Location Map
                </h3>
                <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Map integration coming soon</p>
                    <p className="text-sm text-gray-500">
                      Lat:{' '}
                      {selectedNotification.checkInDetails.latitude.toFixed(6)},
                      Lng:{' '}
                      {selectedNotification.checkInDetails.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a Notification
              </h3>
              <p className="text-gray-600 max-w-sm">
                Choose a check-in notification from the list to view details and
                create communication channels.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



