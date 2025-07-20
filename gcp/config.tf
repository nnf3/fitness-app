terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "~> 6.44"
    }
  }

  backend "gcs" {
    bucket = "fitness-app-prd-tfstate"
    prefix = "terraform/state"
  }
}

provider "google" {}

locals {
  project_id = "fitness-app-prd"
}