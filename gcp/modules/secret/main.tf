locals {
  services = [
    "secretmanager.googleapis.com",
  ]
}

resource "google_project_service" "services" {
  for_each = toset(local.services)

  project  = var.project_id
  service  = each.value

  disable_dependent_services = true
}

resource "google_secret_manager_secret" "db_url" {
  project   = var.project_id
  secret_id = "neon-db-url"

  replication {
    auto {}
  }

  depends_on = [google_project_service.services]
}

resource "google_secret_manager_secret_version" "db_url_version" {
  secret      = google_secret_manager_secret.db_url.id
  secret_data = var.neon_database_url
}