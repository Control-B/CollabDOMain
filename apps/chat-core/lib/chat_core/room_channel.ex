defmodule ChatCore.RoomChannel do
  use Phoenix.Channel
  require Logger

  @impl true
  def join("room:" <> room_id, _params, socket) do
    # Verify user has access to this room
    user_id = socket.assigns.user_id
    
    case authorize_room_access(user_id, room_id) do
      :ok ->
        send(self(), :after_join)
        {:ok, %{room_id: room_id, user_id: user_id}, assign(socket, :room_id, room_id)}
      {:error, reason} ->
        {:error, %{reason: reason}}
    end
  end

  @impl true
  def handle_info(:after_join, socket) do
    # Track user presence
    {:ok, _} = ChatCore.Presence.track(socket, socket.assigns.user_id, %{
      online_at: inspect(System.system_time(:second))
    })
    
    # Send presence state to newly joined user
    push(socket, "presence_state", ChatCore.Presence.list(socket))
    {:noreply, socket}
  end

  @impl true
  def handle_in("new_message", %{"body" => body}, socket) do
    user_id = socket.assigns.user_id
    room_id = socket.assigns.room_id
    
    message = %{
      id: generate_message_id(),
      user_id: user_id,
      room_id: room_id,
      body: body,
      timestamp: DateTime.utc_now() |> DateTime.to_iso8601()
    }
    
    # Broadcast to all users in the room
    broadcast(socket, "new_message", message)
    
    # Store message (TODO: integrate with DMS for persistence)
    store_message(message)
    
    {:reply, {:ok, %{message_id: message.id}}, socket}
  end

  @impl true
  def handle_in("typing", %{"typing" => typing}, socket) do
    user_id = socket.assigns.user_id
    
    broadcast_from(socket, "user_typing", %{
      user_id: user_id,
      typing: typing
    })
    
    {:noreply, socket}
  end

  # Handle message reactions
  @impl true
  def handle_in("react_to_message", %{"message_id" => message_id, "reaction" => reaction}, socket) do
    user_id = socket.assigns.user_id
    
    reaction_event = %{
      message_id: message_id,
      user_id: user_id,
      reaction: reaction,
      timestamp: DateTime.utc_now() |> DateTime.to_iso8601()
    }
    
    broadcast(socket, "message_reaction", reaction_event)
    {:reply, :ok, socket}
  end

  defp authorize_room_access(user_id, room_id) do
    # TODO: Implement proper room access control
    # For now, allow all authenticated users
    Logger.info("User #{user_id} joining room #{room_id}")
    case user_id do
      nil -> {:error, :unauthorized}
      _ -> :ok
    end
  end

  defp generate_message_id do
    :crypto.strong_rand_bytes(16) |> Base.encode64()
  end

  defp store_message(message) do
    # TODO: Store in database or send to DMS service
    Logger.info("Storing message: #{inspect(message)}")
  end
end
