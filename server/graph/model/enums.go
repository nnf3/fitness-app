package model

import (
	"encoding/json"
	"fmt"
)

// Gender enum
type Gender int

const (
	GenderMale Gender = iota
	GenderFemale
	GenderOther
	GenderPreferNotToSay
)

func (g Gender) String() string {
	switch g {
	case GenderMale:
		return "MALE"
	case GenderFemale:
		return "FEMALE"
	case GenderOther:
		return "OTHER"
	case GenderPreferNotToSay:
		return "PREFER_NOT_TO_SAY"
	default:
		return "UNKNOWN"
	}
}

func (g Gender) MarshalJSON() ([]byte, error) {
	return []byte(fmt.Sprintf(`"%s"`, g.String())), nil
}

func (g *Gender) UnmarshalJSON(b []byte) error {
	var s string
	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}

	switch s {
	case "MALE":
		*g = GenderMale
	case "FEMALE":
		*g = GenderFemale
	case "OTHER":
		*g = GenderOther
	case "PREFER_NOT_TO_SAY":
		*g = GenderPreferNotToSay
	default:
		return fmt.Errorf("unexpected gender value %q", s)
	}
	return nil
}

// ActivityLevel enum
type ActivityLevel int

const (
	ActivityLevelSedentary ActivityLevel = iota
	ActivityLevelLightlyActive
	ActivityLevelModeratelyActive
	ActivityLevelVeryActive
	ActivityLevelExtremelyActive
)

func (a ActivityLevel) String() string {
	switch a {
	case ActivityLevelSedentary:
		return "SEDENTARY"
	case ActivityLevelLightlyActive:
		return "LIGHTLY_ACTIVE"
	case ActivityLevelModeratelyActive:
		return "MODERATELY_ACTIVE"
	case ActivityLevelVeryActive:
		return "VERY_ACTIVE"
	case ActivityLevelExtremelyActive:
		return "EXTREMELY_ACTIVE"
	default:
		return "UNKNOWN"
	}
}

func (a ActivityLevel) MarshalJSON() ([]byte, error) {
	return []byte(fmt.Sprintf(`"%s"`, a.String())), nil
}

func (a *ActivityLevel) UnmarshalJSON(b []byte) error {
	var s string
	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}

	switch s {
	case "SEDENTARY":
		*a = ActivityLevelSedentary
	case "LIGHTLY_ACTIVE":
		*a = ActivityLevelLightlyActive
	case "MODERATELY_ACTIVE":
		*a = ActivityLevelModeratelyActive
	case "VERY_ACTIVE":
		*a = ActivityLevelVeryActive
	case "EXTREMELY_ACTIVE":
		*a = ActivityLevelExtremelyActive
	default:
		return fmt.Errorf("unexpected activity level value %q", s)
	}
	return nil
}
