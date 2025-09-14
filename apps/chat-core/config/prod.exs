# Production configuration for Phoenix Chat Service
# Optimized for 30 million DAU scale

import Config

# Database configuration with connection pooling
config :chat_core, ChatCore.Repo,
  url: System.get_env("DATABASE_URL"),
  pool_size: 100,  # Increased pool size for high concurrency
  queue_target: 5000,
  queue_interval: 10000,
  timeout: 15000,
  ownership_timeout: 30000,
  
  # Advanced pooling configuration
  pool: Ecto.Adapters.SQL.Sandbox,
  prepare: :named,
  parameters: [
    plan_cache_mode: "force_custom_plan"
  ],
  
  # Read replica configuration
  read_repo: ChatCore.ReadRepo,
  replica_pool_size: 50,
  
  # Connection optimization
  ssl_opts: [
    verify: :verify_peer,
    cacertfile: "/etc/ssl/certs/ca-certificates.crt",
    depth: 2,
    customize_hostname_check: [
      match_fun: :public_key.pkix_verify_hostname_match_fun(:https)
    ]
  ]

# Phoenix Endpoint configuration for scale
config :chat_core, ChatCoreWeb.Endpoint,
  # Multi-node clustering
  url: [host: System.get_env("HOST"), port: 80],
  secret_key_base: System.get_env("SECRET_KEY_BASE"),
  
  # WebSocket configuration for massive concurrent connections
  socket: [
    # Connection limits
    transport_options: [
      max_connections: 1_000_000,  # 1M concurrent connections per node
      timeout: 60_000,
      cowboy_opts: [
        max_keepalive: 1000,
        max_connections: 100_000,
        num_acceptors: 1000,
        max_request_line_length: 8192,
        max_header_name_length: 64,
        max_header_value_length: 4096,
        max_headers: 100,
        timeout: 60_000,
        
        # TCP optimization
        tcp_opts: [
          :binary,
          {:nodelay, true},
          {:send_timeout, 30_000},
          {:send_timeout_close, true},
          {:reuseaddr, true},
          {:keepalive, true},
          {:backlog, 1024}
        ]
      ]
    ]
  ],
  
  # HTTP configuration
  http: [
    port: String.to_integer(System.get_env("PORT") || "4000"),
    transport_options: [
      socket_opts: [:inet6, :binary, {:nodelay, true}, {:reuseaddr, true}],
      num_acceptors: 1000,
      max_connections: 100_000
    ]
  ],
  
  # HTTPS configuration  
  https: [
    port: 443,
    cipher_suite: :strong,
    keyfile: System.get_env("SSL_KEY_PATH"),
    certfile: System.get_env("SSL_CERT_PATH"),
    transport_options: [
      socket_opts: [:inet6, :binary, {:nodelay, true}, {:reuseaddr, true}],
      num_acceptors: 1000,
      max_connections: 100_000
    ]
  ],
  
  # Security headers
  force_ssl: [rewrite_on: [:x_forwarded_proto]],
  
  # Static file serving (delegated to CDN in production)
  static_url: [host: System.get_env("CDN_HOST"), port: 443, scheme: "https"],
  
  # Session configuration with Redis
  session: [
    store: :redis,
    key: "_chat_core_key",
    signing_salt: System.get_env("SESSION_SIGNING_SALT"),
    encryption_salt: System.get_env("SESSION_ENCRYPTION_SALT"),
    
    # Redis session store
    redis_opts: [
      host: System.get_env("REDIS_HOST"),
      port: String.to_integer(System.get_env("REDIS_PORT") || "6379"),
      database: String.to_integer(System.get_env("REDIS_DB") || "0"),
      pool_size: 20
    ]
  ]

# Phoenix PubSub with Redis adapter for clustering
config :chat_core, ChatCore.PubSub,
  adapter: Phoenix.PubSub.Redis,
  redis_host: System.get_env("REDIS_HOST"),
  redis_port: String.to_integer(System.get_env("REDIS_PORT") || "6379"),
  redis_password: System.get_env("REDIS_PASSWORD"),
  
  # Clustering configuration
  node_name: System.get_env("NODE_NAME"),
  pool_size: 50,
  
  # Message optimization
  serializer: Phoenix.PubSub.MessagePack,
  compression: :gzip

