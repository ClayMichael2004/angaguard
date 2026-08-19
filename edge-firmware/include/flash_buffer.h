#ifndef FLASH_BUFFER_H
#define FLASH_BUFFER_H

#include <vector>
#include <string>
#include <sstream>

namespace AngaGuard {

struct BufferedLogEntry {
    char deviceUID[24];
    char kilnID[16];
    float initialHeightCM;
    float finalHeightCM;
    float peakOuterTempC;
    float durationMinutes;
    float heatingRate;
    long timestampUnix;
    bool synced;
};

// 50-Entry Circular Ring Buffer for Offline Flash / EEPROM Storage
// Blueprint Section 6: Offline Rural Connectivity
class FlashRingBuffer {
private:
    static constexpr size_t MAX_CAPACITY = 50;
    BufferedLogEntry buffer[MAX_CAPACITY];
    size_t head = 0;
    size_t count = 0;

public:
    FlashRingBuffer() : head(0), count(0) {}

    bool Push(const BufferedLogEntry& entry) {
        buffer[head] = entry;
        buffer[head].synced = false;
        head = (head + 1) % MAX_CAPACITY;
        if (count < MAX_CAPACITY) {
            count++;
        }
        return true;
    }

    size_t UnsyncedCount() const {
        size_t unsynced = 0;
        for (size_t i = 0; i < count; ++i) {
            if (!buffer[i].synced) unsynced++;
        }
        return unsynced;
    }

    std::vector<BufferedLogEntry> GetUnsyncedEntries() const {
        std::vector<BufferedLogEntry> list;
        for (size_t i = 0; i < count; ++i) {
            if (!buffer[i].synced) {
                list.push_back(buffer[i]);
            }
        }
        return list;
    }

    void MarkAllSynced() {
        for (size_t i = 0; i < count; ++i) {
            buffer[i].synced = true;
        }
    }
};

} // namespace AngaGuard

#endif // FLASH_BUFFER_H
