# 🌿 AngaGuard

**Decentralized IoT & Cryptographic dMRV Oracle for SME ESG Alignment, Zero-Friction Financial Inclusion, and Durable Carbon Harvesting**

[![Go Version](https://img.shields.io/badge/Go-1.22+-00ADD8?style=flat-square&logo=go)](https://golang.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![C++17](https://img.shields.io/badge/C++-17-00599C?style=flat-square&logo=c%2B%2B)](https://isocpp.org)
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
                     [React + Vite Frontend]                                     [2G Telephony Stack]
                     • SME Corporate Web App                                     • USSD Engine (*384*55#)
                     • 3D Kiln Digital Twin (Three.js)                           • Africa's Talking Gateway
                     • Public Cryptographic Vault Explorer                       • Instant M-Pesa Disbursal
```

### Pod Directory Breakdown

| Pod | Technology Stack | Key Responsibilities |
| :--- | :--- | :--- |
| **`core-backend/`** | Go (Gin-Gonic), SQLite (WAL), SHA-256 Cryptography | Stoichiometric dMRV validation, blockchain block minting, M-Pesa B2C split engine, spatial-temporal geofencing, ISSB report generator. |
| **`edge-firmware/`** | C++17, WaziDev Arduino Toolchain | 5-point median sonar filter, Steinhart-Hart thermistor reading, silicon UID injection, 50-entry flash ring buffer, standalone simulator. |
| **`ai-telephony-bridge/`** | Python 3, FastAPI, ElevenLabs | Real-time burn curve anomaly classifier, LoRaWAN forwarder, automated Swahili & English IVR voice synthesizer. |
| **`web-frontend/`** | React 18, Vite, TypeScript, Tailwind CSS, Three.js | SME ESG corporate dashboard, interactive 3D kiln twin, farmer PWA with M-Pesa cashout, cryptographic block explorer, 2G feature phone emulator. |

---

## 🧪 Comprehensive Loophole Defense Matrix

AngaGuard includes rigid, hardware-enforced mathematical defenses against all 7 physical and digital fraud attack vectors:

```
┌──────────────────────────────────────┬─────────────────────────────────────────────────────────────┐
│ Vulnerability / Attack Vector        │ Technical Engineering Defense Strategy                      │
├──────────────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 1. Chamber Core Fusion (>450°C)      │ Air-Gapped Standoff 15cm above lid + Steinhart-Hart model   │
│ 2. "Ash Cheating" (False Volume)     │ Dual-Metric Curve: Reject volume collapse >90% (open ash)   │
│ 3. Sand-Padding Attack               │ Thermal Mass Coherence Check (Sluggish ΔT/Δt < 1.2°C/min)   │
│ 4. Acoustic Noise Scatter            │ Two-Point Static Calibration (t0 pre-burn vs cooled t_final)│
│ 5. Multi-Drum Sensor Swap            │ Factory-Burned Silicon MCU Unique ID tied 1-to-1 to coop    │
│ 6. Stolen Hardware Burn              │ Spatial-Temporal Geo-Fencing & LoRa cell triangulation      │
│ 7. Offline Rural Connectivity        │ 50-Log Edge Flash Ring Buffer + 2G USSD (*384*55#) fallback │
└──────────────────────────────────────┴─────────────────────────────────────────────────────────────┘
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

## 🚀 Quick Start & Development

### 1. Prerequisites
* **Go** 1.22+
* **Node.js** 18+ & **npm**
* **Python** 3.10+
* **g++** / C++17 compiler

### 2. Build & Test Entire Suite in One Command
```bash
make test
```

### 3. Run Backend Services
```bash
# Terminal 1: Launch Go Core Backend & dMRV Oracle (Port 8080)
make run-backend

# Terminal 2: Launch Python AI & Telephony Bridge (Port 5000)
make run-bridge

# Terminal 3: Launch React Web Frontend (Port 3000)
make run-frontend
```

Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the full platform.

### 4. Run Edge Hardware Simulator
```bash
# Legitimate burn simulation
make simulate-valid

# Test Ash Cheating attack vector (Blocked by Oracle)
make simulate-ash-cheating

# Test Sand Padding attack vector (Blocked by Oracle)
make simulate-sand-padding
```

---

## 📑 In-Depth Documentation

For complete mathematical derivations, chemical stoichiometry, GHG Protocol equations, Steinhart-Hart polynomial models, and Kenyan regulatory references (EMCA 2026 / Kenya NCR), read [documentation.md](documentation.md).
