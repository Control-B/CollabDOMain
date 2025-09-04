defmodule ChatCore.PresenceChannel do
  use Phoenix.Channel
  alias ChatCore.Presence

  @impl true
  def join("presence:" <> topic, _params, socket) do
    send(self(), :after_join)
    {:ok, assign(socket, :topic, topic)}
  end

  @impl true
  def handle_info(:after_join, socket) do
    user_id = socket.assigns.user_id
    topic = socket.assigns.topic
    
    {:ok, _} = Presence.track(socket, user_id, %{
      online_at: inspect(System.system_time(:second)),
      topic: topic
    })
    
    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

  # Handle presence diff updates
  @impl true
  def handle_in("get_presence", _params, socket) do
    {:reply, {:ok, Presence.list(socket)}, socket}
  end
end
