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

# imported resource
resource "neon_branch" "main" {
  project_id = var.project_id
  name       = "main"
}