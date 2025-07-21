locals {
  services = [
    "run.googleapis.com",
    "cloudscheduler.googleapis.com",
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
        image = "asia-northeast1-docker.pkg.dev/${var.project_id}/${var.registry_repository_id}/fitness-api:latest"
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

  depends_on = [
    google_project_service.services,
    google_project_iam_member.scloud_run_secret_access,
    google_project_iam_member.cloud_run_admin_role,
    google_project_iam_member.sa_token_creator_role,
  ]
}

resource "google_cloud_scheduler_job" "stop_service" {
  project   = var.project_id
  region    = "asia-northeast1"
  name      = "cloud-run-stop"
  schedule  = "0 0 * * *" # 毎日0時に停止
  time_zone = "Asia/Tokyo"

  http_target {
    http_method = "POST"
    uri         = "https://run.googleapis.com/apis/serving.knative.dev/v1/namespaces/${var.project_id}/services/${google_cloud_run_service.api.name}"
    body        = base64encode(jsonencode({
      spec = {
        traffic = [{
          percent         = 0
          latestRevision  = true
        }]
      }
    }))
    oauth_token {
      service_account_email = google_service_account.service_account.email
    }
    headers = {
      "Content-Type" = "application/json"
    }
  }

  depends_on = [
    google_project_service.services,
  ]
}

resource "google_cloud_scheduler_job" "start_service" {
  project   = var.project_id
  region    = "asia-northeast1"
  name      = "cloud-run-start"
  schedule  = "0 23 * * *" # 毎日23時に起動
  time_zone = "Asia/Tokyo"

  http_target {
    http_method = "POST"
    uri         = "https://run.googleapis.com/apis/serving.knative.dev/v1/namespaces/${var.project_id}/services/${google_cloud_run_service.api.name}"
    body        = base64encode(jsonencode({
      spec = {
        traffic = [{
          percent         = 100
          latestRevision  = true
        }]
      }
    }))
    oauth_token {
      service_account_email = google_service_account.service_account.email
    }
    headers = {
      "Content-Type" = "application/json"
    }
  }

  depends_on = [
    google_project_service.services,
  ]
}