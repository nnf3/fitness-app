resource "google_cloud_run_v2_job" "migrate" {
  project  = var.project_id
  location = "asia-northeast1"
  name     = "fitness-api-migrate"

  template {
    template {
      containers {
        image = "asia-northeast1-docker.pkg.dev/${var.project_id}/${var.registry_repository_migrate_id}/fitness-api-migrate:latest"

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
          value_source {
            secret_key_ref {
              secret  = var.db_url_secret_id
              version = "latest"
            }
          }
        }
      }

      service_account = google_service_account.service_account.email
      max_retries     = 0
      timeout         = "300s"
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].template[0].containers[0].image,
      client,
      client_version,
    ]
  }

  depends_on = [
    google_project_service.services,
    google_project_iam_member.scloud_run_secret_access,
    google_project_iam_member.cloud_run_admin_role,
    google_project_iam_member.sa_token_creator_role,
  ]
}