'use client';

import { useEffect, useState } from 'react';

export default function AnimatedChat() {
  const [messageCount, setMessageCount] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessageCount((prev) => (prev + 1) % 4);
      }, 1500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const messages = [
    { from: 'driver', text: 'Arrived at pickup location', time: '2:30 PM' },
    { from: 'dispatch', text: 'Great! Load ready?', time: '2:31 PM' },
    { from: 'driver', text: 'Loading now, ETA 5:45 PM', time: '2:35 PM' },
    { from: 'dispatch', text: 'Copy that, customer notified', time: '2:36 PM' },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md h-96 flex flex-col relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Team Chat</h3>
              <div className="flex items-center space-x-2 text-sm opacity-90">
                <div className="w-2 h-2 bg-green-400 rounded-full opacity-80"></div>
                <span>3 online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-3 overflow-hidden">
          {messages.slice(0, messageCount + 1).map((message, idx) => (
            <div
              key={idx}
              className={`flex ${
                message.from === 'driver' ? 'justify-end' : 'justify-start'
              } animate-slide-in-left`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  message.from === 'driver'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.from === 'driver'
                      ? 'text-blue-100'
                      : 'text-gray-500'
                  }`}
                >
                  {message.time}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="flex justify-start animate-slide-in-left">
              <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-float"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-float [animation-delay:0.1s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-float [animation-delay:0.2s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="bg-transparent text-sm outline-none w-full"
                disabled
              />
            </div>
            <button
              className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
              title="Send message"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Attention panel (Messaging) */}
        <div className="absolute left-4 bottom-24 md:bottom-20 w-[85%] max-w-lg">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-400/60 to-indigo-500/60 blur-lg opacity-80 animate-pulse-subtle" />
          <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600/90 text-white rounded-xl p-3 md:p-4 shadow-2xl ring-1 ring-white/10">
            <div className="text-sm md:text-base font-semibold tracking-wide animate-slide-up">
              Stay aligned in real time
            </div>
            <ul className="mt-2 text-xs md:text-sm text-white/90 list-disc list-inside space-y-1">
              <li className="animate-slide-up">Broadcast updates & alerts</li>
              <li className="animate-slide-up-delayed">
                Read receipts and retries
              </li>
              <li className="animate-slide-up-more-delayed">
                Mentions and pinned threads
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
