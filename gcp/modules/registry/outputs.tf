output "google_artifact_registry_repository" {
  value = {
    api = google_artifact_registry_repository.api
    migrate = google_artifact_registry_repository.migrate
  }
}