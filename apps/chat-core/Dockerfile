# Elixir Chat Core (stub)
FROM elixir:1.16-alpine AS build
RUN apk add --no-cache build-base
WORKDIR /app
ENV MIX_ENV=prod
COPY mix.exs .
RUN mix local.hex --force && mix deps.get --only $MIX_ENV
COPY . .
RUN mix compile

FROM elixir:1.16-alpine
WORKDIR /app
ENV MIX_ENV=prod PORT=4000
# Install deps in runtime image to avoid relying on release artifacts
COPY mix.exs .
RUN mix local.hex --force && mix deps.get --only $MIX_ENV
COPY . .
RUN mix compile
EXPOSE 4000
CMD ["mix", "phx.server"]
