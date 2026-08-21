.PHONY: all build test clean run run-all dev run-backend run-frontend run-bridge simulate-valid simulate-ash-cheating simulate-sand-padding docker-build docker-up docker-down

all: build test

build:
	@echo "==> Building Go Core Backend..."
	cd core-backend && go build -o bin/server cmd/server/main.go
	@echo "==> Building C++ Firmware & Simulator..."
	$(MAKE) -C edge-firmware all
	@echo "==> Building React Web Frontend..."
	cd web-frontend && npm run build

test:
	@echo "==> Testing Go Core Backend & Loophole Defenses..."
	cd core-backend && go test -v ./...
	@echo "==> Testing C++ Firmware & Hardware Logic..."
	$(MAKE) -C edge-firmware test
	@echo "==> Testing Python AI & Telephony Bridge..."
	cd ai-telephony-bridge && python3 -m unittest test_bridge.py

# Unified single-command launcher
run: run-all

dev: run-all

run-all:
	@./start.sh

setup-db:
	@echo "==> Setting up AngaGuard SQLite Database & Seeding >= 10 Users..."
	./scripts/setup_db.sh

# Individual service launchers
run-backend:
	@echo "==> Starting AngaGuard Go Core Backend on :8080..."
	cd core-backend && go run cmd/server/main.go

run-bridge:
	@echo "==> Starting Python AI & Telephony Bridge on :5000..."
	cd ai-telephony-bridge && (./venv/bin/uvicorn main:app --host 0.0.0.0 --port 5000 --reload || uvicorn main:app --host 0.0.0.0 --port 5000 --reload)


run-frontend:
	@echo "==> Starting React Web Frontend on :3000..."
	cd web-frontend && npm run dev

# Edge Hardware Simulation Commands
simulate-valid:
	@echo "==> Simulating Valid Biomass Pyrolysis Burn..."
	./edge-firmware/bin/simulator valid

simulate-ash-cheating:
	@echo "==> Simulating Ash Cheating Attack..."
	./edge-firmware/bin/simulator ash_cheating

simulate-sand-padding:
	@echo "==> Simulating Sand Padding Attack..."
	./edge-firmware/bin/simulator sand_padding

# Pipe simulated payloads directly into the live dMRV Oracle
feed-valid:
	@echo "==> Ingesting Valid Telemetry into live Oracle..."
	./edge-firmware/bin/simulator valid | curl -s -X POST -H "Content-Type: application/json" -d @- http://localhost:8080/api/telemetry

feed-ash-cheating:
	@echo "==> Ingesting Ash Cheating Attack payload into live Oracle (Expect rejection)..."
	./edge-firmware/bin/simulator ash_cheating | curl -s -X POST -H "Content-Type: application/json" -d @- http://localhost:8080/api/telemetry

feed-sand-padding:
	@echo "==> Ingesting Sand Padding Attack payload into live Oracle (Expect rejection)..."
	./edge-firmware/bin/simulator sand_padding | curl -s -X POST -H "Content-Type: application/json" -d @- http://localhost:8080/api/telemetry

# Docker Orchestration Commands
docker-build:
	@echo "==> Building Docker images for all services..."
	docker compose build

docker-up:
	@echo "==> Launching stack via Docker Compose..."
	docker compose up -d

docker-down:
	@echo "==> Stopping Docker Compose stack..."
	docker compose down

clean:
	rm -rf core-backend/bin edge-firmware/bin web-frontend/dist
