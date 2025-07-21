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

resource "neon_role" "fitness_app_owner" {
  project_id = var.project_id
  branch_id  = var.branch_id
  name       = "fitness-app-${var.env}-owner"
}

resource "neon_database" "fitness_app" {
  project_id = var.project_id
  branch_id  = var.branch_id
  name       = "fitness-app-${var.env}"
  owner_name = neon_role.fitness_app_owner.name
}