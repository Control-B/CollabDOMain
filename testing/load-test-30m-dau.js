/**
 * Load Testing Script for 30 Million DAU
 * Using Artillery.js for comprehensive load testing
 */

module.exports = {
  config: {
    target: 'https://api.dispatchar.com',

    // Load testing phases simulating 30M DAU
    phases: [
      // Warm-up phase
      {
        name: 'Warm-up',
        duration: 300, // 5 minutes
        arrivalRate: 100,
        rampTo: 1000,
      },

      // Morning peak (6 AM - 9 AM) - 25% of DAU
      {
        name: 'Morning Peak',
        duration: 3600, // 1 hour
        arrivalRate: 1000,
        rampTo: 2500, // 2,500 users/second = 7.5M users in 3 hours
      },

      // Daytime steady load (9 AM - 5 PM) - 40% of DAU
      {
        name: 'Daytime Load',
        duration: 28800, // 8 hours
        arrivalRate: 1250, // 12M users over 8 hours
      },

      // Evening peak (5 PM - 9 PM) - 30% of DAU
      {
        name: 'Evening Peak',
        duration: 14400, // 4 hours
        arrivalRate: 1875, // 9M users over 4 hours
      },

      // Night time (9 PM - 6 AM) - 5% of DAU
      {
        name: 'Night Load',
        duration: 32400, // 9 hours
        arrivalRate: 167, // 1.5M users over 9 hours
      },

      // Stress test - 150% of normal peak
      {
        name: 'Stress Test',
        duration: 1800, // 30 minutes
        arrivalRate: 3750, // 150% of peak load
      },
    ],

    // Payload configuration
    payload: {
      path: './user-data.csv',
      fields: ['user_id', 'email', 'region', 'device_type'],
    },

    // Global configuration
    defaults: {
      headers: {
        'User-Agent': 'Artillery Load Test v1.0',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },

    // Performance thresholds
    ensure: {
      maxErrorRate: 0.1, // Less than 0.1% error rate
      maxResponseTime: 100, // 95th percentile under 100ms
      averageResponseTime: 50, // Average under 50ms
    },

    // Plugins for enhanced testing
    plugins: {
      'artillery-plugin-statsd': {
        host: 'monitoring.dispatchar.com',
        port: 8125,
        prefix: 'load-test',
      },
      'artillery-plugin-cloudwatch': {
        region: 'us-east-1',
        namespace: 'LoadTest/CollabAzure',
      },
    },
  },

  scenarios: [
    // Web Application Scenarios
    {
      name: 'Web User Journey',
      weight: 40, // 40% of traffic
      engine: 'http',
      flow: [
        // Authentication flow
        {
          post: {
            url: '/auth/login',
            json: {
              email: '{{ email }}',
              password: 'test-password-{{ user_id }}',
            },
            capture: [
              { json: '$.token', as: 'authToken' },
              { json: '$.user.id', as: 'userId' },
            ],
          },
          expect: [{ statusCode: 200 }, { hasProperty: 'token' }],
        },

        // Get user dashboard
        {
          get: {
            url: '/api/dashboard',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
          },
          expect: [{ statusCode: 200 }, { contentType: 'application/json' }],
        },

        // Fetch channels/conversations
        {
          get: {
            url: '/api/channels',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
            capture: [{ json: '$.channels[0].id', as: 'channelId' }],
          },
          expect: [{ statusCode: 200 }, { hasProperty: 'channels' }],
        },

        // Get channel messages
        {
          get: {
            url: '/api/channels/{{ channelId }}/messages',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
          },
          expect: [{ statusCode: 200 }],
        },

        // Send a message
        {
          post: {
            url: '/api/channels/{{ channelId }}/messages',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
            json: {
              content:
                'Load test message from user {{ userId }} at {{ $timestamp }}',
              type: 'text',
            },
          },
          expect: [{ statusCode: 201 }],
        },

        // File upload simulation
        {
          post: {
            url: '/api/files/upload',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
            formData: {
              file: '@./test-files/sample-document.pdf',
              channel_id: '{{ channelId }}',
            },
          },
          expect: [{ statusCode: 201 }],
        },

        // Search functionality
        {
          get: {
            url: '/api/search?q=test&type=messages',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
          },
          expect: [{ statusCode: 200 }],
        },
      ],
    },

    // Mobile Application Scenarios
    {
      name: 'Mobile User Journey',
      weight: 50, // 50% of traffic (higher mobile usage)
      engine: 'http',
      flow: [
        // Mobile authentication
        {
          post: {
            url: '/auth/mobile/login',
            json: {
              email: '{{ email }}',
              device_id: 'device-{{ user_id }}',
              device_type: '{{ device_type }}',
              app_version: '1.0.0',
            },
            capture: [
              { json: '$.token', as: 'authToken' },
              { json: '$.refresh_token', as: 'refreshToken' },
            ],
          },
          expect: [{ statusCode: 200 }],
        },

        // Sync offline messages
        {
          get: {
            url: '/api/mobile/sync?last_sync={{ $timestamp }}',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
          },
          expect: [{ statusCode: 200 }],
        },

        // Push notification registration
        {
          post: {
            url: '/api/mobile/push-token',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
            json: {
              token: 'push-token-{{ user_id }}',
              platform: '{{ device_type }}',
            },
          },
          expect: [{ statusCode: 200 }],
        },

        // Location update (for dispatch features)
        {
          post: {
            url: '/api/mobile/location',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
            json: {
              latitude: 40.7128,
              longitude: -74.006,
              accuracy: 10,
              timestamp: '{{ $timestamp }}',
            },
          },
          expect: [{ statusCode: 200 }],
        },

        // Quick message send
        {
          post: {
            url: '/api/mobile/quick-message',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
            json: {
              recipient_id: 'user-{{ $randomInt(1, 1000) }}',
              message: 'Quick message from mobile user {{ userId }}',
              priority: 'normal',
            },
          },
          expect: [{ statusCode: 201 }],
        },
      ],
    },

    // WebSocket/Real-time Scenarios
    {
      name: 'Real-time WebSocket',
      weight: 10, // 10% dedicated WebSocket testing
      engine: 'ws',
      flow: [
        // WebSocket connection
        {
          connect: {
            url: 'wss://chat.dispatchar.com/socket/websocket',
            headers: {
              Authorization: 'Bearer {{ authToken }}',
            },
          },
        },

        // Join presence channel
        {
          send: {
            channel: 'presence:lobby',
            event: 'phx_join',
            payload: {
              user_id: '{{ userId }}',
              status: 'online',
            },
          },
        },

        // Join user-specific channel
        {
          send: {
            channel: 'user:{{ userId }}',
            event: 'phx_join',
            payload: {},
          },
        },

        // Send periodic heartbeats
        {
          loop: [
            {
              send: {
                channel: 'phoenix',
                event: 'heartbeat',
                payload: {},
              },
            },
            { think: 30 }, // 30 second intervals
          ],
          count: 10,
        },

        // Simulate typing indicators
        {
          loop: [
            {
              send: {
                channel: 'channel:{{ channelId }}',
                event: 'typing_start',
                payload: { user_id: '{{ userId }}' },
              },
            },
            { think: 2 },
            {
              send: {
                channel: 'channel:{{ channelId }}',
                event: 'typing_stop',
                payload: { user_id: '{{ userId }}' },
              },
            },
            { think: 15 },
          ],
          count: 5,
        },
      ],
    },
  ],

  // Custom functions for dynamic data
  processor: {
    // Generate realistic user data
    generateUserData: (context, events, done) => {
      context.vars.timestamp = Date.now();
      context.vars.randomChannelId = `channel-${Math.floor(Math.random() * 1000)}`;
      context.vars.randomUserId = `user-${Math.floor(Math.random() * 10000)}`;
      return done();
    },

    // Log response times for analysis
    logMetrics: (requestParams, response, context, ee, next) => {
      if (response.timings) {
        ee.emit('customStat', 'response.time', response.timings.response);
        ee.emit('customStat', 'dns.time', response.timings.lookup);
        ee.emit('customStat', 'tcp.time', response.timings.connect);
      }
      return next();
    },

    // Validate response structure
    validateResponse: (requestParams, response, context, ee, next) => {
      if (response.statusCode >= 400) {
        ee.emit('customStat', 'errors.4xx', 1);
      }
      if (response.statusCode >= 500) {
        ee.emit('customStat', 'errors.5xx', 1);
      }
      return next();
    },
  },
};

// Artillery CLI command examples:
// npm install -g artillery
//
// Basic load test:
// artillery run load-test-30m-dau.js
//
// With custom target:
// artillery run --target https://staging.dispatchar.com load-test-30m-dau.js
//
// Generate test report:
// artillery run --output report.json load-test-30m-dau.js
// artillery report report.json
//
// Real-time monitoring:
// artillery run --output report.json load-test-30m-dau.js | npx artillery-plugin-cloudwatch



