.PHONY: all build test clean run-backend run-frontend run-bridge simulate

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

run-backend:
	@echo "==> Starting AngaGuard Go Core Backend on :8080..."
	cd core-backend && go run cmd/server/main.go

run-bridge:
	@echo "==> Starting Python AI & Telephony Bridge on :5000..."
	cd ai-telephony-bridge && uvicorn main:app --host 0.0.0.0 --port 5000 --reload

run-frontend:
	@echo "==> Starting React Web Frontend on :3000..."
	cd web-frontend && npm run dev

simulate-valid:
	@echo "==> Simulating Valid Biomass Pyrolysis Burn..."
	./edge-firmware/bin/simulator valid

simulate-ash-cheating:
	@echo "==> Simulating Ash Cheating Attack..."
	./edge-firmware/bin/simulator ash_cheating

simulate-sand-padding:
	@echo "==> Simulating Sand Padding Attack..."
	./edge-firmware/bin/simulator sand_padding

clean:
	rm -rf core-backend/bin edge-firmware/bin web-frontend/dist
