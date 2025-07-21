locals {
  services = [
    "firebase.googleapis.com",
    "firebasestorage.googleapis.com",
  ]
}

resource "google_project_service" "services" {
  for_each = toset(local.services)

  provider = google-beta
  project  = var.project_id
  service  = each.value

  disable_dependent_services = true
  disable_on_destroy         = false
}

resource "google_firebase_project" "project" {
  provider = google-beta
  project  = var.project_id

  depends_on = [google_project_service.services]
}