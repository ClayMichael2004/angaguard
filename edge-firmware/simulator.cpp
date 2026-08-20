#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <cstdlib>
#include <ctime>
#include "include/sensors.h"
#include "include/security.h"
#include "include/kiln_fsm.h"

void PrintTelemetryJSON(const std::string& mode) {
    std::time_t now = std::time(nullptr);
    char buf[32];
    std::strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%SZ", std::gmtime(&now));
    std::string timeStr(buf);

    if (mode == "valid") {
        // Legitimate Top-Lit Updraft Biochar Burn
        std::cout << "{\n"
                  << "  \"device_uid\": \"MCU-WAZIDEV-77A9\",\n"
                  << "  \"kiln_id\": \"KILN-001\",\n"
                  << "  \"coop_id\": \"COOP-KAKAMEGA-01\",\n"
                  << "  \"farmer_phone\": \"+254712345678\",\n"
                  << "  \"initial_height_cm\": 85.0,\n"
                  << "  \"final_height_cm\": 30.0,\n"
                  << "  \"peak_outer_temp_c\": 58.5,\n"
                  << "  \"core_est_temp_c\": 571.7,\n"
                  << "  \"duration_minutes\": 45.0,\n"
                  << "  \"heating_rate\": 4.2,\n"
                  << "  \"latitude\": 0.2827,\n"
                  << "  \"longitude\": 34.7519,\n"
                  << "  \"cell_tower_id\": \"SAF-TOWER-KKM-04\",\n"
                  << "  \"firmware_version\": \"v2.6.4-prod\",\n"
                  << "  \"timestamp\": \"" << timeStr << "\"\n"
                  << "}" << std::endl;
    } else if (mode == "ash_cheating") {
        // Ash Cheating Attack: Unsealed vents -> >90% volume loss -> 8cm final char
        std::cout << "{\n"
                  << "  \"device_uid\": \"MCU-WAZIDEV-77A9\",\n"
                  << "  \"kiln_id\": \"KILN-001\",\n"
                  << "  \"coop_id\": \"COOP-KAKAMEGA-01\",\n"
                  << "  \"farmer_phone\": \"+254712345678\",\n"
                  << "  \"initial_height_cm\": 85.0,\n"
                  << "  \"final_height_cm\": 8.0,\n"
                  << "  \"peak_outer_temp_c\": 55.0,\n"
                  << "  \"core_est_temp_c\": 544.2,\n"
                  << "  \"duration_minutes\": 40.0,\n"
                  << "  \"heating_rate\": 3.8,\n"
                  << "  \"latitude\": 0.2827,\n"
                  << "  \"longitude\": 34.7519,\n"
                  << "  \"cell_tower_id\": \"SAF-TOWER-KKM-04\",\n"
                  << "  \"timestamp\": \"" << timeStr << "\"\n"
                  << "}" << std::endl;
    } else if (mode == "sand_padding") {
        // Sand-Padding Attack: Heavy thermal mass causes sluggish heating rate
        std::cout << "{\n"
                  << "  \"device_uid\": \"MCU-WAZIDEV-77A9\",\n"
                  << "  \"kiln_id\": \"KILN-001\",\n"
                  << "  \"coop_id\": \"COOP-KAKAMEGA-01\",\n"
                  << "  \"farmer_phone\": \"+254712345678\",\n"
                  << "  \"initial_height_cm\": 85.0,\n"
                  << "  \"final_height_cm\": 30.0,\n"
                  << "  \"peak_outer_temp_c\": 52.0,\n"
                  << "  \"core_est_temp_c\": 520.7,\n"
                  << "  \"duration_minutes\": 45.0,\n"
                  << "  \"heating_rate\": 0.35,\n"
                  << "  \"latitude\": 0.2827,\n"
                  << "  \"longitude\": 34.7519,\n"
                  << "  \"cell_tower_id\": \"SAF-TOWER-KKM-04\",\n"
                  << "  \"timestamp\": \"" << timeStr << "\"\n"
                  << "}" << std::endl;
    } else if (mode == "stolen_hardware") {
        // Stolen Hardware: Attempt to burn in Nairobi away from Kakamega geo-fence
        std::cout << "{\n"
                  << "  \"device_uid\": \"MCU-WAZIDEV-77A9\",\n"
                  << "  \"kiln_id\": \"KILN-001\",\n"
                  << "  \"coop_id\": \"COOP-KAKAMEGA-01\",\n"
                  << "  \"farmer_phone\": \"+254712345678\",\n"
                  << "  \"initial_height_cm\": 85.0,\n"
                  << "  \"final_height_cm\": 30.0,\n"
                  << "  \"peak_outer_temp_c\": 58.0,\n"
                  << "  \"core_est_temp_c\": 567.8,\n"
                  << "  \"duration_minutes\": 45.0,\n"
                  << "  \"heating_rate\": 3.5,\n"
                  << "  \"latitude\": -1.2921,\n"
                  << "  \"longitude\": 36.8219,\n"
                  << "  \"cell_tower_id\": \"SAF-TOWER-NRB-09\",\n"
                  << "  \"timestamp\": \"" << timeStr << "\"\n"
                  << "}" << std::endl;
    }
}

int main(int argc, char* argv[]) {
    std::string mode = "valid";
    if (argc > 1) {
        mode = argv[1];
    }
    PrintTelemetryJSON(mode);
    return 0;
}
