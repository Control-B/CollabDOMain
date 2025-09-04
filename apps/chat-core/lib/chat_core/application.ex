defmodule ChatCore.Application do
  @moduledoc false
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # PubSub for real-time features
      {Phoenix.PubSub, name: ChatCore.PubSub},
      # Presence tracking
      ChatCore.Presence,
      # Phoenix Endpoint
      ChatCore.Endpoint
    ]
    opts = [strategy: :one_for_one, name: ChatCore.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
