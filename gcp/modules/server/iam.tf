resource "google_cloud_run_service_iam_member" "invoker" {
  project  = var.project_id
  service  = google_cloud_run_service.api.name
  location = "asia-northeast1"
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_service_account" "service_account" {
  project    = var.project_id
  account_id = "fitness-api-sa"
}

resource "google_project_iam_member" "scloud_run_secret_access" {
  project  = var.project_id
  role     = "roles/secretmanager.secretAccessor"
  member   = "serviceAccount:${google_service_account.service_account.email}"
}

resource "google_project_iam_member" "cloud_run_admin_role" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${google_service_account.service_account.email}"
}

resource "google_project_iam_member" "sa_token_creator_role" {
  project = var.project_id
  role    = "roles/iam.serviceAccountTokenCreator"
  member  = "serviceAccount:${google_service_account.service_account.email}"
}