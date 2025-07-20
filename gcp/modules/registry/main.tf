resource "google_artifact_registry_repository" "api" {
  project       = var.project_id
  location      = "asia-northeast1"
  repository_id = "fitness-api"
  description   = "Fitness API"
  format        = "DOCKER"
}