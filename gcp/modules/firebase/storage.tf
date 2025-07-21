resource "google_firebase_storage_bucket" "storage" {
  provider  = google-beta
  project   = var.project_id
  bucket_id = var.storage_bucket_id

  depends_on = [
    google_firebase_project.project,
    google_project_service.services,
  ]
}