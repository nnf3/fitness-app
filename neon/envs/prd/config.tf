terraform {
  required_providers {
    neon = {
      source  = "kislerdm/neon"
      version = ">= 0.2.2"
    }

    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.67"
    }
  }

  backend "gcs" {
    bucket = "fitness-app-prd-tfstate"
    prefix = "neon/state"
  }
}

provider "aws" {
  region = "us-east-1"
}

provider "neon" {
  api_key = var.neon_terraform_api_key
}