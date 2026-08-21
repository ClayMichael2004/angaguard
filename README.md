# 🌿 AngaGuard

**Decentralized IoT & Cryptographic dMRV Oracle for SME ESG Alignment, Zero-Friction Financial Inclusion, and Durable Carbon Harvesting**

[![Go Version](https://img.shields.io/badge/Go-1.22+-00ADD8?style=flat-square&logo=go)](https://golang.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![C++17](https://img.shields.io/badge/C++-17-00599C?style=flat-square&logo=c%2B%2B)](https://isocpp.org)
[![Docker Compose](https://img.shields.io/badge/Docker-Compose_Ready-2496ED?style=flat-square&logo=docker)](docker-compose.yml)
[![Safaricom M-Pesa](https://img.shields.io/badge/Daraja-B2C_Settled-00C300?style=flat-square)](https://developer.safaricom.co.ke)
[![Kenya NCR](https://img.shields.io/badge/Registry-Kenya_NCR_2026-10b981?style=flat-square)](documentation.md)

---

## 📌 Executive Overview

In emerging agricultural hubs across Western Kenya and the Rift Valley (Kisumu, Kakamega, Bungoma, Eldoret, Kericho), Small and Medium Enterprises (SMEs) face immense pressure from commercial lenders and international buyers (such as the EU CSRD) to account for and decarbonize their supply chains.

Traditional carbon credit verification relies on legacy Validation and Verification Bodies (VVBs) flying in manual auditors at prohibitive costs of **$30,000 to $60,000 per audit**, completely locking out local SMEs and rural smallholders.

**AngaGuard** eliminates this barrier through an end-to-end decentralized hardware-to-software digital Measurement, Reporting, and Verification (**dMRV**) network. By converting standard 200-liter modified steel oil drums into smart, edge-audited carbon removal kilns, AngaGuard tracks biochar carbon sequestration at the physical source and pipes the verified data into an append-only SHA-256 blockchain ledger connected to the **Kenya National Carbon Registry (NCR)** and **Carbonmark sandbox marketplace** with instant **Safaricom M-Pesa B2C payouts**.

---

## 🏗️ System Architecture & Interlocking Pods

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                         ANGAGUARD END-TO-END DATA & TRUST PIPELINE                       │
└──────────────────────────────────────────────────────────────────────────────────────────┘
 [Hardware Edge Pod]             [AI & Bridge Pod]             [Go Core Backend Pod]
 • KY-013 NTC Thermistor         • Serial/LoRa Forwarder       • dMRV Physics Validation
 • HC-SR04 Ultrasonic Sonar      • AI Anomaly Classifier       • SHA-256 Blockchain Ledger
 • RGB Status Beacon             • Swahili Voice Worker        • Carbonmark Sandbox API
 • WaziDev Microcontroller       • SMS/USSD Gateway            • M-Pesa B2C Split Engine
         │                              │                               │
         ▼                              ▼                               ▼
 [Raw Serial/LoRa] ─────────────► [Python Pipeline] ────────────► [Go API + SQLite]
                                                                        │
                                ┌───────────────────────────────────────┴──────────────────┐
                                ▼                                                          ▼
                     [Full-Length Web SaaS App]                                  [2G Telephony Stack]
                     • Left Navigation Sidebar                                   • USSD Engine (*384*55#)
                     • 3D Kiln Digital Twin (Three.js)                           • Africa's Talking Gateway
                     • Corner Account Identity Badges                            • Active Voice IVR Engine
                     • Cream/Dark Mode System Auth                               • Instant M-Pesa Disbursal
```

### Pod Directory Breakdown

| Pod | Technology Stack | Key Responsibilities |
| :--- | :--- | :--- |
| **`core-backend/`** | Go (Gin-Gonic), SQLite (WAL), SHA-256 Cryptography | Stoichiometric dMRV validation, blockchain block minting, M-Pesa B2C split engine, spatial-temporal geofencing, ISSB report generator. |
| **`edge-firmware/`** | C++17, WaziDev Arduino Toolchain | 5-point median sonar filter, Steinhart-Hart thermistor reading, silicon UID injection, 50-entry flash ring buffer, standalone simulator. |
| **`ai-telephony-bridge/`** | Python 3, FastAPI, ElevenLabs | Real-time burn curve anomaly classifier, LoRaWAN forwarder, automated Swahili & English IVR voice synthesizer. |
| **`web-frontend/`** | React 18, Vite, TypeScript, Tailwind CSS, Three.js | Full-length SaaS dashboard with left sidebar, 3D kiln twin, M-Pesa cashout with password auth, corner account badges, cream/dark mode. |

---

## ⚡ Quick Reference: Network Endpoints & Ports

| Service | Port | Local URL | Description |
| :--- | :--- | :--- | :--- |
| **Web Frontend** | `3000` | [http://localhost:3000](http://localhost:3000) | Full-length SaaS Portal with Left Sidebar & 3D Twin |
| **Core Backend** | `8080` | [http://localhost:8080](http://localhost:8080) | dMRV Engine, Cryptographic Ledger, M-Pesa API |
| **Core Stats API** | `8080` | [http://localhost:8080/api/stats](http://localhost:8080/api/stats) | Live network metrics & ledger summary |
| **WebSocket Stream** | `8080` | `ws://localhost:8080/ws` | Real-time block minting & telemetry feed |
| **AI Bridge** | `5000` | [http://localhost:5000](http://localhost:5000) | ML Anomaly classifier & Swahili IVR |
| **USSD Gateway** | `8080` | [http://localhost:8080/api/ussd](http://localhost:8080/api/ussd) | Africa's Talking `*384*55#` emulator |

---

## 🚀 How to Run (Execution Formulas)

### 📋 Prerequisites
- **Go** (1.22+)
- **Node.js** (18+) & **npm**
- **Python** (3.10+)
- **g++** / C++17 compiler & `make`
- *(Optional for Docker mode)*: **Docker** & **Docker Compose**

---

### Formula 1: 🌟 One-Command Fast Run (Recommended for Local Dev)

Launch all microservices (Go Core Backend, Python AI Bridge, Vite Web Frontend, and C++ Simulator) simultaneously with automatic process management and graceful shutdown:

```bash
make run
```
*(or equivalently: `./start.sh` or `make dev`)*

When running:
1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. Navigate between personas (Smallholder Farmer, Cooperative Union, Bio SME, Non-Bio SME) using the **persistent Left Sidebar**.
3. Press `Ctrl+C` in the terminal at any time to cleanly stop all running services.

---

### Formula 2: 🐳 Docker Compose Run (Production & Containerized Mode)

To run the entire system inside isolated Docker containers:

```bash
# Build and launch all containers in detached mode
make docker-up

# Or using native docker compose
docker compose up --build -d
```

To view logs or stop the containers:
```bash
# View live container logs
docker compose logs -f

# Tear down the stack
make docker-down
```

Access the dashboard at [http://localhost:3000](http://localhost:3000).

---

### Formula 3: 🖥️ Multi-Terminal Granular Run (Service by Service)

#### Terminal 1 — Go Core Backend & dMRV Oracle (Port 8080)
```bash
make run-backend
# or: cd core-backend && go run cmd/server/main.go
```

#### Terminal 2 — Python AI Anomaly & Telephony Bridge (Port 5000)
```bash
make run-bridge
# or: cd ai-telephony-bridge && uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

#### Terminal 3 — React Web Frontend (Port 3000)
```bash
make run-frontend
# or: cd web-frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Credit Certification & Legal Entity Framework

### 1. Which Legal Entity Certifies AngaGuard Credits?
AngaGuard carbon credits (Biochar Carbon Removal Certificates - CORCs) are certified under a **dual sovereign and international dMRV legal architecture**:

1. **Sovereign Statutory Entity (Republic of Kenya)**:
   - **Entity**: **Kenya National Carbon Registry (Kenya NCR)**.
   - **Statutory Law**: **Climate Change (Amendment) Act 2024** and the **Environmental Management and Co-ordination Act (EMCA 2026)**.
   - **Oversight Body**: The **National Environment Management Authority (NEMA)** and the **Climate Change Directorate (CCD)** under Kenya's Ministry of Environment, Climate Change and Forestry.
   - **Role**: Validates national carbon asset registration, executes sovereign tracking IDs (e.g. `KE-NCR-2026-cbc58516e738`), and manages Article 6.2 / 6.4 Corresponding Adjustments to prevent double-counting.

2. **International dMRV Standard & Exchange**:
   - **Methodology**: **Puro.earth Biochar Methodology (Edition 2025/2026)** and **ISO 14064-2:2019** (Greenhouse Gas Project Quantification).
   - **Marketplace Clearing**: **Carbonmark Sandbox API** (instant spot market liquidity index at $135.00 / tCO2e).

### 2. How the AngaGuard Oracle Bridges Physical Kilns to Certification:
```
[Physical Smart Kiln] ──► [WaziDev MCU SHA-256 Hashed Telemetry]
                                    │
                                    ▼
                     [Go dMRV Stoichiometric Engine]
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
[SHA-256 Immutable Ledger]                         [Kenya NCR Sovereign Certificate]
• Block Hash                                       • Certificate: KE-NCR-2026-XXXX
• Biochar Mass: 79.8 KG                            • Puro.earth / ISO 14064-2 Compliant
• Net CO2e: 0.202 tCO2e                            • M-Pesa B2C Payout: KSh 1,313.63
```

---

## 🔬 Hardware Demonstration: Biochar vs. Ash Cheating

### 1. Physical & Scientific Differences

| Parameter | Legitimate Biochar Pyrolysis | Ash Cheating (Complete Combustion) |
| :--- | :--- | :--- |
| **Atmosphere** | **Oxygen-limited (Anoxic)** | **Excess Oxygen (Open Fire)** |
| **Chemical Output** | Polycyclic aromatic carbon matrix ($C_{\text{org}} \ge 75\%$) | Mineral ash ($K_2O, CaO, SiO_2$), Carbon escaped as $CO_2$ |
| **Volume Retention ($\eta$)** | **30% – 50% skeletal volume** (height: 85cm $\to$ ~30cm) | **< 10% catastrophic collapse** (height: 85cm $\to$ < 8cm) |
| **Thermal Profile** | Controlled plateau hold (400°C–650°C for >35 min) | Sharp runaway combustion followed by rapid thermal decay |
| **dMRV Oracle Action** | **MINTED & SETTLED (M-Pesa Disbursed)** | **REJECTED (Fraud Code: `ASH_CHEATING_DETECTED`)** |

### 2. How to Run the Live Hardware Demo

While your stack is running, execute the following commands in your terminal to see the live dMRV Oracle and 3D Digital Twin respond in real time:

#### Step A: Stream Valid Biochar Pyrolysis (Expected: Pass & Mint)
```bash
make feed-valid
```
- **What Happens**:
  - The HC-SR04 Sonar detects height changing from 85cm to 30cm ($\eta = 35.3\% \ge 25\%$).
  - Steinhart-Hart temperature model confirms peak core temperature of 571.7°C.
  - The Go Oracle seals Block #1 on the ledger, issues tracking ID `KE-NCR-2026-XXXX`, and triggers instant Safaricom M-Pesa B2C payout of **KSh 1,313.63** to the farmer.
  - The 3D Kiln in the Web Dashboard renders an active thermal glow.

#### Step B: Stream "Ash Cheating" Fraud Attack (Expected: Oracle Block)
```bash
make feed-ash-cheating
```
- **What Happens**:
  - The Sonar sensor detects height dropping from 85cm to 8cm ($\eta = 9.4\% < 25\%$ minimum threshold).
  - The AI Bridge and Go Oracle trigger rule `ASH_CHEATING_DETECTED (Volume retention 0.094 < 0.25)`.
  - HTTP 422 `REJECTED_PHYSICS_VIOLATION` is broadcasted via WebSocket.
  - Zero blockchain blocks minted; zero M-Pesa funds disbursed.

#### Step C: Stream "Sand Padding" Fraud Attack (Expected: Thermal Mass Rejection)
```bash
make feed-sand-padding
```
- **What Happens**:
  - Inert sand added to drum creates heavy thermal inertia.
  - Temperature heating rate is only $0.35^\circ\text{C/min}$ (normal biochar is $> 1.2^\circ\text{C/min}$).
  - Oracle flags `SAND_PADDING_DETECTED: Sluggish thermal ramp rate` and rejects the payload.

---

## 🎨 UI/UX Enhancements & Design Standards

The AngaGuard frontend includes a complete professional SaaS layout:

1. **Full-Length Layout with Persistent Left Sidebar**:
   - Organized navigation sections (Overview, Fleet Kilns, Smallholder Members, Spot Index, Audit Ledger, ISSB Reports).
   - Telephony shortcuts for **2G USSD (*384*55#)** and **AI Voice Assistant**.
2. **Dedicated Corner Account Identity Badges**:
   - Account names (e.g. *Kakamega Sugarcane Coop Union*, *Kizito Grain Millers Ltd*, *Wanjala Wafula*) are placed neatly in dashboard corners, leaving top bars clean and uncluttered.
3. **Refined Cream / Slate Grey Light Mode**:
   - Soft cream-grey palette (`#f4f6f8`) with dark charcoal text (`#0f172a` / `#1e293b`), crisp slate borders (`#e2e8f0`), and high-contrast badges with zero washed-out text.
4. **Secure System Password Disbursals**:
   - Removed M-Pesa PIN prompts; farmers authorize M-Pesa B2C withdrawals using their **System Account Password** via Safaricom Daraja B2C rails.
5. **Interactive AI Voice Assistant (Swahili & English IVR)**:
   - Voice assistant with Web Speech API and ElevenLabs audio playback, pulsing audio waveform, and live Swahili/English transcripts.

---

## 🧪 Automated Testing Suite

Run unit tests across Go, C++, and Python in one command:
```bash
make test
```

Test 2G USSD (*384*55#) via curl:
```bash
curl -s -X POST -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=AT-001&phoneNumber=+254712345678&serviceCode=*384*55#&text=" \
  http://localhost:8080/api/ussd
```

---

## 💰 Monetization & B2B2C Revenue Split ($135.00 / Ton CORC)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                    TOTAL CREDIT SALE VALUE (Carbonmark Sandbox) : $135.00 USD               │
├───────────────────────────────┬───────────────────────────────┬─────────────────────────────┤
│      Farmer Mobile Cashout    │ Cooperative Operational Stipend│  AngaGuard Platform Fee     │
│         (Safaricom M-Pesa)    │   (Logistics & Soil Return)   │     (Software Take-Rate)    │
│           $50.00 (37.0%)      │         $20.00 (14.8%)        │        $65.00 (48.2%)       │
└───────────────────────────────┴───────────────────────────────┴─────────────────────────────┘
```

---

## 📑 In-Depth Documentation

For complete mathematical derivations, chemical stoichiometry, GHG Protocol equations, Steinhart-Hart polynomial models, and Kenyan regulatory references (EMCA 2026 / Kenya NCR), read [documentation.md](documentation.md).
