#ifndef KILN_FSM_H
#define KILN_FSM_H

#include <iostream>
#include <string>
#include <vector>
#include <cstring>
#include "sensors.h"
#include "security.h"
#include "flash_buffer.h"

namespace AngaGuard {

enum class KilnState {
    IDLE,
    PRE_IGNITION_SCAN,
    HEATING_RAMP,
    ACTIVE_PYROLYSIS,
    COOLING_DOWN,
    POST_COOLING_SCAN,
    TELEMETRY_DISPATCHED
};

struct KilnTelemetryData {
    std::string deviceUID;
    std::string kilnID;
    std::string coopID;
    std::string farmerPhone;
    double initialHeightCM;
    double finalHeightCM;
    double peakOuterTempC;
    double coreEstTempC;
    double durationMinutes;
    double heatingRate;
    double latitude;
    double longitude;
    std::string cellTowerID;
    std::string signature;
    long timestamp;
};

class KilnStateMachine {
private:
    KilnState currentState;
    DeviceSecurity security;
    FlashRingBuffer ringBuffer;
    std::string kilnID;
    std::string coopID;
    std::string farmerPhone;

    double initialHeightCM;
    double finalHeightCM;
    double peakOuterTempC;
    double startTempC;
    double rampStartTimeMin;
    double burnStartTimeMin;
    double burnDurationMin;
    double heatingRate;

public:
    KilnStateMachine(const std::string& siliconUID, const std::string& kID, const std::string& cID, const std::string& phone)
        : currentState(KilnState::IDLE),
          security(siliconUID),
          kilnID(kID),
          coopID(cID),
          farmerPhone(phone),
          initialHeightCM(0),
          finalHeightCM(0),
          peakOuterTempC(0),
          startTempC(25.0),
          rampStartTimeMin(0),
          burnStartTimeMin(0),
          burnDurationMin(0),
          heatingRate(0) {}

    KilnState GetState() const { return currentState; }

    // Start pre-ignition baseline scan (t0)
    void StartPreIgnitionScan(const std::vector<double>& rawSonarPings) {
        initialHeightCM = UltrasonicSonar::MedianFilter(rawSonarPings);
        currentState = KilnState::PRE_IGNITION_SCAN;
    }

    // Begin ignition ramp
    void DetectIgnition(double currentOuterTempC, double timeMin) {
        startTempC = currentOuterTempC;
        rampStartTimeMin = timeMin;
        currentState = KilnState::HEATING_RAMP;
    }

    // Monitor heating ramp and transition to active pyrolysis
    void UpdateHeatingRamp(double currentOuterTempC, double timeMin) {
        if (currentOuterTempC > peakOuterTempC) {
            peakOuterTempC = currentOuterTempC;
        }

        double elapsedRamp = timeMin - rampStartTimeMin;
        if (elapsedRamp > 0) {
            heatingRate = (currentOuterTempC - startTempC) / elapsedRamp;
        }

        if (currentOuterTempC >= 40.0) {
            burnStartTimeMin = timeMin;
            currentState = KilnState::ACTIVE_PYROLYSIS;
        }
    }

    // Monitor sustained pyrolysis plateau
    void UpdatePyrolysis(double currentOuterTempC, double timeMin) {
        if (currentOuterTempC > peakOuterTempC) {
            peakOuterTempC = currentOuterTempC;
        }

        burnDurationMin = timeMin - burnStartTimeMin;

        // Transition to cooling if temperature falls below active threshold
        if (currentOuterTempC < 38.0 && burnDurationMin >= 20.0) {
            currentState = KilnState::COOLING_DOWN;
        }
    }

    // Execute post-cooling scan (t_final) and serialize telemetry
    KilnTelemetryData CompleteBurnCycle(const std::vector<double>& rawPostCoolSonarPings, long timestamp) {
        finalHeightCM = UltrasonicSonar::MedianFilter(rawPostCoolSonarPings);
        currentState = KilnState::POST_COOLING_SCAN;

        double coreEst = ThermalSensor::OuterSkinToEstimatedCoreCelsius(peakOuterTempC);
        std::string sig = security.SignPayload(kilnID, initialHeightCM, finalHeightCM, peakOuterTempC, burnDurationMin);

        KilnTelemetryData data;
        data.deviceUID = security.GetSiliconUID();
        data.kilnID = kilnID;
        data.coopID = coopID;
        data.farmerPhone = farmerPhone;
        data.initialHeightCM = initialHeightCM;
        data.finalHeightCM = finalHeightCM;
        data.peakOuterTempC = peakOuterTempC;
        data.coreEstTempC = coreEst;
        data.durationMinutes = burnDurationMin;
        data.heatingRate = heatingRate;
        data.latitude = 0.2827; // Default Kakamega coordinates
        data.longitude = 34.7519;
        data.cellTowerID = "SAF-TOWER-KKM-04";
        data.signature = sig;
        data.timestamp = timestamp;

        // Buffer locally in flash ring buffer
        BufferedLogEntry entry;
        std::strncpy(entry.deviceUID, data.deviceUID.c_str(), sizeof(entry.deviceUID));
        std::strncpy(entry.kilnID, data.kilnID.c_str(), sizeof(entry.kilnID));
        entry.initialHeightCM = static_cast<float>(data.initialHeightCM);
        entry.finalHeightCM = static_cast<float>(data.finalHeightCM);
        entry.peakOuterTempC = static_cast<float>(data.peakOuterTempC);
        entry.durationMinutes = static_cast<float>(data.durationMinutes);
        entry.heatingRate = static_cast<float>(data.heatingRate);
        entry.timestampUnix = timestamp;
        entry.synced = false;

        ringBuffer.Push(entry);
        currentState = KilnState::TELEMETRY_DISPATCHED;

        return data;
    }
};

} // namespace AngaGuard

#endif // KILN_FSM_H
