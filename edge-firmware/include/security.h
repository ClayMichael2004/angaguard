#ifndef SECURITY_H
#define SECURITY_H

#include <string>
#include <sstream>
#include <iomanip>

namespace AngaGuard {

class DeviceSecurity {
private:
    std::string siliconUID;

public:
    explicit DeviceSecurity(const std::string& factoryUID) : siliconUID(factoryUID) {}

    std::string GetSiliconUID() const {
        return siliconUID;
    }

    // Computes a simple cryptographic telemetry verification checksum for MCU transmission
    std::string SignPayload(const std::string& kilnID, double initH, double finalH, double temp, double duration) {
        std::stringstream ss;
        ss << siliconUID << ":" << kilnID << ":" << std::fixed << std::setprecision(2)
           << initH << ":" << finalH << ":" << temp << ":" << duration;
        
        // Simple hash representation for low-power MCU header
        unsigned long hash = 5381;
        std::string str = ss.str();
        for (char c : str) {
            hash = ((hash << 5) + hash) + static_cast<unsigned char>(c);
        }

        std::stringstream hashHex;
        hashHex << "SIG-" << std::hex << hash;
        return hashHex.str();
    }
};

} // namespace AngaGuard

#endif // SECURITY_H
