defmodule ChatCore.UserSocket do
  use Phoenix.Socket

  # Channels
  channel "room:*", ChatCore.RoomChannel
  channel "dm:*", ChatCore.DirectMessageChannel
  channel "presence:*", ChatCore.PresenceChannel

  # Socket params are passed from the client and can be used to verify and authenticate a user
  @impl true
  def connect(%{"token" => token}, socket, _connect_info) do
    case verify_token(token) do
      {:ok, user_id} ->
        socket = assign(socket, :user_id, user_id)
        {:ok, socket}
      {:error, _reason} ->
        :error
    end
  end

  def connect(_params, _socket, _connect_info), do: :error

  # Socket id is used to identify socket connections across multiple nodes
  @impl true
  def id(socket), do: "user_socket:#{socket.assigns.user_id}"

  defp verify_token(token) do
    # JWT verification logic
    signer = Joken.Signer.create("HS256", jwt_secret())
    case Joken.verify(token, signer) do
      {:ok, %{"sub" => user_id}} -> {:ok, user_id}
      {:error, _} -> {:error, :invalid_token}
    end
  end

  defp jwt_secret do
    System.get_env("JWT_SECRET") || "your-secret-key"
  end
end
