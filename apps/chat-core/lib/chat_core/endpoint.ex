defmodule ChatCore.Endpoint do
  use Phoenix.Endpoint, otp_app: :chat_core

  # Session configuration
  @session_options [
    store: :cookie,
    key: "_chat_core_key",
    signing_salt: "chat_core",
    same_site: "Lax"
  ]

  # Socket configuration
  socket "/socket", ChatCore.UserSocket,
    websocket: true,
    longpoll: false

  # CORS configuration
  plug CORSPlug,
    origin: ["http://localhost:3000", "https://*.azurecontainerapps.io"],
    credentials: true

  # Health check endpoint
  plug Plug.Static,
    at: "/",
    from: :chat_core,
    gzip: false,
    only: ~w(health)

  # Request parsing
  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug Plug.MethodOverride
  plug Plug.Head
  plug Plug.Session, @session_options

  # Router
  plug ChatCore.Router
end
