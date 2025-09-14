'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  LocalParticipant,
  Track,
  RemoteTrackPublication,
} from 'livekit-client';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
} from 'lucide-react';

interface CallInterfaceProps {
  callId?: string;
  roomName?: string;
  accessToken?: string;
  livekitUrl?: string;
  phoneNumber?: string;
  onCallEnd?: () => void;
}

interface CallParticipant {
  identity: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isSpeaking: boolean;
}

export const CallInterface: React.FC<CallInterfaceProps> = ({
  callId,
  roomName,
  accessToken,
  livekitUrl = 'ws://localhost:7880',
  phoneNumber,
  onCallEnd,
}) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [participants, setParticipants] = useState<CallParticipant[]>([]);
  const [callStatus, setCallStatus] = useState<
    'idle' | 'connecting' | 'connected' | 'ended'
  >('idle');
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callStartTimeRef = useRef<Date | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize room and connect
  useEffect(() => {
    if (accessToken && roomName) {
      connectToRoom();
    }

    return () => {
      if (room) {
        room.disconnect();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [accessToken, roomName]);

  const connectToRoom = async () => {
    if (!accessToken || !roomName) return;

    try {
      setCallStatus('connecting');
      const newRoom = new Room();

      // Set up event listeners
      newRoom.on(RoomEvent.Connected, () => {
        console.log('Connected to room');
        setIsConnected(true);
        setCallStatus('connected');
        callStartTimeRef.current = new Date();
        startCallTimer();
      });

      newRoom.on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from room');
        setIsConnected(false);
        setCallStatus('ended');
        onCallEnd?.();
      });

      newRoom.on(
        RoomEvent.ParticipantConnected,
        (participant: RemoteParticipant) => {
          console.log('Participant connected:', participant.identity);
          updateParticipants();
        },
      );

      newRoom.on(
        RoomEvent.ParticipantDisconnected,
        (participant: RemoteParticipant) => {
          console.log('Participant disconnected:', participant.identity);
          updateParticipants();
        },
      );

      newRoom.on(
        RoomEvent.TrackSubscribed,
        (
          track: Track,
          publication: RemoteTrackPublication,
          participant: RemoteParticipant,
        ) => {
          if (track.kind === 'video') {
            const videoElement = remoteVideoRef.current;
            if (videoElement) {
              track.attach(videoElement);
            }
          }
        },
      );

      newRoom.on(
        RoomEvent.TrackUnsubscribed,
        (
          track: Track,
          publication: RemoteTrackPublication,
          participant: RemoteParticipant,
        ) => {
          track.detach();
        },
      );

      // Connect to room
      await newRoom.connect(livekitUrl, accessToken);
      setRoom(newRoom);

      // Enable local media
      await newRoom.localParticipant.enableCameraAndMicrophone();

      // Attach local video
      const videoPublications = Array.from(
        newRoom.localParticipant.videoTrackPublications.values(),
      );
      const localVideoTrack = videoPublications[0]?.track;
      if (localVideoTrack && localVideoRef.current) {
        localVideoTrack.attach(localVideoRef.current);
      }
    } catch (error) {
      console.error('Failed to connect to room:', error);
      setCallStatus('idle');
    }
  };

  const updateParticipants = () => {
    if (!room) return;

    const participantList: CallParticipant[] = [];

    // Add local participant
    participantList.push({
      identity: room.localParticipant.identity,
      isAudioEnabled: room.localParticipant.isMicrophoneEnabled,
      isVideoEnabled: room.localParticipant.isCameraEnabled,
      isSpeaking: false,
    });

    // Add remote participants
    room.remoteParticipants.forEach((participant) => {
      participantList.push({
        identity: participant.identity,
        isAudioEnabled: participant.isMicrophoneEnabled,
        isVideoEnabled: participant.isCameraEnabled,
        isSpeaking: false,
      });
    });

    setParticipants(participantList);
  };

  const startCallTimer = () => {
    durationIntervalRef.current = setInterval(() => {
      if (callStartTimeRef.current) {
        const now = new Date();
        const duration = Math.floor(
          (now.getTime() - callStartTimeRef.current.getTime()) / 1000,
        );
        setCallDuration(duration);
      }
    }, 1000);
  };

  const toggleAudio = async () => {
    if (!room) return;

    try {
      if (isAudioEnabled) {
        await room.localParticipant.setMicrophoneEnabled(false);
      } else {
        await room.localParticipant.setMicrophoneEnabled(true);
      }
      setIsAudioEnabled(!isAudioEnabled);
      updateParticipants();
    } catch (error) {
      console.error('Failed to toggle audio:', error);
    }
  };

  const toggleVideo = async () => {
    if (!room) return;

    try {
      if (isVideoEnabled) {
        await room.localParticipant.setCameraEnabled(false);
      } else {
        await room.localParticipant.setCameraEnabled(true);
      }
      setIsVideoEnabled(!isVideoEnabled);
      updateParticipants();
    } catch (error) {
      console.error('Failed to toggle video:', error);
    }
  };

  const endCall = async () => {
    if (!room) return;

    try {
      setCallStatus('ended');
      await room.disconnect();
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      onCallEnd?.();
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4">
        {/* Call Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <PhoneCall className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {callStatus === 'connecting'
                  ? 'Connecting...'
                  : callStatus === 'connected'
                  ? 'Call in Progress'
                  : 'Call Ended'}
              </h2>
              <p className="text-gray-600">
                {phoneNumber && `Calling ${phoneNumber}`}
                {callStatus === 'connected' &&
                  ` • ${formatDuration(callDuration)}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">
              {participants.length} participants
            </span>
          </div>
        </div>

        {/* Video Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Local Video */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              You {isVideoEnabled ? '' : '(Video Off)'}
            </div>
          </div>

          {/* Remote Video */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {participants.find(
                (p) => p.identity !== room?.localParticipant.identity,
              )?.identity || 'Waiting for participant...'}
            </div>
          </div>
        </div>

        {/* Participants List */}
        {participants.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Participants</h3>
            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {participant.identity.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium">{participant.identity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {participant.isAudioEnabled ? (
                      <Mic className="w-4 h-4 text-green-500" />
                    ) : (
                      <MicOff className="w-4 h-4 text-red-500" />
                    )}
                    {participant.isVideoEnabled ? (
                      <Video className="w-4 h-4 text-green-500" />
                    ) : (
                      <VideoOff className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full ${
              isAudioEnabled
                ? 'bg-gray-200 hover:bg-gray-300'
                : 'bg-red-500 hover:bg-red-600 text-white'
            } transition-colors`}
          >
            {isAudioEnabled ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full ${
              isVideoEnabled
                ? 'bg-gray-200 hover:bg-gray-300'
                : 'bg-red-500 hover:bg-red-600 text-white'
            } transition-colors`}
          >
            {isVideoEnabled ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        {/* Call Status */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {callStatus === 'connecting' && 'Connecting to call...'}
            {callStatus === 'connected' && 'Call is active'}
            {callStatus === 'ended' && 'Call ended'}
          </p>
        </div>
      </div>
    </div>
  );
};
