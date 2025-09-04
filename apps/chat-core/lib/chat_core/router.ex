defmodule ChatCore.Router do
  use Phoenix.Router
  import Plug.Conn
  import Phoenix.Controller

  pipeline :api do
    plug :accepts, ["json"]
    plug :put_secure_browser_headers
  end

  scope "/", ChatCore do
    pipe_through :api
    
    get "/health", HealthController, :check
    get "/rooms", RoomController, :index
    post "/rooms", RoomController, :create
    get "/rooms/:id/messages", MessageController, :index
  end
end
