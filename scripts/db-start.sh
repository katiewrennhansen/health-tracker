#!/usr/bin/env bash
# Starts this project's own Postgres server (port 5433) and creates the database on first run.
# Safe to run repeatedly: each step is skipped if it's already done.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_DIR="$ROOT_DIR/.postgres-data"
PORT=5433
DB_NAME=health_tracker

if [ ! -f "$DATA_DIR/PG_VERSION" ]; then
  initdb -D "$DATA_DIR" --auth=trust --username=postgres
fi

if ! pg_isready -q -h localhost -p "$PORT"; then
  pg_ctl -D "$DATA_DIR" -l "$DATA_DIR/postgres.log" -o "-p $PORT -h localhost" -w start
fi

if [ -z "$(psql -h localhost -p "$PORT" -U postgres -d postgres -Atc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'")" ]; then
  createdb -h localhost -p "$PORT" -U postgres "$DB_NAME"
fi

echo "Postgres ready: postgres://postgres@localhost:$PORT/$DB_NAME"
