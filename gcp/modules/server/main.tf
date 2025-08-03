locals {
  services = [
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
  ]
}

resource "google_project_service" "services" {
  for_each = toset(local.services)

  project  = var.project_id
  service  = each.value

  disable_dependent_services = true
}

resource "google_cloud_run_service" "api" {
  project  = var.project_id
  location = "asia-northeast1"
  name     = "fitness-api"

  template {
    spec {
      service_account_name = google_service_account.service_account.email
      containers {
        image = "asia-northeast1-docker.pkg.dev/${var.project_id}/${var.registry_repository_api_id}/fitness-api:latest"
        ports {
          container_port = 8080
        }
        env {
          name = "APP_ENV"
          value = "production"
        }
        env {
          name = "APP_PORT"
          value = "8080"
        }
        env {
          name  = "DATABASE_URL"
          value_from {
            secret_key_ref {
              key  = "latest"
              name = var.db_url_secret_id
            }
          }
        }
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
      timeout_seconds = 300
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  metadata {
    annotations = {
      "run.googleapis.com/ingress" = "all"
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].spec[0].containers[0].image,
    ]
  }

  depends_on = [
    google_project_service.services,
    google_project_iam_member.scloud_run_secret_access,
    google_project_iam_member.cloud_run_admin_role,
    google_project_iam_member.sa_token_creator_role,
  ]
}