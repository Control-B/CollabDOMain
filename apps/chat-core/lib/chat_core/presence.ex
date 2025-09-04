defmodule ChatCore.Presence do
  use Phoenix.Presence,
    otp_app: :chat_core,
    pubsub_server: ChatCore.PubSub
end
