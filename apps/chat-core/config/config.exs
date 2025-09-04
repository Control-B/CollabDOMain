import Config

# General application configuration
config :chat_core,
  generators: [context_app: false]

# Configures the endpoint
config :chat_core, ChatCore.Endpoint,
  url: [host: "localhost"],
  adapter: Phoenix.Endpoint.Cowboy2Adapter,
  render_errors: [
    formats: [json: ChatCore.ErrorJSON],
    layout: false
  ],
  pubsub_server: ChatCore.PubSub,
  live_view: [signing_salt: "chat_core_salt"],
  http: [ip: {0, 0, 0, 0}, port: String.to_integer(System.get_env("PORT") || "4000")],
  secret_key_base: System.get_env("SECRET_KEY_BASE") || "your-secret-key-base-must-be-at-least-64-characters-long-for-security",
  check_origin: false

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config
import_config "#{config_env()}.exs"
