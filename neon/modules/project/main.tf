terraform {
  required_providers {
    neon = {
      source = "kislerdm/neon"
      version = "~> 0.9.0"
    }
  }
}

provider "neon" {
  api_key = var.api_key
}

resource "neon_project" "project" {
  name = "fitness-app-${var.env}"
}