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
import { Socket } from 'phoenix';
import NewPOChannelModal from './NewPOChannelModal';

interface CheckInNotification {
  id: string;
  type: 'geofence_checkin' | 'mobile_checkin';
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
  isGeofenceOverride?: boolean;
  overrideReason?: string;
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

  // Live events via Phoenix
  const [events, setEvents] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDefaults, setModalDefaults] = useState<{
    po: string;
    driverId?: string;
    tripId?: string;
  }>({ po: '', driverId: undefined, tripId: 'ts-1' });
  // Track a notification to delete after creating a channel from it
  const [pendingDeleteNotificationId, setPendingDeleteNotificationId] = useState<string | null>(null);

  useEffect(() => {
    // Connect to Phoenix and subscribe to shipping office notifications
    const endpoint = (process.env.NEXT_PUBLIC_WS_URL as string) || 'ws://localhost:4000/socket';
    const socket = new Socket(endpoint, {
      params: { token: 'anonymous', user_id: 'clerk-1' },
    });
    socket.connect();

    const chan = socket.channel('notifications:shipping_office', {
      user: { id: 'clerk-1', name: 'Clerk' },
    });

    chan.on('checkin_requested', (p: any) =>
      setEvents((e) => [{ type: 'checkin_requested', p, t: Date.now() }, ...e].slice(0, 50)),
    );
    chan.on('channel_created', (p: any) =>
      setEvents((e) => [{ type: 'channel_created', p, t: Date.now() }, ...e].slice(0, 50)),
    );

    chan.join();

    return () => {
      chan.leave();
      socket.disconnect();
    };
  }, []);

  const lastCheckin = useMemo(() => events.find((e) => e.type === 'checkin_requested'), [events]);
  const lastCheckinPO = lastCheckin?.p?.po_number || '';

  // Fetch check-in notifications (polling/REST)
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

  // Delete notification
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const res = await fetch(`/api/checkin-notifications/${notificationId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete notification');
      return res.json();
    },
    onSuccess: () => {
      setPendingDeleteNotificationId(null);
      queryClient.invalidateQueries({ queryKey: ['checkin-notifications'] });
      toast.success('Notification removed after channel creation');
    },
    onError: (error) => {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to remove notification');
    },
  });

  // Helper to open modal with defaults
  const openCreateModalFromEvent = (evt: any) => {
    setModalDefaults({
      po: evt?.p?.po_number || '',
      driverId: evt?.p?.driver_id || undefined,
      tripId: evt?.p?.trip_sheet_id || 'ts-1',
    });
    setPendingDeleteNotificationId(null);
    setModalOpen(true);
  };
  const openCreateModalFromNotification = (n: CheckInNotification) => {
    setModalDefaults({
      po: n.tripSheet?.pickupPoNumber || '',
      driverId: undefined, // not available on this notification payload
      tripId: 'ts-1',
    });
    setPendingDeleteNotificationId(n.id);
    setModalOpen(true);
  };

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

  const formatCheckInType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadgeColor = (notification: CheckInNotification) => {
    if (notification.isGeofenceOverride) return 'bg-orange-100 text-orange-800';
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

          {/* Live check-ins quick action */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-700">Live check-ins</div>
              <button
                disabled={!lastCheckinPO}
                onClick={() => lastCheckin && openCreateModalFromEvent(lastCheckin)}
                className="text-xs inline-flex items-center px-2.5 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1" /> Create from latest
              </button>
            </div>
            {events.length === 0 ? (
              <div className="text-xs text-gray-500">Waiting for check-ins…</div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {events
                  .filter((e) => e.type === 'checkin_requested')
                  .slice(0, 5)
                  .map((e, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-md p-2">
                      <div className="text-xs text-gray-500 mb-1">{new Date(e.t).toLocaleTimeString()}</div>
                      <div className="text-sm font-medium text-gray-900 mb-1">PO {e.p?.po_number || '—'}</div>
                      <div className="text-xs text-gray-600 mb-2">Driver: {e.p?.driver_id || 'unknown'} • Trip: {e.p?.trip_sheet_id || '—'}</div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => openCreateModalFromEvent(e)}
                          className="text-xs inline-flex items-center px-2.5 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          <MessageSquare className="h-3.5 w-3.5 mr-1" /> Create channel
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

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

                  {notification.isGeofenceOverride && (
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Geofence Override
                      </span>
                    </div>
                  )}

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
                    {selectedNotification.isGeofenceOverride && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Override
                      </span>
                    )}
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
                      onClick={() => openCreateModalFromNotification(selectedNotification)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Create Channel
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

                    {selectedNotification.isGeofenceOverride && (
                      <>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Geofence Status
                          </dt>
                          <dd className="text-sm text-gray-900">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Override Used
                            </span>
                          </dd>
                        </div>
                        {selectedNotification.overrideReason && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              Override Reason
                            </dt>
                            <dd className="text-sm text-gray-900">
                              {selectedNotification.overrideReason}
                            </dd>
                          </div>
                        )}
                      </>
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

      {/* Modal for creating channels */}
      <NewPOChannelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultPO={modalDefaults.po}
        defaultDriverId={modalDefaults.driverId}
        defaultTripId={modalDefaults.tripId}
        onCreated={(id) => {
          // If we created this from a notification, delete it now
          if (pendingDeleteNotificationId) {
            deleteNotificationMutation.mutate(pendingDeleteNotificationId);
          }
          setModalOpen(false);
          // Delay navigation to allow deletion to complete
          setTimeout(() => {
            window.location.href = `/chat?channel=${encodeURIComponent(id)}`;
          }, 500);
        }}
      />
    </div>
  );
};



