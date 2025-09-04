defmodule ChatCore.HealthController do
  use Phoenix.Controller
  
  def check(conn, _params) do
  json(conn, %{status: "healthy", service: "chat-core", timestamp: DateTime.utc_now() |> DateTime.to_iso8601()})
  end
end
