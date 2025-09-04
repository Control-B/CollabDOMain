defmodule ChatCore.RoomController do
  use Phoenix.Controller
  require Logger

  def index(conn, _params) do
    # TODO: Get user's accessible rooms from database
    rooms = [
      %{id: "general", name: "General", description: "General discussion"},
      %{id: "tech", name: "Technology", description: "Tech discussions"},
      %{id: "random", name: "Random", description: "Random chatter"}
    ]
    
    json(conn, %{rooms: rooms})
  end

  def create(conn, %{"name" => name, "description" => description}) do
    # TODO: Create room in database
    room_id = generate_room_id()
    
    room = %{
      id: room_id,
      name: name,
      description: description,
      created_at: DateTime.utc_now(),
      created_by: get_user_id_from_auth(conn)
    }
    
    Logger.info("Created room: #{inspect(room)}")
    
    json(conn, %{room: room})
  end

  def create(conn, _params) do
    conn
    |> put_status(:bad_request)
    |> json(%{error: "Missing required fields: name, description"})
  end

  defp generate_room_id do
    :crypto.strong_rand_bytes(8) |> Base.encode64() |> String.replace(~r/[^a-zA-Z0-9]/, "")
  end

  defp get_user_id_from_auth(_conn) do
    # TODO: Extract from JWT token
    "anonymous"
  end
end
