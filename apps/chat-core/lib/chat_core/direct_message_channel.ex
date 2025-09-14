defmodule ChatCore.DirectMessageChannel do
  use Phoenix.Channel
  require Logger

  @impl true
  def join("dm:" <> dm_id, _params, socket) do
    user_id = socket.assigns.user_id
    
    case authorize_dm_access(user_id, dm_id) do
      :ok ->
        send(self(), :after_join)
        {:ok, %{dm_id: dm_id, user_id: user_id}, assign(socket, :dm_id, dm_id)}
      {:error, reason} ->
        {:error, %{reason: reason}}
    end
  end

  @impl true
  def handle_info(:after_join, socket) do
    # Track user presence in DM
    {:ok, _} = ChatCore.Presence.track(socket, socket.assigns.user_id, %{
      online_at: inspect(System.system_time(:second)),
      dm_id: socket.assigns.dm_id
    })
    
    # Send presence state to newly joined user
    push(socket, "presence_state", ChatCore.Presence.list(socket))
    {:noreply, socket}
  end

  @impl true
  def handle_in("new_message", %{"body" => body, "message_type" => message_type}, socket) do
    user_id = socket.assigns.user_id
    dm_id = socket.assigns.dm_id
    
    message = %{
      id: generate_message_id(),
      user_id: user_id,
      dm_id: dm_id,
      body: body,
      message_type: message_type || "text",
      timestamp: DateTime.utc_now() |> DateTime.to_iso8601()
    }
    
    # Broadcast to both participants in the DM
    broadcast(socket, "new_message", message)
    
    # Store message
    store_dm_message(message)
    
    # Send push notification to offline participant
    send_push_notification(dm_id, user_id, message)
    
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

  @impl true
  def handle_in("message_read", %{"message_id" => message_id}, socket) do
    user_id = socket.assigns.user_id
    dm_id = socket.assigns.dm_id
    
    # Mark message as read
    mark_message_as_read(message_id, user_id)
    
    # Broadcast read receipt
    broadcast_from(socket, "message_read", %{
      message_id: message_id,
      user_id: user_id,
      read_at: DateTime.utc_now() |> DateTime.to_iso8601()
    })
    
    {:noreply, socket}
  end

  @impl true
  def handle_in("send_file", %{"file_data" => file_data, "filename" => filename, "mime_type" => mime_type}, socket) do
    user_id = socket.assigns.user_id
    dm_id = socket.assigns.dm_id
    
    # Process file upload
    case process_file_upload(file_data, filename, mime_type, user_id) do
      {:ok, file_url} ->
        message = %{
          id: generate_message_id(),
          user_id: user_id,
          dm_id: dm_id,
          body: filename,
          message_type: "file",
          file_url: file_url,
          mime_type: mime_type,
          timestamp: DateTime.utc_now() |> DateTime.to_iso8601()
        }
        
        broadcast(socket, "new_message", message)
        store_dm_message(message)
        send_push_notification(dm_id, user_id, message)
        
        {:reply, {:ok, %{message_id: message.id, file_url: file_url}}, socket}
      
      {:error, reason} ->
        {:reply, {:error, %{reason: reason}}, socket}
    end
  end

  defp authorize_dm_access(user_id, dm_id) do
    # Check if user is participant in this DM
    case get_dm_participants(dm_id) do
      participants when is_list(participants) ->
        if user_id in participants do
          :ok
        else
          {:error, :unauthorized}
        end
      _ ->
        {:error, :dm_not_found}
    end
  end

  defp get_dm_participants(dm_id) do
    # TODO: Query database for DM participants
    # For now, extract from dm_id format: "user1_user2" or "phone1_phone2"
    String.split(dm_id, "_")
  end

  defp generate_message_id do
    :crypto.strong_rand_bytes(16) |> Base.encode64()
  end

  defp store_dm_message(message) do
    # TODO: Store in database
    Logger.info("Storing DM message: #{inspect(message)}")
  end

  defp mark_message_as_read(message_id, user_id) do
    # TODO: Update read status in database
    Logger.info("Marking message #{message_id} as read by user #{user_id}")
  end

  defp process_file_upload(file_data, filename, mime_type, user_id) do
    # TODO: Upload to blob storage and return URL
    # For now, return a mock URL
    {:ok, "https://storage.example.com/files/#{filename}"}
  end

  defp send_push_notification(dm_id, sender_id, message) do
    # TODO: Send push notification to offline participants
    Logger.info("Sending push notification for DM #{dm_id}: #{message.body}")
  end
end


