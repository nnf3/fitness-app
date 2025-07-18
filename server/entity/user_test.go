package entity

import (
	"testing"
	"time"
)

func TestUser_IsNameValid(t *testing.T) {
	tests := []struct {
		name string
		user User
		want bool
	}{
		{"valid name", User{Name: "Taro"}, true},
		{"empty name", User{Name: ""}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.user.IsNameValid(); got != tt.want {
				t.Errorf("IsNameValid() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestUser_IsCreatedAtValid(t *testing.T) {
	tests := []struct {
		name string
		user User
		want bool
	}{
		{"valid created_at", User{CreatedAt: time.Now()}, true},
		{"empty created_at", User{CreatedAt: time.Time{}}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.user.IsCreatedAtValid(); got != tt.want {
				t.Errorf("IsCreatedAtValid() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestUser_IsUpdatedAtValid(t *testing.T) {
	tests := []struct {
		name string
		user User
		want bool
	}{
		{"valid updated_at", User{UpdatedAt: time.Now()}, true},
		{"empty updated_at", User{UpdatedAt: time.Time{}}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.user.IsUpdatedAtValid(); got != tt.want {
				t.Errorf("IsUpdatedAtValid() = %v, want %v", got, tt.want)
			}
		})
	}
}
