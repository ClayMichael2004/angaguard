#!/usr/bin/env bash
set -e

# ==============================================================================
# AngaGuard Unified Service Orchestrator
# Starts: Go Core Backend (8080), Python AI Bridge (5000), Vite Frontend (3000)
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${GREEN}${BOLD}"
echo "  🌿 AngaGuard - Decentralized dMRV Oracle & SME ESG Platform"
echo "  ============================================================"
echo -e "${NC}"

cleanup() {
    echo -e "\n${YELLOW}==> Shutting down AngaGuard services...${NC}"
    kill 0 2>/dev/null || true
    wait 2>/dev/null || true
    echo -e "${GREEN}==> All AngaGuard services stopped.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# 1. Build C++ Simulator if not built
if [ ! -f "edge-firmware/bin/simulator" ]; then
    echo -e "${CYAN}==> Compiling edge firmware simulator...${NC}"
    make -C edge-firmware all > /dev/null 2>&1 || true
fi

# 2. Start Go Core Backend
echo -e "${BLUE}==> [1/3] Launching Go Core Backend & dMRV Oracle on :8080...${NC}"
(
    cd "$ROOT_DIR/core-backend"
    go run cmd/server/main.go
) &
BACKEND_PID=$!

# Wait briefly for backend to bind port
sleep 1.5

# 3. Start Python AI & Telephony Bridge
echo -e "${BLUE}==> [2/3] Launching Python AI & Telephony Bridge on :5000...${NC}"
(
    cd "$ROOT_DIR/ai-telephony-bridge"
    uvicorn main:app --host 0.0.0.0 --port 5000
) &
BRIDGE_PID=$!

# Wait briefly for bridge to bind port
sleep 1.5

# 4. Start React Web Frontend
echo -e "${BLUE}==> [3/3] Launching React Web Frontend on :3000...${NC}"
(
    cd "$ROOT_DIR/web-frontend"
    npm run dev
) &
FRONTEND_PID=$!

sleep 2

echo ""
echo -e "${GREEN}${BOLD}✔ AngaGuard Full Stack is RUNNING!${NC}"
echo -e "------------------------------------------------------------"
echo -e "  🌐 ${BOLD}Web Dashboard:${NC}       ${CYAN}http://localhost:3000${NC}"
echo -e "  ⚙️  ${BOLD}Core Backend API:${NC}    ${CYAN}http://localhost:8080/api/stats${NC}"
echo -e "  🤖 ${BOLD}AI Telephony Bridge:${NC} ${CYAN}http://localhost:5000${NC}"
echo -e "  ⚡ ${BOLD}WebSocket Stream:${NC}    ${CYAN}ws://localhost:8080/ws${NC}"
echo -e "------------------------------------------------------------"
echo -e "${YELLOW}Press [Ctrl+C] at any time to stop all services.${NC}"
echo ""

# Wait on all child background processes
wait
