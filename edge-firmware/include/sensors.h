#ifndef SENSORS_H
#define SENSORS_H

#include <cmath>
#include <vector>
#include <algorithm>

namespace AngaGuard {

// Steinhart-Hart Coefficients for KY-013 10k NTC Thermistor
// 1/T = A + B*ln(R) + C*(ln(R))^3
constexpr double STEINHART_A = 0.001129148;
constexpr double STEINHART_B = 0.000234125;
constexpr double STEINHART_C = 0.0000000876741;
constexpr double SERIES_RESISTOR = 10000.0; // 10k Ohm fixed pullup resistor

class ThermalSensor {
public:
    static double RawAdcToOuterSkinCelsius(int rawAdc, int adcResolution = 1023) {
        if (rawAdc <= 0) return -40.0;
        if (rawAdc >= adcResolution) return 150.0;

        // Calculate thermistor resistance
        double resistance = SERIES_RESISTOR * (static_cast<double>(adcResolution) / rawAdc - 1.0);
        double logR = std::log(resistance);
        double logR3 = logR * logR * logR;

        double tempK = 1.0 / (STEINHART_A + (STEINHART_B * logR) + (STEINHART_C * logR3));
        double tempC = tempK - 273.15;
        return tempC;
    }

    static double OuterSkinToEstimatedCoreCelsius(double outerTempC) {
        // Air-gapped standoff conductive mapping:
        // Outer skin 40°C - 75°C maps to 450°C - 650°C internal core
        return (outerTempC * 7.85) + 112.5;
    }
};

class UltrasonicSonar {
public:
    // 5-Point Median Filter to eliminate acoustic turbulence and smoke scatter
    static double MedianFilter(std::vector<double> readings) {
        if (readings.empty()) return 0.0;
        std::sort(readings.begin(), readings.end());
        size_t mid = readings.size() / 2;
        if (readings.size() % 2 == 0) {
            return (readings[mid - 1] + readings[mid]) / 2.0;
        }
        return readings[mid];
    }

    // Microsecond pulse travel time to distance in CM (Speed of sound ~ 343 m/s)
    static double MicrosecondsToCM(long microseconds) {
        return static_cast<double>(microseconds) / 29.1 / 2.0;
    }
};

} // namespace AngaGuard

#endif // SENSORS_H
