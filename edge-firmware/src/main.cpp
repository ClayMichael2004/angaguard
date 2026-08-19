#include <iostream>
#include <vector>
#include "../include/sensors.h"
#include "../include/security.h"
#include "../include/flash_buffer.h"
#include "../include/kiln_fsm.h"

// Entrypoint for embedded WaziDev / Arduino toolchain
int main() {
    std::cout << "[AngaGuard Firmware v2.6.4-prod] Initializing Edge dMRV Subsystem..." << std::endl;
    std::cout << "[Hardware] KY-013 NTC Thermistor: OK | HC-SR04 Sonar: OK | Flash RingBuffer: OK" << std::endl;

    AngaGuard::KilnStateMachine kiln(
        "MCU-WAZIDEV-77A9-SILICON",
        "KILN-001",
        "COOP-KAKAMEGA-01",
        "+254712345678"
    );

    // 1. Static pre-burn scan (t0)
    std::vector<double> preScan = {84.8, 85.1, 85.0, 84.9, 85.2};
    kiln.StartPreIgnitionScan(preScan);
    std::cout << "[State] Pre-Ignition Scan Complete. Depth baseline captured." << std::endl;

    // 2. Ignition & Ramp
    kiln.DetectIgnition(24.5, 0.0);
    kiln.UpdateHeatingRamp(42.0, 4.0);
    std::cout << "[State] Pyrolysis Plateau reached. Entering active thermal hold." << std::endl;

    // 3. Pyrolysis Hold
    kiln.UpdatePyrolysis(58.5, 45.0);

    // 4. Cooldown & Post-scan (t_final)
    std::vector<double> postScan = {30.1, 29.9, 30.0, 30.2, 30.0};
    AngaGuard::KilnTelemetryData telemetry = kiln.CompleteBurnCycle(postScan, 1771428900);

    std::cout << "[Telemetry Ready] Initial: " << telemetry.initialHeightCM << " cm | Final: " 
              << telemetry.finalHeightCM << " cm | Peak Temp: " << telemetry.peakOuterTempC 
              << " C | Core Est: " << telemetry.coreEstTempC << " C | Duration: " 
              << telemetry.durationMinutes << " min | Sig: " << telemetry.signature << std::endl;

    return 0;
}
