'use client';

import { useEffect, useState } from 'react';

interface Message {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
  reactions?: { emoji: string; count: number }[];
}

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  typing?: boolean;
}

export default function AnimatedSlackCollaboration() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [showTyping, setShowTyping] = useState(false);
  const [activeChannel, setActiveChannel] = useState('# dispatch-ops');
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [newReactions, setNewReactions] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [huddle, setHuddle] = useState({ active: false, users: 0 });
  const [onlineCount, setOnlineCount] = useState(15);

  const sampleUsers: User[] = [
    { id: '1', name: 'Sarah (Dispatcher)', avatar: '👩‍💼', status: 'online' },
    { id: '2', name: 'Mike (Driver)', avatar: '👨‍✈️', status: 'online' },
    { id: '3', name: 'Emma (Ops Manager)', avatar: '👩‍💼', status: 'away' },
    { id: '4', name: 'Alex (Fleet Manager)', avatar: '👨‍🔧', status: 'online' },
    { id: '5', name: 'Jordan (Driver)', avatar: '👩‍✈️', status: 'online' },
  ];

  const sampleMessages: Message[] = [
    {
      id: '1',
      user: 'Sarah (Dispatcher)',
      avatar: '👩‍💼',
      text: 'TRK-001 just cleared the weigh station! ETA updated to 3:45 PM 🚛',
      timestamp: '2:30 PM',
      reactions: [
        { emoji: '🚛', count: 4 },
        { emoji: '✅', count: 3 },
      ],
    },
    {
      id: '2',
      user: 'Mike (Driver)',
      avatar: '👨‍✈️',
      text: 'Geofencing triggered automatically at Port of Long Beach. No manual check-in needed! 📍',
      timestamp: '2:31 PM',
      reactions: [{ emoji: '🎯', count: 6 }],
    },
    {
      id: '3',
      user: 'Emma (Ops Manager)',
      avatar: '👩‍💼',
      text: 'Fuel efficiency up 12% this week thanks to route optimization! 📈⛽',
      timestamp: '2:33 PM',
      reactions: [
        { emoji: '📈', count: 5 },
        { emoji: '💰', count: 3 },
      ],
    },
    {
      id: '4',
      user: 'Alex (Fleet Manager)',
      avatar: '👨‍🔧',
      text: 'All drivers now have digital BOLs loaded. Zero paperwork delays! 📱',
      timestamp: '2:34 PM',
      reactions: [
        { emoji: '📱', count: 7 },
        { emoji: '🔥', count: 2 },
      ],
    },
  ];

  useEffect(() => {
    // Initialize with some users
    setUsers(sampleUsers.slice(0, 3));
    setCurrentUser('Sarah (Dispatcher)');

    // Phase 1: Add first message (faster)
    setTimeout(() => {
      setMessages([sampleMessages[0]]);
    }, 300);

    // Phase 2: Show typing for Mike (faster)
    setTimeout(() => {
      setShowTyping(true);
      setCurrentUser('Mike (Driver)');
    }, 1000);

    // Phase 3: Add Mike's message (faster)
    setTimeout(() => {
      setShowTyping(false);
      setMessages((prev) => [...prev, sampleMessages[1]]);
    }, 2200);

    // Phase 4: Simulate reactions being added (faster)
    setTimeout(() => {
      setNewReactions({ '1': true });
    }, 2800);

    // Phase 5: Add more users joining (faster)
    setTimeout(() => {
      setUsers(sampleUsers.slice(0, 5));
      setOnlineCount(18);
    }, 3200);

    // Phase 6: Start huddle (faster)
    setTimeout(() => {
      setHuddle({ active: true, users: 3 });
    }, 3600);

    // Phase 7: Show typing for Emma (faster)
    setTimeout(() => {
      setShowTyping(true);
      setCurrentUser('Emma (Ops Manager)');
    }, 4000);

    // Phase 8: Add Emma's message (faster)
    setTimeout(() => {
      setShowTyping(false);
      setMessages((prev) => [...prev, sampleMessages[2]]);
    }, 5200);

    // Phase 9: More people join huddle (faster)
    setTimeout(() => {
      setHuddle({ active: true, users: 6 });
    }, 5600);

    // Phase 10: Show typing for Alex (faster)
    setTimeout(() => {
      setShowTyping(true);
      setCurrentUser('Alex (Fleet Manager)');
    }, 6000);

    // Phase 11: Add Alex's message (faster)
    setTimeout(() => {
      setShowTyping(false);
      setMessages((prev) => [...prev, sampleMessages[3]]);
    }, 7200);

    // Phase 12: Add more reactions (faster)
    setTimeout(() => {
      setNewReactions({ '3': true, '4': true });
    }, 7600);

    // Continuous animations
    const statusInterval = setInterval(() => {
      setUsers((prev) =>
        prev.map((user) => ({
          ...user,
          status: Math.random() > 0.8 ? 'away' : 'online',
        })),
      );

      // Random online count changes (faster)
      setOnlineCount((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 2000);

    const reactionInterval = setInterval(() => {
      // Simulate new reactions being added (faster)
      const messageIds = ['1', '2', '3', '4'];
      const randomId =
        messageIds[Math.floor(Math.random() * messageIds.length)];
      setNewReactions((prev) => ({ ...prev, [randomId]: true }));

      // Clear reaction animation after a moment
      setTimeout(() => {
        setNewReactions((prev) => ({ ...prev, [randomId]: false }));
      }, 800);
    }, 3000);

    const huddleInterval = setInterval(() => {
      // Simulate huddle users changing (faster)
      setHuddle((prev) => ({
        active: true,
        users: Math.max(
          2,
          Math.min(8, prev.users + (Math.random() > 0.5 ? 1 : -1)),
        ),
      }));
    }, 2500);

    return () => {
      clearInterval(statusInterval);
      clearInterval(reactionInterval);
      clearInterval(huddleInterval);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl h-96 flex">
        {/* Sidebar */}
        <div className="w-64 bg-blue-600 flex flex-col">
          {/* Workspace Header */}
          <div className="p-4 border-b border-blue-500">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center text-white font-bold text-sm">
                TL
              </div>
              <span className="text-white font-semibold">TransLogic Inc</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4 space-y-2">
            <div className="flex items-center space-x-3 text-white/80 hover:text-white cursor-pointer">
              <span>🏠</span>
              <span className="text-sm">Home</span>
            </div>
            <div className="flex items-center space-x-3 text-white/80 hover:text-white cursor-pointer">
              <span>💬</span>
              <span className="text-sm">DMs</span>
            </div>
            <div className="flex items-center space-x-3 text-white/80 hover:text-white cursor-pointer">
              <span>🔔</span>
              <span className="text-sm">Activity</span>
            </div>
          </div>

          {/* Channels */}
          <div className="flex-1 p-4">
            <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-2">
              Channels
            </h3>
            <div className="space-y-1">
              {['# announcements', '# dispatch-ops', '# fleet-alerts'].map(
                (channel, index) => (
                  <div
                    key={`channel-${index}-${channel}`}
                    className={`flex items-center space-x-2 px-2 py-1 rounded cursor-pointer transition-colors ${
                      index === 1
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-sm">#</span>
                    <span className="text-sm">{channel.replace('# ', '')}</span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-blue-500">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm">
                👩‍💼
              </div>
              <span className="text-white text-sm">Sarah (Dispatcher)</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Channel Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="font-semibold text-gray-900"># dispatch-ops</h2>
              <div className="flex items-center space-x-1">
                {users.slice(0, 3).map((user, index) => (
                  <div
                    key={`user-avatar-${user.id}-${index}`}
                    className={`w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs transition-all duration-500 ${
                      user.status === 'online'
                        ? 'ring-2 ring-green-400 ring-offset-1'
                        : ''
                    }`}
                    title={user.name}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      transform:
                        user.status === 'online' ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {user.avatar}
                  </div>
                ))}
                <span
                  className={`text-sm text-gray-500 transition-all duration-300 ${
                    onlineCount > 15 ? 'text-green-600 font-semibold' : ''
                  }`}
                >
                  {onlineCount}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded">
                <span className="text-sm">🎧</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <span className="text-sm">⚙️</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* Google Calendar Event */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-sm font-bold">
                  31
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Fleet Performance Review
                  </div>
                  <div className="text-sm text-gray-600">
                    Today from 1:30-2:00 PST
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs text-gray-500">Google Calendar</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    📅 6
                  </span>
                </div>
              </div>
            </div>

            {/* Huddle Notification */}
            {huddle.active && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 animate-slide-in-left">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-white text-sm">🎧</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 flex items-center space-x-2">
                      <span>A huddle is happening</span>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        LIVE
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Sarah (Dispatcher) and{' '}
                      <span className="font-medium transition-all duration-300">
                        {huddle.users}
                      </span>{' '}
                      drivers are in it.{' '}
                      <span className="text-blue-600 cursor-pointer hover:underline">
                        Join them
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((message, index) => (
              <div
                key={`message-${message.id}-${index}`}
                className="flex space-x-3 animate-slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                  {message.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 text-sm">
                      {message.user}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mt-1">{message.text}</p>
                  {message.reactions && (
                    <div className="flex items-center space-x-2 mt-2">
                      {message.reactions.map((reaction, idx) => (
                        <span
                          key={`reaction-${message.id}-${idx}-${reaction.emoji}`}
                          className={`text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 cursor-pointer transition-all duration-300 ${
                            newReactions[message.id]
                              ? 'animate-bounce bg-blue-100 text-blue-700 ring-2 ring-blue-300'
                              : ''
                          }`}
                        >
                          {reaction.emoji} {reaction.count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {showTyping && (
              <div className="flex space-x-3 animate-slide-in-left">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                  {sampleUsers.find((u) => u.name === currentUser)?.avatar ||
                    '👨‍💻'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 text-sm">
                      {currentUser}
                    </span>
                    <span className="text-xs text-gray-500 animate-pulse">
                      is typing...
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Message #dispatch-ops"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded">
                <span className="text-sm">📎</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <span className="text-sm">📤</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
