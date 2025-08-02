package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFriendshipStatus_Constants(t *testing.T) {
	tests := []struct {
		name     string
		status   FriendshipStatus
		expected string
	}{
		{
			name:     "Pending status",
			status:   Pending,
			expected: "pending",
		},
		{
			name:     "Accepted status",
			status:   Accepted,
			expected: "accepted",
		},
		{
			name:     "Rejected status",
			status:   Rejected,
			expected: "rejected",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.expected, string(tt.status))
		})
	}
}

func TestFriendship_BeforeCreate(t *testing.T) {
	tests := []struct {
		name        string
		friendship  *Friendship
		expectError bool
	}{
		{
			name: "Valid friendship creation",
			friendship: &Friendship{
				RequesterID: 1,
				RequesteeID: 2,
			},
			expectError: false,
		},
		{
			name: "Same user friendship creation",
			friendship: &Friendship{
				RequesterID: 1,
				RequesteeID: 1,
			},
			expectError: true,
		},
		{
			name: "Missing requester ID",
			friendship: &Friendship{
				RequesteeID: 2,
			},
			expectError: true,
		},
		{
			name: "Missing requestee ID",
			friendship: &Friendship{
				RequesterID: 1,
			},
			expectError: true,
		},
		{
			name:        "Both IDs missing",
			friendship:  &Friendship{},
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.friendship.BeforeCreate(nil)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, string(Pending), tt.friendship.Status)
			}
		})
	}
}

func TestFriendship_BeforeUpdate(t *testing.T) {
	tests := []struct {
		name        string
		friendship  *Friendship
		expectError bool
	}{
		{
			name: "Valid status update",
			friendship: &Friendship{
				RequesterID: 1,
				RequesteeID: 2,
				Status:      string(Accepted),
			},
			expectError: false,
		},
		{
			name: "Same user friendship",
			friendship: &Friendship{
				RequesterID: 1,
				RequesteeID: 1,
				Status:      string(Accepted),
			},
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.friendship.BeforeUpdate(nil)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}

func TestFriendship_Validate(t *testing.T) {
	tests := []struct {
		name        string
		friendship  *Friendship
		expectError bool
		errorMsg    string
	}{
		{
			name: "Valid friendship",
			friendship: &Friendship{
				RequesterID: 1,
				RequesteeID: 2,
			},
			expectError: false,
		},
		{
			name: "Missing requester ID",
			friendship: &Friendship{
				RequesteeID: 2,
			},
			expectError: true,
			errorMsg:    "申請者と被申請者が指定されていません",
		},
		{
			name: "Missing requestee ID",
			friendship: &Friendship{
				RequesterID: 1,
			},
			expectError: true,
			errorMsg:    "申請者と被申請者が指定されていません",
		},
		{
			name:        "Both IDs missing",
			friendship:  &Friendship{},
			expectError: true,
			errorMsg:    "申請者と被申請者が指定されていません",
		},
		{
			name: "Same user friendship",
			friendship: &Friendship{
				RequesterID: 1,
				RequesteeID: 1,
			},
			expectError: true,
			errorMsg:    "申請者と被申請者が同じユーザーです",
		},
		{
			name: "Invalid status",
			friendship: &Friendship{
				RequesterID: 1,
				RequesteeID: 2,
				Status:      "invalid_status",
			},
			expectError: true,
			errorMsg:    "無効なステータスです",
		},
		{
			name: "Valid status - pending",
			friendship: &Friendship{
				RequesterID: 1,
				RequesteeID: 2,
				Status:      string(Pending),
			},
			expectError: false,
		},
		{
			name: "Valid status - accepted",
			friendship: &Friendship{
				RequesterID: 1,
				RequesteeID: 2,
				Status:      string(Accepted),
			},
			expectError: false,
		},
		{
			name: "Valid status - rejected",
			friendship: &Friendship{
				RequesterID: 1,
				RequesteeID: 2,
				Status:      string(Rejected),
			},
			expectError: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.friendship.Validate()

			if tt.expectError {
				assert.Error(t, err)
				if tt.errorMsg != "" {
					assert.Contains(t, err.Error(), tt.errorMsg)
				}
			} else {
				assert.NoError(t, err)
			}
		})
	}
}

func TestFriendship_StatusTransitions(t *testing.T) {
	friendship := &Friendship{
		RequesterID: 1,
		RequesteeID: 2,
	}

	// Test initial status
	err := friendship.BeforeCreate(nil)
	assert.NoError(t, err)
	assert.Equal(t, string(Pending), friendship.Status)

	// Test status transitions
	statuses := []FriendshipStatus{Accepted, Rejected}
	for _, status := range statuses {
		t.Run("Transition to "+string(status), func(t *testing.T) {
			friendship.Status = string(status)
			err := friendship.BeforeUpdate(nil)
			assert.NoError(t, err)
			assert.Equal(t, string(status), friendship.Status)
		})
	}
}

func TestFriendship_EdgeCases(t *testing.T) {
	t.Run("Zero values", func(t *testing.T) {
		friendship := &Friendship{}
		err := friendship.Validate()
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "申請者と被申請者が指定されていません")
	})

	t.Run("Large user IDs", func(t *testing.T) {
		friendship := &Friendship{
			RequesterID: 999999,
			RequesteeID: 999998,
		}
		err := friendship.Validate()
		assert.NoError(t, err)
	})

	t.Run("Status with custom value", func(t *testing.T) {
		friendship := &Friendship{
			RequesterID: 1,
			RequesteeID: 2,
			Status:      "custom_status",
		}
		err := friendship.BeforeCreate(nil)
		assert.NoError(t, err)
		// Status should be set to pending regardless of initial value
		assert.Equal(t, string(Pending), friendship.Status)
	})
}

