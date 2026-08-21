#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "==> Setting up AngaGuard SQLite Database & Seeding >= 10 Users..."
cd "$ROOT_DIR/core-backend"

go run ./cmd/setup_db/main.go --reset --db=angaguard.db

echo "==> SQLite Database is ready at $ROOT_DIR/core-backend/angaguard.db"
