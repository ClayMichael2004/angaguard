package geofence

import (
	"fmt"
	"math"

	"github.com/angaguard/core-backend/internal/models"
)

// EarthRadiusKM is the mean radius of the Earth in kilometers.
const EarthRadiusKM = 6371.0

// HaversineDistance calculates the great-circle distance between two GPS points in km.
func HaversineDistance(lat1, lon1, lat2, lon2 float64) float64 {
	dLat := (lat2 - lat1) * (math.Pi / 180.0)
	dLon := (lon2 - lon1) * (math.Pi / 180.0)

	rLat1 := lat1 * (math.Pi / 180.0)
	rLat2 := lat2 * (math.Pi / 180.0)

	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(rLat1)*math.Cos(rLat2)*
			math.Sin(dLon/2)*math.Sin(dLon/2)

	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
	return EarthRadiusKM * c
}

// ValidateSpatialTemporalFence checks if the telemetry arrives within the registered
// cooperative boundary and authorized cellular triangulation zone.
// Defends against Loophole 7: The Stolen Hardware Burn & Loophole 5: Multi-Drum Sensor Swap.
func ValidateSpatialTemporalFence(t models.TelemetryPacket, coop models.Cooperative, registeredSiliconUID string) error {
	// 1. Hardware Identity Silicon Binding Check
	if registeredSiliconUID != "" && t.DeviceUID != registeredSiliconUID {
		return fmt.Errorf("REJECTED: Cryptographic hardware identity mismatch! Device UID %s does not match registered silicon UID %s for kiln %s (Multi-Drum Sensor Swap detected)",
			t.DeviceUID, registeredSiliconUID, t.KilnID)
	}

	// 2. Spatial GPS Geofence Check (if GPS coordinates provided)
	if t.Latitude != 0 && t.Longitude != 0 && coop.CenterLat != 0 && coop.CenterLng != 0 {
		dist := HaversineDistance(t.Latitude, t.Longitude, coop.CenterLat, coop.CenterLng)
		maxRadius := coop.RadiusKM
		if maxRadius <= 0 {
			maxRadius = 25.0 // Default 25km radius for rural cooperatives
		}

		if dist > maxRadius {
			return fmt.Errorf("REJECTED: Spatial-temporal fence breach! Telemetry origin (%.4f, %.4f) is %.2f km from coop center (%.4f, %.4f), exceeding maximum authorized boundary of %.1f km (Stolen Hardware Burn detected)",
				t.Latitude, t.Longitude, dist, coop.CenterLat, coop.CenterLng, maxRadius)
		}
	}

	// 3. LoRa Cellular Tower Triangulation Check
	if len(coop.AllowedTowers) > 0 && t.CellTowerID != "" {
		towerAllowed := false
		for _, allowed := range coop.AllowedTowers {
			if allowed == t.CellTowerID {
				towerAllowed = true
				break
			}
		}
		if !towerAllowed {
			return fmt.Errorf("REJECTED: Cellular tower triangulation anomaly! Tower ID %s not in authorized gateway list for cooperative %s (%s)",
				t.CellTowerID, coop.ID, coop.Name)
		}
	}

	return nil
}