func TestFriendship_IsValidStatus(t *testing.T) {
	tests := []struct {
		name     string
		status   string
		expected bool
	}{
		{
			name:     "Valid pending status",
			status:   string(Pending),
			expected: true,
		},
		{
			name:     "Valid accepted status",
			status:   string(Accepted),
			expected: true,
		},
		{
			name:     "Valid rejected status",
			status:   string(Rejected),
			expected: true,
		},
		{
			name:     "Invalid status",
			status:   "invalid_status",
			expected: false,
		},
		{
			name:     "Empty status",
			status:   "",
			expected: false,
		},
		{
			name:     "Case sensitive test",
			status:   "PENDING",
			expected: false,
		},
		{
			name:     "Partial match",
			status:   "pending_extra",
			expected: false,
		},
	}

	friendship := &Friendship{}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := friendship.IsValidStatus(tt.status)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestFriendship_GetValidStatuses(t *testing.T) {
	friendship := &Friendship{}
	validStatuses := friendship.GetValidStatuses()

	expectedStatuses := []string{
		string(Pending),
		string(Accepted),
		string(Rejected),
	}

	assert.ElementsMatch(t, expectedStatuses, validStatuses)
	assert.Len(t, validStatuses, 3)
}

func TestFriendship_StatusValidationEdgeCases(t *testing.T) {
	t.Run("Status with special characters", func(t *testing.T) {
		friendship := &Friendship{
			RequesterID: 1,
			RequesteeID: 2,
			Status:      "pending!",
		}
		err := friendship.Validate()
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "無効なステータスです")
	})

	t.Run("Status with numbers", func(t *testing.T) {
		friendship := &Friendship{
			RequesterID: 1,
			RequesteeID: 2,
			Status:      "pending123",
		}
		err := friendship.Validate()
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "無効なステータスです")
	})

	t.Run("Status with spaces", func(t *testing.T) {
		friendship := &Friendship{
			RequesterID: 1,
			RequesteeID: 2,
			Status:      " pending ",
		}
		err := friendship.Validate()
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "無効なステータスです")
	})

	t.Run("Status with unicode characters", func(t *testing.T) {
		friendship := &Friendship{
			RequesterID: 1,
			RequesteeID: 2,
			Status:      "pending🚀",
		}
		err := friendship.Validate()
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "無効なステータスです")
	})
}

func TestFriendship_StatusTransitionsWithValidation(t *testing.T) {
	friendship := &Friendship{
		RequesterID: 1,
		RequesteeID: 2,
	}

	// Test initial status
	err := friendship.BeforeCreate(nil)
	assert.NoError(t, err)
	assert.Equal(t, string(Pending), friendship.Status)

	// Test valid status transitions
	validStatuses := []FriendshipStatus{Accepted, Rejected}
	for _, status := range validStatuses {
		t.Run("Valid transition to "+string(status), func(t *testing.T) {
			friendship.Status = string(status)
			err := friendship.Validate()
			assert.NoError(t, err)
		})
	}

	// Test invalid status transition
	t.Run("Invalid status transition", func(t *testing.T) {
		friendship.Status = "invalid_status"
		err := friendship.Validate()
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "無効なステータスです")
	})
}

// Benchmark tests for performance
func BenchmarkFriendship_Validate(b *testing.B) {
	friendship := &Friendship{
		RequesterID: 1,
		RequesteeID: 2,
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		friendship.Validate()
	}
}

func BenchmarkFriendship_BeforeCreate(b *testing.B) {
	friendship := &Friendship{
		RequesterID: 1,
		RequesteeID: 2,
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		friendship.BeforeCreate(nil)
	}
}

func BenchmarkFriendship_IsValidStatus(b *testing.B) {
	friendship := &Friendship{}
	status := string(Pending)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		friendship.IsValidStatus(status)
	}
}
