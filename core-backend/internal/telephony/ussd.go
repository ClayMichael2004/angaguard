package telephony

import (
	"fmt"
	"strings"

	"github.com/angaguard/core-backend/internal/models"
)

// USSDHandler processes Africa's Talking USSD string sequences (*384*55#).
type USSDHandler struct{}

// NewUSSDHandler creates a new USSD protocol session handler.
func NewUSSDHandler() *USSDHandler {
	return &USSDHandler{}
}

// ProcessUSSDRequest parses incoming USSD text string and generates CON / END response.
func (h *USSDHandler) ProcessUSSDRequest(req models.USSDSession, farmer *models.FarmerAccount) (string, error) {
	text := strings.TrimSpace(req.Text)

	// Determine language (default to farmer's preference or Swahili)
	lang := "sw"
	if farmer != nil && farmer.PreferredLanguage != "" {
		lang = farmer.PreferredLanguage
	}

	// Root Menu (*384*55#)
	if text == "" {
		if lang == "sw" {
			return "CON Karibu AngaGuard Carbon Oracle\n" +
				"1. Angalia Salio na Mkaa\n" +
				"2. Sajili Uchomaji Mpya\n" +
				"3. Toa Pesa kwa M-Pesa\n" +
				"4. Msaada wa Sauti (Voice IVR)\n" +
				"5. Switch to English", nil
		}
		return "CON Welcome to AngaGuard Carbon Oracle\n" +
			"1. Check Balance & Biochar\n" +
			"2. Register New Kiln Burn\n" +
			"3. Withdraw Funds to M-Pesa\n" +
			"4. Request Voice Assistance\n" +
			"5. Badilisha hadi Kiswahili", nil
	}

	parts := strings.Split(text, "*")
	topChoice := parts[0]

	switch topChoice {
	case "1": // Balance & Yield
		if farmer == nil {
			if lang == "sw" {
				return "END Hujasajiliwa bado. Tafadhali wasiliana na kiongozi wa ushirika wako.", nil
			}
			return "END Account not found. Please contact your local agricultural cooperative leader.", nil
		}
		if lang == "sw" {
			return fmt.Sprintf("END Habari %s,\nJumla ya Mkaa: %.1f KG\nSalio la M-Pesa: KSh %.2f\nMapato Yaliyotolewa: KSh %.2f\nAsante kwa kutunza mazingira!",
				farmer.Name, farmer.TotalBiocharKG, farmer.AvailableKSh, farmer.TotalWithdrawnKSh), nil
		}
		return fmt.Sprintf("END Hello %s,\nTotal Biochar: %.1f KG\nAvailable M-Pesa: KSh %.2f\nTotal Withdrawn: KSh %.2f\nThank you for harvesting clean carbon!",
			farmer.Name, farmer.TotalBiocharKG, farmer.AvailableKSh, farmer.TotalWithdrawnKSh), nil

	case "2": // Register New Burn
		if len(parts) == 1 {
			if lang == "sw" {
				return "CON Ingiza nambari ya pipa (Kiln ID):\nMfano: KILN-014", nil
			}
			return "CON Enter Smart Kiln ID:\ne.g. KILN-014", nil
		}
		kilnID := strings.ToUpper(parts[1])
		if lang == "sw" {
			return fmt.Sprintf("END Pipa %s limesajiliwa kwa mfumo. Sensor ya IoT inaanza kupima mara moja.", kilnID), nil
		}
		return fmt.Sprintf("END Kiln %s linked. The IoT edge sensor is now validating your pyrolysis cycle.", kilnID), nil

	case "3": // Withdraw M-Pesa
		if farmer == nil {
			return "END Error: No registered farmer profile found.", nil
		}
		if farmer.AvailableKSh <= 0 {
			if lang == "sw" {
				return "END Hauna salio la kutosha kutoa kwa sasa.", nil
			}
			return "END Insufficient balance for withdrawal.", nil
		}
		amount := farmer.AvailableKSh
		if lang == "sw" {
			return fmt.Sprintf("END Ombi la KSh %.2f limepokelewa. Utapokea ujumbe wa M-Pesa kwenye %s punde si punde.",
				amount, farmer.Phone), nil
		}
		return fmt.Sprintf("END Withdrawal of KSh %.2f initiated. You will receive an M-Pesa B2C alert on %s shortly.",
			amount, farmer.Phone), nil

	case "4": // Voice IVR
		if lang == "sw" {
			return "END Utapokea simu ya maelekezo ya sauti ya Kiswahili kutoka kwa mfumo wa AngaGuard.", nil
		}
		return "END You will receive an automated AI Voice call with audio instructions in Swahili shortly.", nil

	case "5": // Toggle Language
		if lang == "sw" {
			return "END Lugha imebadilishwa kuwa Kiingereza (Language set to English).", nil
		}
		return "END Language switched to Kiswahili.", nil

	default:
		return "END Chaguo si sahihi (Invalid selection). Tafadhali piga *384*55# tena.", nil
	}
}
