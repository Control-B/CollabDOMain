'use client';

import React, { useState, useEffect } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
  Users,
  Video,
  Mic,
} from 'lucide-react';
import { CallInterface } from './CallInterface';

interface Call {
  id: number;
  call_id: string;
  caller_phone: string;
  callee_phone: string;
  status: string;
  call_type: string;
  started_at: string;
  ended_at?: string;
  duration_seconds: number;
}

interface CallManagerProps {
  userPhoneNumber?: string;
}

export const CallManager: React.FC<CallManagerProps> = ({
  userPhoneNumber,
}) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [showCallInterface, setShowCallInterface] = useState(false);
  const [newCallPhone, setNewCallPhone] = useState('');
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [callHistory, setCallHistory] = useState<Call[]>([]);

  // Load call history
  useEffect(() => {
    if (userPhoneNumber) {
      loadCallHistory();
    }
  }, [userPhoneNumber]);

  const loadCallHistory = async () => {
    if (!userPhoneNumber) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/calls/history/${userPhoneNumber}`);
      if (response.ok) {
        const history = await response.json();
        setCallHistory(history);
      }
    } catch (error) {
      console.error('Failed to load call history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initiateCall = async (
    phoneNumber: string,
    type: 'voice' | 'video' = 'voice',
  ) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/calls/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caller_phone: userPhoneNumber,
          callee_phone: phoneNumber,
          call_type: type,
          caller_user_id: 1, // This should come from auth context
        }),
      });

      if (response.ok) {
        const callData = await response.json();
        setActiveCall(callData);
        setShowCallInterface(true);
      } else {
        throw new Error('Failed to initiate call');
      }
    } catch (error) {
      console.error('Failed to initiate call:', error);
      alert('Failed to initiate call. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const joinCall = async (callId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/calls/${callId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          call_id: callId,
          phone_number: userPhoneNumber,
          user_id: 1, // This should come from auth context
        }),
      });

      if (response.ok) {
        const callData = await response.json();
        setActiveCall(callData);
        setShowCallInterface(true);
      } else {
        throw new Error('Failed to join call');
      }
    } catch (error) {
      console.error('Failed to join call:', error);
      alert('Failed to join call. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const endCall = async () => {
    if (!activeCall) return;

    try {
      await fetch(`/api/calls/${activeCall.call_id}/end`, {
        method: 'POST',
      });

      setActiveCall(null);
      setShowCallInterface(false);
      loadCallHistory(); // Refresh call history
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getCallStatusIcon = (status: string) => {
    switch (status) {
      case 'initiated':
        return <PhoneOutgoing className="w-4 h-4 text-blue-500" />;
      case 'ringing':
        return <PhoneIncoming className="w-4 h-4 text-yellow-500" />;
      case 'active':
        return <PhoneCall className="w-4 h-4 text-green-500" />;
      case 'ended':
        return <Phone className="w-4 h-4 text-gray-500" />;
      default:
        return <Phone className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCallStatusText = (status: string) => {
    switch (status) {
      case 'initiated':
        return 'Initiated';
      case 'ringing':
        return 'Ringing';
      case 'active':
        return 'Active';
      case 'ended':
        return 'Ended';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Call Management
        </h1>
        <p className="text-gray-600">
          Make voice and video calls with your team
        </p>
      </div>

      {/* Make New Call */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Make a Call</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="tel"
              placeholder="Enter phone number"
              value={newCallPhone}
              onChange={(e) => setNewCallPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="callType"
                value="voice"
                checked={callType === 'voice'}
                onChange={(e) =>
                  setCallType(e.target.value as 'voice' | 'video')
                }
                className="mr-2"
              />
              <Mic className="w-4 h-4 mr-1" />
              Voice
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="callType"
                value="video"
                checked={callType === 'video'}
                onChange={(e) =>
                  setCallType(e.target.value as 'voice' | 'video')
                }
                className="mr-2"
              />
              <Video className="w-4 h-4 mr-1" />
              Video
            </label>
          </div>
          <button
            onClick={() => initiateCall(newCallPhone, callType)}
            disabled={!newCallPhone || isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </button>
        </div>
      </div>

      {/* Call History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Call History</h2>
          <button
            onClick={loadCallHistory}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading call history...</p>
          </div>
        ) : callHistory.length === 0 ? (
          <div className="text-center py-8">
            <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No call history found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Caller
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Callee
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Duration
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Started
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {callHistory.map((call) => (
                  <tr
                    key={call.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{call.caller_phone}</td>
                    <td className="py-3 px-4">{call.callee_phone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          call.call_type === 'video'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {call.call_type === 'video' ? (
                          <>
                            <Video className="w-3 h-3 inline mr-1" />
                            Video
                          </>
                        ) : (
                          <>
                            <Mic className="w-3 h-3 inline mr-1" />
                            Voice
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getCallStatusIcon(call.status)}
                        <span className="text-sm">
                          {getCallStatusText(call.status)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {call.duration_seconds > 0
                        ? formatDuration(call.duration_seconds)
                        : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(call.started_at)}
                    </td>
                    <td className="py-3 px-4">
                      {call.status === 'initiated' ||
                      call.status === 'ringing' ? (
                        <button
                          onClick={() => joinCall(call.call_id)}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                        >
                          Join
                        </button>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Call Interface Modal */}
      {showCallInterface && activeCall && (
        <CallInterface
          callId={activeCall.call_id}
          roomName={activeCall.call_id} // Using call_id as room name
          accessToken="" // This should be provided by the API
          livekitUrl="ws://localhost:7880"
          phoneNumber={activeCall.callee_phone}
          onCallEnd={endCall}
        />
      )}
    </div>
  );
};