# Presence tracking optimization
config :chat_core, ChatCoreWeb.Presence,
  # Use Redis for distributed presence
  adapter: Phoenix.Presence.Redis,
  redis_host: System.get_env("REDIS_HOST"),
  redis_port: String.to_integer(System.get_env("REDIS_PORT") || "6379"),
  
  # Presence optimization
  sync_interval: 5_000,  # 5 seconds
  max_age: 30_000,       # 30 seconds
  gc_interval: 10_000    # 10 seconds

# Logger configuration for production
config :logger,
  level: :info,
  backends: [
    :console
  ]

config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id, :user_id, :channel, :topic]

# config :logger, :error_log,
#   path: "/var/log/chat_core/error.log",
#   level: :error,
#   rotate: %{max_bytes: 10_485_760, keep: 5}  # 10MB, keep 5 files

# config :logger, :json_log,
#   path: "/var/log/chat_core/app.log",
#   level: :info,
#   formatter: LoggerJSON.Formatters.GoogleCloud,
#   metadata: :all

# Application-specific optimizations
config :chat_core,
  # Message processing
  message_processing: [
    # Batch processing for performance
    batch_size: 1000,
    batch_timeout: 100,  # 100ms
    
    # Rate limiting
    rate_limit: [
      # Per user limits
      user_messages_per_minute: 60,
      user_channels_per_hour: 100,
      
      # Global limits
      global_messages_per_second: 10_000
    ],
    
    # Message persistence
    persistence: [
      # Async write to database
      async_writes: true,
      write_batch_size: 500,
      write_interval: 1000,  # 1 second
      
      # Message retention
      message_ttl: 86_400_000,  # 24 hours in milliseconds
      archived_message_ttl: 2_592_000_000  # 30 days
    ]
  ],
  
  # Channel management
  channel_management: [
    # Auto-cleanup inactive channels
    inactive_channel_timeout: 3_600_000,  # 1 hour
    cleanup_interval: 300_000,            # 5 minutes
    
    # Channel limits
    max_channels_per_user: 1000,
    max_users_per_channel: 10_000
  ],
  
  # File upload optimization
  file_uploads: [
    # Async processing
    async_processing: true,
    
    # Storage configuration
    storage: [
      adapter: :s3,
      bucket: System.get_env("S3_BUCKET"),
      region: System.get_env("AWS_REGION"),
      
      # Multipart upload for large files
      multipart_threshold: 100_000_000,  # 100MB
      multipart_chunksize: 10_000_000,   # 10MB chunks
      
      # CDN integration
      cdn_url: System.get_env("CDN_URL")
    ],
    
    # File processing
    processing: [
      # Image optimization
      image_compression: true,
      image_formats: ["webp", "avif", "jpg"],
      max_image_size: 5_000_000,  # 5MB
      
      # Document processing
      document_preview: true,
      virus_scanning: true
    ]
  ]

# Telemetry and monitoring - disabled for now

# Clustering with libcluster - disabled for now
# config :libcluster,
#   topologies: [
#     k8s: [
#       strategy: Cluster.Strategy.Kubernetes,
#       config: [
#         mode: :dns,
#         kubernetes_node_basename: "chat-core",
#         kubernetes_selector: "app=chat-core",
#         kubernetes_namespace: System.get_env("K8S_NAMESPACE", "default"),
#         polling_interval: 10_000
#       ]
#     ]
#   ]

# Runtime configuration
config :chat_core, :runtime,
  # VM optimization
  schedulers_online: System.schedulers_online(),
  max_processes: 2_097_152,  # 2M processes
  
  # Memory management
  memory: [
    # ETS table optimization
    ets_limit: 32768,
    
    # Process memory optimization
    process_limit: 2_097_152,
    min_heap_size: 233,
    min_bin_vheap_size: 46422,
    max_heap_size: %{size: 0, kill: true, error_logger: true}
  ]