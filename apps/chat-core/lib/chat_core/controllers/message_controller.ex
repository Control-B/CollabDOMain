defmodule ChatCore.MessageController do
  use Phoenix.Controller
  require Logger

  def index(conn, %{"id" => room_id} = params) do
    # TODO: Get messages from database
    limit = Map.get(params, "limit", "50") |> String.to_integer()
    offset = Map.get(params, "offset", "0") |> String.to_integer()
    
    # Mock messages for now
    messages = generate_mock_messages(room_id, limit, offset)
    
    json(conn, %{
      room_id: room_id,
      messages: messages,
      pagination: %{
        limit: limit,
        offset: offset,
        total: 100 # TODO: Get actual count
      }
    })
  end

  defp generate_mock_messages(room_id, limit, offset) do
    Logger.info("Fetching #{limit} messages for room #{room_id} with offset #{offset}")
    
    for i <- (offset + 1)..(offset + limit) do
      %{
        id: "msg_#{i}",
        room_id: room_id,
        user_id: "user_#{rem(i, 3) + 1}",
        body: "This is message number #{i}",
        timestamp: DateTime.utc_now() |> DateTime.add(-i * 60, :second) |> DateTime.to_iso8601(),
        reactions: []
      }
    end
  end
end
